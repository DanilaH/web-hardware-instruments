const ORIGIN = 'https://hardwareinspect.com';
const HOST = 'hardwareinspect.com';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY = '29f396b9d25afe406cb8eb5180b51424';
const KEY_LOCATION = `${ORIGIN}/${INDEXNOW_KEY}.txt`;
const MAX_URLS = 10_000;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const rawUrls = args.filter((arg) => arg !== '--dry-run');

if (rawUrls.length === 0) {
  console.error('Usage: pnpm indexnow:submit -- [/path | https://hardwareinspect.com/path ...] [--dry-run]');
  process.exit(1);
}

if (rawUrls.length > MAX_URLS) {
  console.error(`IndexNow accepts at most ${MAX_URLS} URLs per request.`);
  process.exit(1);
}

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
  urlList = [...new Set(rawUrls.map(normalizeUrl))];
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
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
