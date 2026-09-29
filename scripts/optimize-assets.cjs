// Optional development utility; sharp is not shipped to the browser.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.argv[2] || 'sharp');
const root = path.resolve(__dirname, '..');
(async () => {
  const output = path.join(root, 'assets', 'catalog');
  fs.mkdirSync(output, { recursive: true });
  for (const name of fs.readdirSync(path.join(root, 'assets', 'originals')).filter(name => name.endsWith('.png'))) {
    for (const width of [480, 960]) {
      await sharp(path.join(root, 'assets', 'originals', name)).resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(path.join(output, `${path.parse(name).name}-${width}.webp`));
    }
  }
  const files = fs.readdirSync(output);
  console.log(`${files.length} WebP assets, ${Math.round(files.reduce((sum, file) => sum + fs.statSync(path.join(output, file)).size, 0) / 1024)} KB total`);
})().catch(error => { console.error(error); process.exitCode = 1; });
