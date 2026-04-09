const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9090;
const DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.yml':  'text/yaml; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  // CORS headers for API testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  let filePath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const fullPath = path.join(DIR, filePath);

  // Security: prevent directory traversal
  if (!fullPath.startsWith(DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
      }
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Internal Server Error');
    }

    const ext = path.extname(fullPath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  ┌─────────────────────────────────────────────┐`);
  console.log(`  │                                             │`);
  console.log(`  │   🚀 Shaghlaty Admin API — Swagger UI       │`);
  console.log(`  │                                             │`);
  console.log(`  │   Local:  http://localhost:${PORT}            │`);
  console.log(`  │                                             │`);
  console.log(`  │   Auth:   Click "Authenticate" in header    │`);
  console.log(`  │   Token:  Paste your API token              │`);
  console.log(`  │                                             │`);
  console.log(`  └─────────────────────────────────────────────┘\n`);
});
