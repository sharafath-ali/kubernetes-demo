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

## Why nginx? Dev vs Production vs AWS

### In Development (no nginx needed)

During development you use `npm run dev` (Vite dev server). Vite handles everything: hot module replacement, fast refresh, on-the-fly bundling. You access the app directly on `http://localhost:5173`. **No nginx required.**

```
Browser → Vite Dev Server (port 5173) → Edits reflected instantly
```

### In a Docker Container / Production (nginx is required)

`npm run build` compiles React into **static files** (HTML, CSS, JS) in a `dist/` folder. These are just files — they need an HTTP server to actually serve them to a browser. This is where nginx comes in.

```
Browser → nginx (port 80) → serves dist/ files → React app loads
         ↓
     React calls → Express API (port 5000) → MongoDB
```

**Why nginx and not just Node.js?**

| Feature | nginx | Node.js (`serve`/`vite preview`) |
|---|---|---|
| Performance | Extremely fast (C, event-driven) | Slower for static files |
| Image size | ~5 MB (`nginx:alpine`) | ~150 MB (Node + deps) |
| Caching headers | Built-in, configurable | Manual setup needed |
| Gzip compression | Built-in | Needs middleware |
| HTTPS/SSL | First-class support | Needs extra config |
| Industry standard | ✅ Yes | ❌ Not for production |

### On AWS (nginx as a Reverse Proxy)

On AWS (EC2, ECS, etc.) nginx takes on an even bigger role — it becomes a **reverse proxy** sitting in front of all your services:

```
Internet
   ↓
AWS Load Balancer (port 443 HTTPS)
   ↓
nginx (port 80/443 on EC2 or as a container)
   ├── /          → serves React static files (dist/)
   ├── /api/*     → proxies to Express backend (port 5000)
   └── SSL termination (HTTPS certificates via certbot/ACM)
```

**nginx config on AWS would look like:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve React frontend
    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    # Proxy API requests to Express
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Benefits on AWS:**
- Single entry point — one port exposed, nginx routes internally
- SSL termination — nginx handles HTTPS, Express stays HTTP internally
- Can serve millions of requests with minimal resources
- Works with AWS services — sits behind ALB (Application Load Balancer) or CloudFront

### Summary

| Environment | nginx needed? | Why |
|---|---|---|
| Local dev (`npm run dev`) | ❌ No | Vite dev server handles it |
| Docker / Production build | ✅ Yes | Serves the static `dist/` files |
| AWS / Cloud | ✅ Yes (extended role) | Reverse proxy + SSL + routing |
