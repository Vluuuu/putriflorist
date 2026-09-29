import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { renderPages } from './src/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const context = { window: {} };
runInNewContext(readFileSync(resolve(root, 'site-config.js'), 'utf8'), context);
const approved = readFileSync(resolve(root, 'src/hero-approved.html'), 'utf8');
const pages = renderPages(context.window.PUTRI_FLORIST, approved);
for (const [route, html] of pages) {
  const target = resolve(root, route === '/' ? 'index.html' : route === '/404' ? '404.html' : `.${route}/index.html`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
}
writeFileSync(resolve(root, 'routes.json'), JSON.stringify([...pages.keys()], null, 2));
console.log(`Built ${pages.size} static HTML pages. Approved hero preserved.`);
