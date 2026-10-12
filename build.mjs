import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, cpSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { renderPages } from './src/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = resolve(root, 'dist');

// Bersihkan dist dari awal setiap kali build
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const context = { window: {} };
runInNewContext(readFileSync(resolve(root, 'site-config.js'), 'utf8'), context);
const approved = readFileSync(resolve(root, 'src/hero-approved.html'), 'utf8');
const pages = renderPages(context.window.PUTRI_FLORIST, approved);

for (const [route, html] of pages) {
  const target = resolve(dist, route === '/' ? 'index.html' : route === '/404' ? '404.html' : `.${route}/index.html`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
}

const routes = [...pages.keys()];
const routesJson = JSON.stringify(routes, null, 2);
writeFileSync(resolve(dist, 'routes.json'), routesJson);
writeFileSync(resolve(root, 'routes.json'), routesJson);

// Salin file publik browser ke dist
for (const file of ['site.css', 'app.js', 'site-config.js', 'favicon.svg']) {
  copyFileSync(resolve(root, file), resolve(dist, file));
}

// Salin seluruh assets (termasuk asset galeri) ke dist/assets
cpSync(resolve(root, 'assets'), resolve(dist, 'assets'), { recursive: true });

// Buat robots.txt
const siteUrl = (context.window.PUTRI_FLORIST.siteUrl || 'https://putriflorist.id').replace(/\/$/, '');
const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
writeFileSync(resolve(dist, 'robots.txt'), robotsTxt);
writeFileSync(resolve(root, 'robots.txt'), robotsTxt);

// Buat sitemap.xml
const today = new Date().toISOString().split('T')[0];
const sitemapRoutes = routes.filter(route => route !== '/404');
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map(route => {
  const loc = `${siteUrl}${route === '/' ? '/' : route}`;
  const priority = route === '/' ? '1.0' : route === '/customize' || route === '/produk' ? '0.9' : '0.8';
  const changefreq = route === '/' ? 'daily' : 'weekly';
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n')}
</urlset>\n`;
writeFileSync(resolve(dist, 'sitemap.xml'), sitemapXml);
writeFileSync(resolve(root, 'sitemap.xml'), sitemapXml);

// Buat _headers untuk Cloudflare Pages
const headersContent = `/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/site.css
  Cache-Control: public, max-age=86400

/app.js
  Cache-Control: public, max-age=86400
`;
writeFileSync(resolve(dist, '_headers'), headersContent);
writeFileSync(resolve(root, '_headers'), headersContent);

console.log(`Built ${pages.size} static HTML pages into dist/. Assets, robots.txt, sitemap.xml, _headers, and scripts bundled.`);
