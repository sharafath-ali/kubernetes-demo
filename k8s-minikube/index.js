import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from a container!', service: 'nodejs-app', pod: process.env.POD_NAME || 'unknown', timestamp: new Date().toISOString() });
});

app.get("/readyz", (req, res) => {
  res.json({ status: "ok" });
});

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
