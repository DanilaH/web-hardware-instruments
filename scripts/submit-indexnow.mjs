const ORIGIN = 'https://hardwareinspect.com';
const HOST = 'hardwareinspect.com';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY = '29f396b9d25afe406cb8eb5180b51424';
const KEY_LOCATION = `${ORIGIN}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `${ORIGIN}/sitemap-index.xml`;
const MAX_URLS = 10_000;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const sitemapMode = args.includes('--sitemap');
const rawUrls = args.filter((arg) => arg !== '--dry-run' && arg !== '--sitemap');

if (!sitemapMode && rawUrls.length === 0) {
  console.error(
    'Usage: pnpm indexnow:submit -- [--sitemap] [/path | https://hardwareinspect.com/path ...] [--dry-run]',
  );
  process.exit(1);
}

const decodeXml = (value) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");

const extractLocations = (xml) =>
  [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/giu)].map((match) => decodeXml(match[1].trim()));

const readSitemap = async (url, seen = new Set()) => {
  if (seen.has(url)) return [];
  seen.add(url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap ${url}: HTTP ${response.status}`);
  }

  const xml = await response.text();
  const locations = extractLocations(xml);

  if (/<sitemapindex\b/iu.test(xml)) {
    const nested = await Promise.all(locations.map((location) => readSitemap(location, seen)));
    return nested.flat();
  }

  if (!/<urlset\b/iu.test(xml)) {
    throw new Error(`Unsupported sitemap document: ${url}`);
  }

  return locations;
};

const normalizeUrl = (value) => {
  const url = value.startsWith('/') ? new URL(value, ORIGIN) : new URL(value);

  if (url.origin !== ORIGIN) {
    throw new Error(`URL must belong to ${ORIGIN}: ${value}`);
  }

  url.hash = '';
  return url.href;
};

let urlList;
try {
  const sitemapUrls = sitemapMode ? await readSitemap(SITEMAP_URL) : [];
  urlList = [...new Set([...sitemapUrls, ...rawUrls].map(normalizeUrl))];
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

if (urlList.length === 0) {
  console.error('No URLs found to submit.');
  process.exit(1);
}

if (urlList.length > MAX_URLS) {
  console.error(`IndexNow accepts at most ${MAX_URLS} URLs per request; got ${urlList.length}.`);
  process.exit(1);
}

const payload = {
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

if (dryRun) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const response = await fetch(INDEXNOW_ENDPOINT, {
  method: 'POST',
  headers: {
    'content-type': 'application/json; charset=utf-8',
  },
  body: JSON.stringify(payload),
});

if (response.status !== 200 && response.status !== 202) {
  const body = await response.text();
  console.error(`IndexNow submission failed: HTTP ${response.status}${body ? `\n${body}` : ''}`);
  process.exit(1);
}

console.log(
  `IndexNow accepted ${urlList.length} URL${urlList.length === 1 ? '' : 's'} (HTTP ${response.status}).`,
);
