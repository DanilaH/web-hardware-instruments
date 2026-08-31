import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
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

const extractCanonical = (html) =>
  html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;

const hasNoindex = (html) =>
  /<meta\s+name=["']robots["']\s+content=["'][^"']*\bnoindex\b[^"']*["'][^>]*>/i.test(html);

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

if (!/^Allow:\s*\/$/m.test(robots) || !/^Sitemap:\s*https?:\/\//m.test(robots)) {
  fail('indexing is enabled but robots.txt is missing Allow: / or the sitemap declaration');
}

if (!hasSitemapIndex || sitemapFiles.length === 0) {
  fail('indexing is enabled but the generated sitemap set is incomplete');
}

const sitemapUrls = new Set();
for (const sitemapFile of sitemapFiles) {
  for (const url of extractLocs(await readText(sitemapFile))) {
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
