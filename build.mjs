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

const routesJson = JSON.stringify([...pages.keys()], null, 2);
writeFileSync(resolve(dist, 'routes.json'), routesJson);
writeFileSync(resolve(root, 'routes.json'), routesJson);

// Salin file publik browser ke dist
for (const file of ['site.css', 'app.js', 'site-config.js']) {
  copyFileSync(resolve(root, file), resolve(dist, file));
}

// Salin seluruh assets (termasuk 507 asset gallery) ke dist/assets
cpSync(resolve(root, 'assets'), resolve(dist, 'assets'), { recursive: true });

console.log(`Built ${pages.size} static HTML pages into dist/. Assets and public scripts bundled. Approved hero preserved.`);
