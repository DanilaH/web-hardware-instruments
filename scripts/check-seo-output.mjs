import { readdir, readFile } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));
const distDir = process.env.SEO_DIST_DIR ?? join(rootDir, '..', 'dist');

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

const hasNoindex = (html) => {
  const tag = findTagByAttribute(html, 'meta', 'name', 'robots');
  const content = tag ? extractAttribute(tag, 'content') : null;
  return content !== null && /\bnoindex\b/i.test(content);
};

const extractLocs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

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
    sitemapUrls.add(url);
  }
}

const canonicalUrls = new Set();
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
  if (new URL(canonical).origin !== canonicalOrigin) fail(`${rel} canonical uses a different origin: ${canonical}`);
  if (hasNoindex(html)) fail(`${rel} is unexpectedly noindex while indexing is enabled`);
  if (canonicalUrls.has(canonical)) fail(`duplicate canonical URL: ${canonical}`);

  canonicalUrls.add(canonical);

  if (!sitemapUrls.has(canonical)) {
    fail(`${rel} canonical is not present verbatim in the sitemap: ${canonical}. Align hosting URL form, redirects, canonicals, and sitemap entries before release.`);
  }
}

for (const sitemapUrl of sitemapUrls) {
  if (!canonicalUrls.has(sitemapUrl)) {
    fail(`sitemap URL has no matching indexable canonical page: ${sitemapUrl}`);
  }
}

console.log(`[seo-output] indexing enabled: ${canonicalUrls.size} canonical URLs match the generated sitemap`);
