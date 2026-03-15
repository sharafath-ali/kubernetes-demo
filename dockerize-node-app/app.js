const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Node.js in Docker</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 60px; background: #1a202c; color: #e2e8f0; }
        h1 { font-size: 2.5rem; color: #68d391; }
        .box { display: inline-block; background: #2d3748; padding: 20px 40px; border-radius: 12px; margin-top: 20px; }
        .badge { background: #3182ce; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; }
        p { color: #a0aec0; }
      </style>
    </head>
    <body>
      <h1>🚀 Node.js inside Docker!</h1>
      <div class="box">
        <p>Server is running on port <strong>${PORT}</strong></p>
        <p>Request path: <strong>${req.url}</strong></p>
        <br/>
        <span class="badge">✅ Dockerized Node App</span>
      </div>
    </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop`);
});
