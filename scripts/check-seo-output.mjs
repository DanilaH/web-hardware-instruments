import { readdir, readFile } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));
const distDir = process.env.SEO_DIST_DIR ?? join(rootDir, '..', 'dist');
const expectedHreflangs = new Set(['en', 'pt-BR', 'de', 'fr', 'es', 'ru', 'x-default']);

const fail = (message) => {
  throw new Error(`[seo-output] ${message}`);
};

const readText = (path) => readFile(path, 'utf8');

const walkHtml = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_astro') continue;
      files.push(...await walkHtml(path));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path);
    }
  }

  return files;
};

const extractAttribute = (tag, name) =>
  tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] ?? null;

const findTagByAttribute = (html, tagName, attribute, value) => {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];
  return tags.find((tag) => extractAttribute(tag, attribute)?.toLowerCase() === value) ?? null;
};

const extractCanonical = (html) => {
  const tag = findTagByAttribute(html, 'link', 'rel', 'canonical');
  return tag ? extractAttribute(tag, 'href') : null;
};

const extractAlternates = (html, rel) => {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const alternates = new Map();
  const hrefs = new Set();

  for (const tag of tags) {
    if (extractAttribute(tag, 'rel')?.toLowerCase() !== 'alternate') continue;

    const hreflang = extractAttribute(tag, 'hreflang');
    const href = extractAttribute(tag, 'href');
    if (!hreflang || !href) fail(`${rel} has an alternate link without hreflang or href`);
    if (alternates.has(hreflang)) fail(`${rel} has duplicate hreflang ${hreflang}`);
    if (hrefs.has(href)) fail(`${rel} points multiple hreflangs at the same alternate URL: ${href}`);

    alternates.set(hreflang, href);
    hrefs.add(href);
  }

  return alternates;
};

const extractHtmlLang = (html) => {
  const tag = html.match(/<html\b[^>]*>/i)?.[0] ?? null;
  return tag ? extractAttribute(tag, 'lang') : null;
};

const extractTitle = (html) => html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? null;

const extractMetaDescription = (html) => {
  const tag = findTagByAttribute(html, 'meta', 'name', 'description');
  return tag ? extractAttribute(tag, 'content') : null;
};

const extractH1s = (html) =>
  [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => match[1]);

const normalizeVisibleText = (value) =>
  value?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLocaleLowerCase() ?? '';

const hasNoindex = (html) => {
  const tag = findTagByAttribute(html, 'meta', 'name', 'robots');
  const content = tag ? extractAttribute(tag, 'content') : null;
  return content !== null && /\bnoindex\b/i.test(content);
};

const extractLocs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

const expectedPathForHtmlFile = (rel) => {
  const normalized = rel.replaceAll('\\', '/');
  if (normalized === 'index.html') return '/';
  return `/${normalized.replace(/\.html$/, '')}`;
};

const assertNoEnPrefix = (url, context) => {
  const pathname = new URL(url).pathname;
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    fail(`${context} must not use the forbidden /en/ prefix: ${url}`);
  }
};

const rootEntries = await readdir(distDir, { withFileTypes: true });
const htmlFiles = await walkHtml(distDir);
const robots = await readText(join(distDir, 'robots.txt'));
const sitemapFiles = rootEntries
  .filter((entry) => entry.isFile() && /^sitemap-\d+\.xml$/.test(entry.name))
  .map((entry) => join(distDir, entry.name));
const hasSitemapIndex = rootEntries.some((entry) => entry.isFile() && entry.name === 'sitemap-index.xml');
const indexingEnabled = hasSitemapIndex || sitemapFiles.length > 0;

if (!indexingEnabled) {
  if (!/^Disallow:\s*\/$/m.test(robots)) {
    fail('indexing is disabled but robots.txt does not disallow the site');
  }

  for (const htmlFile of htmlFiles) {
    const html = await readText(htmlFile);
    if (!hasNoindex(html)) {
      fail(`${relative(distDir, htmlFile)} is missing noindex while indexing is disabled`);
    }
  }

  console.log(`[seo-output] indexing disabled: ${htmlFiles.length} HTML documents are protected`);
  process.exit(0);
}

