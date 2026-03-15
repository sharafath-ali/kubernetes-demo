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

## How to Build the Image

From the `dockerize-node-app/` directory:

```bash
docker build -t node-docker-app .
```

| Part | Meaning |
|------|---------|
| `docker build` | Builds a Docker image |
| `-t node-docker-app` | Tags (names) the image as `node-docker-app` |
| `.` | Use the current directory (reads the `Dockerfile`) |

## How to Run the Container

```bash
docker run --rm -p 3000:3000 node-docker-app
```

Then open: **http://localhost:3000**

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
