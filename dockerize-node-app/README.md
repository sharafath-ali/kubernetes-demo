# Dockerize a Node.js App

A simple Node.js HTTP server packaged into a Docker image using a `Dockerfile`.

## Folder Structure

```
dockerize-node-app/
├── app.js          ← Node.js HTTP server
├── package.json    ← App metadata
├── Dockerfile      ← Instructions to build the Docker image
└── .dockerignore   ← Excludes node_modules from the image
```

## Steps to Run

> ⚠️ You must **build first** before running. Docker cannot run an image that doesn't exist locally.

---

### Step 1 — Build the Docker image

Navigate into the project folder and build:

```bash
cd dockerize-node-app
docker build -t node-docker-app .
```

| Part | Meaning |
|------|---------|
| `docker build` | Reads the `Dockerfile` and builds an image |
| `-t node-docker-app` | Names the image `node-docker-app` |
| `.` | Use the current directory as build context |

You only need to rebuild when you change `app.js`, `package.json`, or `Dockerfile`.

---

### Step 2 — Run the container

**Option A — Foreground (see logs in terminal):**
```bash
docker run --rm -p 3000:3000 node-docker-app
```

**Option B — Background (detached mode):**
```bash
docker run -d -p 3000:3000 --name my-node-app node-docker-app
```

| Flag | Meaning |
|------|---------|
| `--rm` | Auto-remove container when it stops |
| `-d` | Run in background (detached) |
| `-p 3000:3000` | Bind `localhost:3000` → container port `3000` |
| `--name my-node-app` | Give the container a name (easier to manage) |
| `node-docker-app` | The image to run (must be built first!) |

---

### Step 3 — Open in browser

```
http://localhost:3000
```

---

### Step 4 — Stop the container

```bash
# If running in foreground:
Ctrl+C

# If running in background:
docker stop my-node-app
```

---

> ❌ **Common Mistake:** Running `docker run` without building first gives this error:
> ```
> Unable to find image 'node-docker-app:latest' locally
> pull access denied — repository does not exist
> ```
> Fix: always run `docker build -t node-docker-app .` first!

## Dockerfile Explained

```dockerfile
FROM node:18-alpine        # Base image — Node 18 on lightweight Alpine Linux
WORKDIR /app               # Set working directory inside container
COPY package.json .        # Copy package.json first (for caching)
RUN npm install            # Install dependencies
COPY . .                   # Copy rest of source code
EXPOSE 3000                # Tell Docker the app uses port 3000
CMD ["node", "app.js"]     # Command to start the app
```

### Why copy `package.json` before the rest of the code?

Docker builds images **layer by layer**. If you copy everything at once, any code change rebuilds the `npm install` layer (slow). By copying `package.json` first:

```
Layer 1: FROM node:18-alpine       → cached ✅
Layer 2: COPY package.json         → cached ✅ (unless dependencies changed)
Layer 3: RUN npm install           → cached ✅ (skipped if package.json unchanged)
Layer 4: COPY . .                  → rebuilt 🔄 (only this layer rebuilds on code changes)
```

This makes rebuilds much faster!

## Useful Docker Commands

```bash
# List all images
docker images

# Remove the image
docker rmi node-docker-app

# Run in background (detached)
docker run -d -p 3000:3000 --name my-node-app node-docker-app

# Stop the background container
docker stop my-node-app
```
