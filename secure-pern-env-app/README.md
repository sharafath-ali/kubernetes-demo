# PERN Docker App

This directory contains a complete containerized PERN (Postgres, Express, React, Node) stack.

- **`docker-compose.yml`**: Spins up the database, backend, and frontend.
- **`backend/`**: Node.js REST API connecting to the Postgres database.
- **`frontend/`**: Vite React app fetching from the backend API.

## Getting Started

1. Ensure Docker Desktop is running.
2. Open your terminal in this directory (`kubernetes-demo/secure-pern-env-app`).
3. Run the following command:
   ```bash
   docker-compose up --build -d
   ```
4. Test it out!
   - Frontend React App: [http://localhost:5174](http://localhost:5174)
   - Backend API: [http://localhost:5001](http://localhost:5001)

## Checking the Database

You can connect to and check the PostgreSQL database using any database client (such as pgAdmin, DBeaver, or a VS Code extension). Use the following connection details:

- **Host**: `localhost`
- **Port**: `5433`
- **Database**: `pern_database`
- **Username**: `pern_user`
- **Password**: `pern_password`

## How it works

Behind the scenes, `docker-compose.yml` orchestrates three separate containers (`db`, `api`, and `frontend`) and connects them using core Docker concepts:

### 1. Volumes (Data Persistence)
- **What it is:** A volume is like a dedicated external hard drive for a container. By default, when a container is destroyed, all data inside it is lost. Volumes solve this by storing data safely on your host machine.
- **How it's used here:** We use a volume named `pgdata` to store the Postgres database files (`/var/lib/postgresql/data`). Even if you stop or remove the `db` container, your database records (tables, users) will survive. When you spin the container back up, Postgres reattaches to the volume and your data is exactly how you left it.
- **How to clean/reset it:** Since volumes persist data independently of containers, deleting the container won't wipe the database. To completely reset your database and wipe the volume, use the following Docker Compose command (the `-v` flag is crucial):
  ```bash
  docker-compose down -v
  ```

### 2. Networks (Internal Communication)
- **What it is:** A Docker network is a private, isolated virtual network that allows containers to talk to each other securely without exposing themselves to the outside world.
- **How it's used here:** We created a shared network called `pern-network`. Because all three containers (`db`, `api`, `frontend`) are on this same network, they can communicate using their container names as hostnames. 
  - For example, the backend API doesn't connect to `localhost:5432` to reach the database; it connects to `db:5432`. Docker's internal DNS automatically routes the traffic to the correct container.
- **What if you run them separately?:** If you skip `docker-compose` and try to run these containers individually (e.g., using explicit `docker run` commands), they will **not** share a common network by default. Instead, they will be placed on Docker's default bridge network and won't be able to resolve each other's names (like `db` or `api`). Docker Compose automatically provisions and connects them to `pern-network` so they can communicate perfectly.

### 3. Ports (External Access)
- **What it is:** Port mapping (or publishing) is how you open a "door" from your actual computer (the host) into the isolated container.
- **How it's used here:** Containers are mapped using the `HOST_PORT:CONTAINER_PORT` format.
  - **`5173:5173`:** Allows you to open `localhost:5173` in your web browser to view the React frontend.
  - **`5000:5000`:** Allows you to access the backend API at `localhost:5000` from your browser or Postman.
  - **`5432:5432`:** Allows database clients (like pgAdmin) installed on your computer to connect directly to the Postgres database for management.

---

## 🔒 Secure Environment Setup (.env)
Unlike the basic demo, this specific setup (`secure-pern-env-app`) demonstrates industry-standard security practices:
1. **`.env` File**: Database usernames and passwords are mathematically removed from `docker-compose.yml` and placed inside a hidden `.env` file instead.
2. **`.gitignore`**: The `.env` file is explicitly ignored by Git, ensuring you never accidentally commit your production passwords to GitHub.
3. **`docker-compose.yml` Variables**: `docker-compose.yml` now uses the `${VARIABLE_NAME}` syntax to safely inject the secrets automatically when you run `docker-compose up`!

### 🚀 How this works in Production (AWS, GCP, Kubernetes)
While the `.env` file is perfect for local development, production platforms like AWS, GCP, or other orchestration tools won't typically ask for a `.env` file directly. 

Instead, they provide a secure way to set environment variables through their own configuration systems (such as a web console, CLI, or deployment manifests). 

When you deploy, the production environment securely injects those values directly into the container process at runtime. Because your `docker-compose.yml` and application code are already set up to look for variables like `POSTGRES_USER` or `DB_PORT`, your app will seamlessly pick up the production values without relying on a `.env` file inside the container!

---

## 🧠 Docker, Ports, Networking & Production — Simple Note

### 🌐 Local Development (What you’re doing now)

When you run apps locally:
* Frontend → `localhost:3000`
* Backend → `localhost:5000`
* Database → `localhost:5432`

👉 `localhost` means **your own machine**
👉 Port is just a **door to access a running service**

So when you type:
`localhost:3000`
You are telling the browser:
> “Go to my machine and access the app running on port 3000”

### 🔗 How Services Talk in Docker

Inside Docker, containers don’t use `localhost` to talk to each other.
Instead, they use:
`http://backend:5000`

👉 Docker provides internal networking
👉 Each container can talk using service names

### 🚀 What Changes in Production

In production, things are more controlled and secure.
You **do NOT expose everything like in development**

Only one main entry is exposed:
* Usually your app is accessible via a domain (like `example.com`)

### 🌍 How Domain Connects to Your App

You don’t write code for this.
It works like this:
1. Domain (example.com) points to a server IP using DNS
2. That server receives the request on standard ports (80 or 443)
3. A system (like a load balancer or reverse proxy) forwards the request to your app

👉 This routing is handled by infrastructure, not your code

### 🔌 Do We Expose Ports in Production?

Yes — but only what is needed.
* Your app listens on a port inside the container
* The platform (AWS, GCP, etc.) connects that to the outside world

You usually expose:
* One public port (like 443 for HTTPS)

Everything else stays internal.

### 🔐 Internal Communication

* Backend talks to database internally (not exposed)
* Frontend talks to backend through APIs

👉 Internal services are hidden for security

### 🌱 Environment Variables

In development:
* You use `.env` file

In production:
* Platforms provide environment variables through dashboard or config

👉 No need to include `.env` inside container

### 🧠 Final Understanding

Development:
* You manually use `localhost` and ports
* Everything is open and visible

Production:
* Domain replaces `localhost`
* Only one entry point is exposed
* Internal services communicate privately
* Cloud handles routing automatically

---

**🔥 One-Line Summary**
> Development is manual and open; production is controlled, secure, and handled by infrastructure.

---

## 🛠️ Troubleshooting & Useful Logs

### 1. "Container started, but I can't access the app!"
If Docker Compose says `Started` but `localhost` refuses the connection, the container likely completely crashed immediately after starting. 

The #1 way to debug this is to check the container's logs:
```bash
docker logs <container_name>
# Example: docker logs secure_pern_frontend
```

### 2. The Great Vite + Node 18 Crash
If you use an older Docker image base (like `node:18-alpine`) with a modern Vite React app, running `docker logs secure_pern_frontend` will spit out this exact error:

```text
> frontend@0.0.0 dev
> vite --host

You are using Node.js 18.20.8. Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.
file:///app/node_modules/vite/dist/node/cli.js:542
                                this.dispatchEvent(new CustomEvent("command:!", { detail: command }));
                                                       ^

ReferenceError: CustomEvent is not defined
```

**The Fix:**
Always ensure your `Dockerfile` uses a Node version compatible with your tooling! We fixed this by upgrading both `frontend/Dockerfile` and `backend/Dockerfile` to:
```dockerfile
# Base image
FROM node:20-alpine
```

---

## 🌐 Frontend ↔ Backend in Production (DNS & Routing)

### 🔗 Is frontend → backend connection same as development?

👉 **Concept is same**, but **how you connect is different**

* In development:
`localhost:5000/api`

* In production:
`https://yourdomain.com/api`

👉 No `localhost` in production

### 🌍 Everything Uses Domain (DNS)

In production:
* Your app has a domain (example: `yourdomain.com`)
* Requests go through this domain

So in browser inspect (Network tab), you’ll see:
`https://yourdomain.com/api/users`

👉 Not localhost anymore

### 🔄 Same Domain vs Separate Domain

You have 2 common setups:

#### 1. Same domain (most common for simple apps)
`yourdomain.com        → frontend`
`yourdomain.com/api    → backend`

👉 Routing decides where request goes
👉 Clean and simple

#### 2. Separate domain (used in bigger systems)
`yourdomain.com        → frontend`
`api.yourdomain.com    → backend`

👉 More scalable and flexible

### ⚙️ How Routing Actually Happens

You don’t write code for this.
Cloud (AWS, GCP, etc.) or tools like Nginx handle it:
* If request is `/` → send to frontend
* If request is `/api` → send to backend

👉 This is called **reverse proxy / routing**

### 🔌 What Happens Behind the Scenes

When you hit:
`https://yourdomain.com/api`

Flow is:
1. Domain → resolves to server (DNS)
2. Server receives request
3. Router / Load balancer checks path
4. Sends request to backend container (internal port)

👉 Ports are still used, but hidden from you

### 🧠 Important Understanding

* Browser only knows **domain**
* Infrastructure handles **port + container mapping**
* You don’t expose internal ports directly

### 🚀 Role of AWS / GCP / Render

They help you:
* Attach domain to your app
* Route traffic to correct service
* Manage HTTPS (SSL)
* Hide internal complexity

👉 You just configure, not code

### 🔥 Final Clarity

* Yes, frontend still calls backend ✅
* But using **domain instead of localhost**
* Routing is handled by **cloud / proxy**
* Ports exist internally, not exposed directly

---

**🧩 One-Line Summary**
> In production, your frontend calls the backend through a domain, and the cloud automatically routes that request to the correct service behind the scenes.
