# Dockerized MERN App

A full-stack MERN (MongoDB, Express, React, Node.js) application running in Docker containers, with a visual MongoDB GUI via mongo-express.

## Stack

| Service | Image | Port |
|---|---|---|
| MongoDB | `mongo:7` | 27017 (internal) |
| mongo-express | `mongo-express:latest` | 8081 |
| Express API | Custom (`node:20-alpine`) | 5000 |
| React (nginx) | Custom (`nginx:alpine`) | 3000 |

## Project Structure

```
dockerized-mern-app/
├── client/
│   ├── src/
│   │   ├── App.jsx        # Fetches /api/items, add/delete UI
│   │   └── index.css      # Dark theme styles
│   ├── nginx.conf         # nginx config for serving the build
│   ├── Dockerfile         # Multi-stage: Node build → nginx serve
│   └── package.json
├── server/
│   ├── index.js           # Express API + Mongoose + seed data
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml     # 4 services: mongo, mongo-express, server, client
└── .env
```

## Running

```bash
docker-compose up --build
```

| URL | Description |
|---|---|
| http://localhost:3000 | React frontend |
| http://localhost:5000/api/items | Express REST API |
| http://localhost:8081 | mongo-express GUI (admin / admin123) |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/items | Fetch all items |
| POST | /api/items | Create item `{ name, description }` |
| DELETE | /api/items/:id | Delete an item |
| GET | /health | Health check |

## Stop

```bash
docker-compose down          # Stop containers
docker-compose down -v       # Stop + delete MongoDB data volume
```

---

## nginx — Three Modes Explained

---

### Mode 1 — Local Development (no nginx at all)

Vite's dev server handles everything. No build step, no nginx needed.

```
Browser
  │
  └── GET http://localhost:5173  ──→  Vite Dev Server
                                        (hot reload, instant edits)
```

---

### Mode 2 — Docker / Production: Static Serve Only ← THIS PROJECT

`npm run build` produces static files in `dist/`. nginx serves those files to the browser.
After the browser downloads the React app, **nginx steps out completely**.
Every API call goes **directly** from the browser to Express — nginx is not involved.

```
Browser
  │
  ├── GET http://localhost:3000          ──→  nginx  ──→  serves dist/index.html
  │                                           nginx job DONE ✅ steps out
  │
  ├── GET http://localhost:5000/api/items  ──→  Express ──→  MongoDB
  │        (React calls Express directly, nginx NOT involved)
  │
  └── POST http://localhost:5000/api/items ──→  Express ──→  MongoDB
```

> nginx only serves the initial HTML/CSS/JS files. After that it does nothing.

---

### Mode 3 — Production on AWS: nginx as a True Gateway / Reverse Proxy

nginx is configured as a **reverse proxy**. The browser talks to **only one port (80/443)**.
nginx reads the URL path and decides where to route the request internally.

```
Browser
  │
  └── Everything goes to nginx (port 80/443) — only ONE port exposed
            │
            ├── GET  /                   ──→  nginx serves React (dist/) directly
            │
            ├── GET  /api/items          ──→  nginx proxies ──→  Express:5000 ──→  MongoDB
            │                                  (internally, browser never sees port 5000)
            │
            └── POST /api/items          ──→  nginx proxies ──→  Express:5000 ──→  MongoDB
```

**nginx.conf for proxy mode (AWS):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve React build files
    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    # Proxy all /api/* requests to Express internally
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Mode 2 vs Mode 3 comparison:**

| | Mode 2 (This project) | Mode 3 (AWS Production) |
|---|---|---|
| Ports exposed to internet | 3000 (nginx) + 5000 (Express) | Only 80/443 (nginx) |
| CORS issues | Yes (different ports = different origin) | No (same origin, one port) |
| Express exposed publicly | ✅ Yes | ❌ No (internal only, more secure) |
| SSL/HTTPS | Separate config needed | nginx handles it centrally |
| Rate limiting / auth at gateway | ❌ Not possible | ✅ nginx applies before Express |

---

### Summary

| Environment | nginx role | Notes |
|---|---|---|
| Local dev (`npm run dev`) | ❌ Not used | Vite dev server handles everything |
| Docker / this project | 📦 Serves `dist/` files only | React calls Express directly on port 5000 |
| AWS / Production | 🔀 Full reverse proxy gateway | Single entry point, routes all traffic internally |
