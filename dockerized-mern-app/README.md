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

## Environment Variables

The `env_file: - .env` line in `docker-compose.yml` ensures that all variables in `.env` are injected into the container's environment and thus available via `process.env` in your Node.js code.

- **Substitution**: `${VAR}` in `docker-compose.yml` is replaced by Docker Compose before starting services.
- **Injection**: `env_file` passes variables directly into the running container.

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

## nginx — Complete Guide

---

### First: nginx vs Node.js for serving React

When you run `npm run build`, React compiles to plain static files (`dist/`).
You need something to serve those files over HTTP. You have two choices:

| Feature | nginx | Node.js (`serve` / `vite preview`) |
|---|---|---|
| Performance | Extremely fast (written in C) | Slower for static files |
| Docker image size | ~5 MB (`nginx:alpine`) | ~150 MB (Node + packages) |
| HTTP caching headers | Built-in | Manual setup needed |
| Gzip compression | Built-in | Needs middleware |
| SSL/HTTPS | First-class support | Complex config |
| Reverse proxy / routing | Yes (core feature) | Not designed for it |
| Used in production | Industry standard | Dev/demo only |

**nginx wins for production. Node.js servers are fine only for local demos.**

---

### nginx has TWO ways it can be used in a MERN app

---

### Option A — Static Serve Only (THIS PROJECT)

nginx only serves the React `dist/` files. Once the browser loads React,
nginx steps out. The React app calls Express **directly** on port 5000.

```
Browser
  |
  |-- GET http://localhost:3000          ---> nginx ---> serves dist/index.html
  |                                           nginx job DONE, steps out
  |
  |-- GET http://localhost:5000/api/items  ---> Express ---> MongoDB
  |       (React calls Express directly, nginx NOT involved)
  |
  `-- POST http://localhost:5000/api/items ---> Express ---> MongoDB
```

**nginx.conf for Option A (current):**
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

---

### Option B — Reverse Proxy / Gateway (PRODUCTION / AWS)

nginx sits in front of everything. Browser talks to **only one port (80/443)**.
nginx reads the URL path and routes internally — Express is never exposed publicly.

```
Browser
  |
  `-- Everything goes to nginx (port 80/443) only
            |
            |-- GET  /                ---> nginx serves React (dist/) directly
            |
            |-- GET  /api/items       ---> nginx proxies ---> Express:5000 ---> MongoDB
            |                               (port 5000 never exposed to internet)
            |
            `-- POST /api/items       ---> nginx proxies ---> Express:5000 ---> MongoDB
```

**nginx.conf for Option B (production):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve React build files
    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    # Proxy all /api/* to Express -- browser never sees port 5000
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### Option A vs Option B comparison

| | Option A (This project) | Option B (AWS Production) |
|---|---|---|
| Ports exposed to internet | 3000 (nginx) + 5000 (Express) | Only 80/443 (nginx) |
| CORS issues | Yes (different origins) | No (same origin) |
| Express port public | Yes (less secure) | No (internal only) |
| SSL/HTTPS | Needs separate config | nginx handles centrally |
| Rate limit / auth at gateway | Not possible | nginx can apply globally |
| Complexity | Simple | Slightly more config |

---

### Do you need nginx when running locally?

**It depends on HOW you run the app:**

| How you run it locally | nginx needed? | Reason |
|---|---|---|
| `npm run dev` (no Docker) | No | Vite dev server handles everything |
| `docker-compose up` (our setup) | Yes | Docker runs the production build, not Vite |

**Why does Docker need nginx even on your local machine?**

Our client `Dockerfile` does NOT start Vite dev server. It compiles a production build:

```dockerfile
RUN npm run build     # React → static dist/ files
# nginx then serves dist/  <-- Vite is NOT running here
```

Even though it runs on your local machine, Docker is simulating production.
nginx is required to serve those compiled static files — Vite is not involved.

**To run without Docker (no nginx needed at all):**
```bash
# Terminal 1 — frontend (Vite handles serving)
cd client
npm run dev        # Vite dev server on http://localhost:5173

# Terminal 2 — backend
cd server
node index.js      # Express on http://localhost:5000
```

> **Rule of thumb:** nginx is a production tool, not a dev tool.
> You need it only when serving a compiled build — in Docker locally, on a VPS, or on AWS.

---

## AWS ECR Deployment

This project supports two run modes — **local build** and **ECR image** — controlled by a single line in `docker-compose.yml`.

For full ECR push instructions, see the [AWS Push Guide](./AWS_PUSH_GUIDE.md).

---

### Mode 1 — Local Build (default, for development)

The `server` and `client` are built from source on your machine:

```yaml
server:
  build:
    context: ./server
    dockerfile: Dockerfile
  # image: ${ECR_REGISTRY}/my-app:server  ← commented out

client:
  build:
    context: ./client
    dockerfile: Dockerfile
  # image: ${ECR_REGISTRY}/my-app:client  ← commented out
```

```bash
docker compose up --build
```

> Use this during active development when you are making code changes.

---

### Mode 2 — ECR Image (for deployment / testing pre-built images)

Images are already built and pushed to AWS ECR. Comment out the `build` block and uncomment the `image` line:

```yaml
server:
  # build:
  #   context: ./server
  #   dockerfile: Dockerfile
  image: ${ECR_REGISTRY}/my-app:server  # pre-built image from ECR

client:
  # build:
  #   context: ./client
  #   dockerfile: Dockerfile
  image: ${ECR_REGISTRY}/my-app:client  # pre-built image from ECR
```

**Step 1 — Set the registry in your `.env`:**
```env
ECR_REGISTRY=<account-id>.dkr.ecr.<region>.amazonaws.com
```

**Step 2 — Authenticate Docker to ECR:**
```bash
aws ecr get-login-password --region <region> | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
```

**Step 3 — Pull and run:**
```bash
docker compose up -d
```

> The images are **private** — ECR login is required before `docker compose up`.

---

### Quick comparison

| | Local Build | ECR Image |
|---|---|---|
| Who builds the image | Your machine | Pre-built on AWS ECR |
| Requires `aws` CLI login | No | Yes |
| Reflects latest local code | Yes | Only if image was re-pushed |
| Use case | Development | Deployment / CI testing |

---

### All Modes Summary

| Environment | Serving method | nginx role |
|---|---|---|
| Local dev (`npm run dev`) | Vite Dev Server | Not used at all |
| Docker / this project | nginx (Option A) | Serves `dist/` only, steps out after |
| AWS / Production | nginx (Option B) | Full gateway, proxies API calls too |