if (!/^Allow:\s*\/$/m.test(robots)) {
  fail('indexing is enabled but robots.txt is missing Allow: /');
}

if (!hasSitemapIndex || sitemapFiles.length === 0) {
  fail('indexing is enabled but the generated sitemap set is incomplete');
}

const homepageHtml = await readText(join(distDir, 'index.html'));
const homepageCanonical = extractCanonical(homepageHtml);
if (!homepageCanonical) fail('homepage is missing a canonical URL');

const canonicalOrigin = new URL(homepageCanonical).origin;
const declaredSitemap = robots.match(/^Sitemap:\s*(\S+)\s*$/mi)?.[1] ?? null;
const expectedSitemapIndex = new URL('/sitemap-index.xml', canonicalOrigin).href;
if (declaredSitemap !== expectedSitemapIndex) {
  fail(`robots.txt sitemap must use the canonical origin: expected ${expectedSitemapIndex}, got ${declaredSitemap ?? 'none'}`);
}

const sitemapIndexUrls = new Set(extractLocs(await readText(join(distDir, 'sitemap-index.xml'))));
const expectedSitemapFiles = new Set(
  sitemapFiles.map((file) => new URL(`/${basename(file)}`, canonicalOrigin).href),
);

for (const expected of expectedSitemapFiles) {
  if (!sitemapIndexUrls.has(expected)) fail(`sitemap index is missing ${expected}`);
}
for (const indexed of sitemapIndexUrls) {
  if (!expectedSitemapFiles.has(indexed)) fail(`sitemap index references an unexpected sitemap: ${indexed}`);
}

const sitemapUrls = new Set();
for (const sitemapFile of sitemapFiles) {
  for (const url of extractLocs(await readText(sitemapFile))) {
    if (new URL(url).origin !== canonicalOrigin) {
      fail(`sitemap URL uses a different origin: ${url}`);
    }
    assertNoEnPrefix(url, 'sitemap URL');
    if (sitemapUrls.has(url)) fail(`duplicate sitemap URL: ${url}`);
    sitemapUrls.add(url);
  }
}

