import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4', '.json': 'application/json', '.woff2': 'font/woff2' };
createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!path.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
    let stat = statSync(path);
    if (stat.isDirectory()) { path = resolve(path, 'index.html'); stat = statSync(path); }
    if (!stat.isFile()) throw new Error('Not a file');
    const headers = { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
    if (req.headers.range) {
      const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      const start = Number(range?.[1]);
      const end = range?.[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
      if (!range || start > end || start >= stat.size) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); res.end(); return; }
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
      if (req.method === 'HEAD') res.end(); else createReadStream(path, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { ...headers, 'Content-Length': stat.size });
      if (req.method === 'HEAD') res.end(); else createReadStream(path).pipe(res);
    }
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    if (req.method === 'HEAD') res.end();
    else { const stream = createReadStream(resolve(root, '404.html')); stream.on('error', () => res.end('Not found')); stream.pipe(res); }
  }
}).listen(4173, '127.0.0.1', () => console.log('Putri Florist: http://localhost:4173'));
