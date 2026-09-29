import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { Script } from 'node:vm';

const root = process.cwd();
const dist = resolve(root, 'dist');

assert(existsSync(dist), 'Folder dist/ harus ada. Jalankan "npm run build" terlebih dahulu.');

// Pastikan source development tidak masuk ke dist
for (const devFile of ['src', 'scripts', 'build.mjs', 'serve.mjs', 'README.md']) {
  assert(!existsSync(resolve(dist, devFile)), `Development source "${devFile}" tidak boleh ada di dalam dist/`);
}

const original = readFileSync(resolve(root, 'src/hero-approved.html'), 'utf8');
const home = readFileSync(resolve(dist, 'index.html'), 'utf8');
const hero = html => html.match(/<section class="hero"[\s\S]*?<\/section>/)[0];
const baseCss = html => html.match(/<style>([\s\S]*?)<\/style>/)[1];

assert.equal(hero(home), hero(original), 'Approved hero markup must not change');
assert.equal(baseCss(home), baseCss(original), 'Approved hero stylesheet must not change');

const routes = JSON.parse(readFileSync(resolve(dist, 'routes.json'), 'utf8'));
const titles = new Set();
const internalLinks = new Set();
let imageCount = 0;

for (const route of routes) {
  const filename = route === '/' ? 'index.html' : route === '/404' ? '404.html' : `.${route}/index.html`;
  const targetPath = resolve(dist, filename);
  assert(existsSync(targetPath), `Missing built HTML file: ${filename} in dist/`);
  const html = readFileSync(targetPath, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  assert(!titles.has(title), `Duplicate title: ${title}`);
  titles.add(title);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `One H1 required: ${route}`);

  for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Script(script[1]);

  for (const match of html.matchAll(/<(?:img|script|link)\b[^>]*?\b(?:src|href)="([^"]+)"/g)) {
    if (/^(https?:|#)/.test(match[1])) continue;
    const url = new URL(match[1], `http://localhost:4173${route === '/' ? '/' : route + '/'}`);
    assert(existsSync(resolve(dist, `.${url.pathname}`)), `Missing local asset ${url.pathname} on ${route} in dist/`);
    imageCount += 1;
  }

  for (const match of html.matchAll(/<a\b[^>]*href="([^"#][^"]*)"/g)) {
    if (/^https?:/.test(match[1])) continue;
    const url = new URL(match[1], `http://localhost:4173${route === '/' ? '/' : route + '/'}`);
    internalLinks.add(url.pathname);
    if (url.hash) {
      const targetRoute = url.pathname.replace(/\/$/, '') || '/';
      const targetFile = targetRoute === '/' ? 'index.html' : `.${targetRoute}/index.html`;
      const target = readFileSync(resolve(dist, targetFile), 'utf8');
      assert(target.includes(`id="${url.hash.slice(1)}"`), `Broken fragment ${url.href}`);
    }
  }
}

for (const asset of ['app.js', 'site-config.js']) {
  new Script(readFileSync(resolve(dist, asset), 'utf8'));
}

const results = await Promise.all([...internalLinks].map(async route => {
  const response = await fetch(`http://localhost:4173${route}`);
  assert.equal(response.status, 200, `Route failed: ${route}`);
  assert(response.headers.get('content-type').includes('text/html'));
  return route;
}));

const missing = await fetch('http://localhost:4173/produk/tidak-ada');
assert.equal(missing.status, 404);
assert((await missing.text()).includes('Mari kembali'));

const css = await fetch('http://localhost:4173/site.css');
assert(css.headers.get('content-type').includes('text/css'));

console.log(`PASS: dist/ verified; approved hero preserved; ${routes.length} HTML pages, ${titles.size} unique titles, ${imageCount} asset references, ${results.length} live routes, custom 404, CSS MIME, and JavaScript syntax.`);
