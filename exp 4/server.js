const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.url === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'Server Running',
      uptime: `${Math.floor(process.uptime())}s`,
      nodeVersion: process.version,
      timestamp: new Date().toLocaleTimeString()
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1 style="font-family:sans-serif;text-align:center;margin-top:50px;color:#ef4444;">404 - Page Not Found</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