const pagesByCanonical = new Map();
for (const htmlFile of htmlFiles) {
  const rel = relative(distDir, htmlFile);
  const html = await readText(htmlFile);
  const canonical = extractCanonical(html);
  const is404 = rel === '404.html';

  if (is404) {
    if (!hasNoindex(html)) fail('404.html must remain noindex');
    continue;
  }

  if (!canonical) fail(`${rel} is missing a canonical URL`);
  const canonicalUrl = new URL(canonical);
  if (canonicalUrl.origin !== canonicalOrigin) fail(`${rel} canonical uses a different origin: ${canonical}`);
  if (canonicalUrl.search || canonicalUrl.hash) fail(`${rel} canonical must not contain a query or fragment: ${canonical}`);
  assertNoEnPrefix(canonical, `${rel} canonical`);

  const expectedPath = expectedPathForHtmlFile(rel);
  if (canonicalUrl.pathname !== expectedPath) {
    fail(`${rel} canonical path is not the final built route: expected ${expectedPath}, got ${canonicalUrl.pathname}`);
  }

  if (hasNoindex(html)) fail(`${rel} is unexpectedly noindex while indexing is enabled`);
  if (pagesByCanonical.has(canonical)) fail(`duplicate canonical URL: ${canonical}`);

  const lang = extractHtmlLang(html);
  if (!lang) fail(`${rel} is missing html lang`);

  const title = normalizeVisibleText(extractTitle(html));
  const description = normalizeVisibleText(extractMetaDescription(html));
  const h1s = extractH1s(html).map(normalizeVisibleText).filter(Boolean);
  if (!title) fail(`${rel} is missing a non-empty title`);
  if (!description) fail(`${rel} is missing a non-empty meta description`);
  if (h1s.length !== 1) fail(`${rel} must contain exactly one non-empty H1; found ${h1s.length}`);

  const alternates = extractAlternates(html, rel);
  if (alternates.size !== expectedHreflangs.size) {
    fail(`${rel} must expose ${expectedHreflangs.size} hreflang entries; found ${alternates.size}`);
  }
  for (const hreflang of expectedHreflangs) {
    if (!alternates.has(hreflang)) fail(`${rel} is missing hreflang ${hreflang}`);
  }
  for (const hreflang of alternates.keys()) {
    if (!expectedHreflangs.has(hreflang)) fail(`${rel} exposes unexpected hreflang ${hreflang}`);
  }
  if (!expectedHreflangs.has(lang)) fail(`${rel} uses unsupported html lang ${lang}`);
  if (alternates.get(lang) !== canonical) {
    fail(`${rel} self hreflang ${lang} must equal its canonical URL`);
  }

  for (const [hreflang, href] of alternates) {
    const alternateUrl = new URL(href);
    if (alternateUrl.origin !== canonicalOrigin) {
      fail(`${rel} hreflang ${hreflang} uses a different origin: ${href}`);
    }
    assertNoEnPrefix(href, `${rel} hreflang ${hreflang}`);
  }

  if (!sitemapUrls.has(canonical)) {
    const canonicalPathname = canonicalUrl.pathname;
    const nearbySitemapUrls = [...sitemapUrls]
      .filter((url) => new URL(url).pathname === canonicalPathname || canonicalPathname === '/')
      .slice(0, 8);
    const diagnostic = nearbySitemapUrls.length > 0
      ? ` Sitemap candidates: ${nearbySitemapUrls.join(', ')}.`
      : ` Sitemap sample: ${[...sitemapUrls].slice(0, 8).join(', ') || 'empty'}.`;
    fail(`${rel} canonical is not present verbatim in the sitemap: ${canonical}.${diagnostic} Align hosting URL form, redirects, canonicals, and sitemap entries before release.`);
  }

  pagesByCanonical.set(canonical, {
    rel,
    canonical,
    lang,
    title,
    description,
    h1: h1s[0],
    alternates,
  });
}

for (const sitemapUrl of sitemapUrls) {
  if (!pagesByCanonical.has(sitemapUrl)) {
    fail(`sitemap URL has no matching indexable canonical page: ${sitemapUrl}`);
  }
}

for (const page of pagesByCanonical.values()) {
  for (const [hreflang, href] of page.alternates) {
    const target = pagesByCanonical.get(href);
    if (!target) fail(`${page.rel} hreflang ${hreflang} points to a missing/non-indexable page: ${href}`);

    if (hreflang === 'x-default') {
      if (target.lang !== 'en') fail(`${page.rel} x-default must point to the English semantic page: ${href}`);
      continue;
    }

    if (target.lang !== hreflang) {
      fail(`${page.rel} hreflang ${hreflang} points to a page with html lang ${target.lang}: ${href}`);
    }
    if (target.alternates.get(page.lang) !== page.canonical) {
      fail(`${page.rel} and ${target.rel} do not expose reciprocal hreflang links`);
    }
  }

  const english = pagesByCanonical.get(page.alternates.get('x-default'));
  if (!english) fail(`${page.rel} has no resolvable English x-default page`);
  if (english.alternates.get('x-default') !== english.canonical) {
    fail(`${english.rel} x-default must point to its own English canonical`);
  }

  if (page.lang !== 'en') {
    if (page.title === english.title) fail(`${page.rel} title appears to fall back to English`);
    if (page.description === english.description) fail(`${page.rel} meta description appears to fall back to English`);
    if (page.h1 === english.h1) fail(`${page.rel} H1 appears to fall back to English`);
  }
}

console.log(
  `[seo-output] indexing enabled: ${pagesByCanonical.size} canonical URLs match the generated sitemap; localized lang/title/meta/H1 and reciprocal hreflang contracts pass`,
);
