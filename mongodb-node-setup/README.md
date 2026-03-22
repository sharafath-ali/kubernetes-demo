# Kubernetes Demo Project

This repository contains different setups for containerizing and running a Node.js application with MongoDB.

## Folder Structure

### 1. `mongodb-node-setup` (Development Setup)
* **What it is:** A setup where **MongoDB** runs inside a Docker container, but the **Node.js app** runs locally on your machine (using `npm start`).
* **Why use this?** This is the most common way developers build applications during the development phase. It makes it extremely fast and easy to write code in Node.js because you don't have to rebuild a Docker container every time you change a line of JavaScript.

### 2. `dockerize-node-app` (Production / Full Containerization Setup)
* **What it is:** A setup focused on putting your **Node.js application itself** inside a Docker container (using a `Dockerfile`).
* **Why use this?** This is usually what you do when you are getting ready to deploy your app to production (like preparing it for Kubernetes). Running Node.js in a container ensures that the app will run exactly the same way on the production server as it does on your local computer. In this setup, the goal is full containerization where both the Database AND the App run inside Docker.

## Getting Started with Development Setup

1. Navigate to the development folder:
   ```bash
   cd mongodb-node-setup
   ```
2. Start the MongoDB Database (make sure Docker Desktop is running!):
   ```bash
   docker-compose up -d
   ```
3. Start the Node.js Server:
   ```bash
   npm install
   npm start
   ```
4. Visit `http://localhost:3000` to see the site hit counter increment in the database!

---

## Key Concepts Explained One by One

### `node_modules`
- **In Development (`mongodb-node-setup`):** You see `node_modules` locally on your computer because you ran `npm install` directly on your machine. The Node.js app is running locally, not inside a container.
- **In Production (`dockerize-node-app`):** You don't see `node_modules` locally because it gets installed *inside* the Docker container when the image is built. This keeps your computer's folders clean and ensures the dependencies are built for the specific Linux environment inside the container!

### `.dockerignore`
- **Why we need it:** When building a Docker image, Docker copies your project files into the image. However, we do **not** want to copy our local `node_modules` folder. Dependencies compiled on Windows or macOS might crash on the Linux environment inside the container. We use `.dockerignore` to tell Docker to ignore `node_modules` entirely, forcing it to run a fresh `npm install` from scratch inside the container.

### `docker-compose.yml`
- **What it does:** It lets us configure and run multiple Docker containers at the same time with a single command (`docker-compose up -d`). 
- **Why we use it here:** We needed to spin up a MongoDB database with a specific port (`27017:27017`) and volume storage. It's much easier to write this down in a clean YAML file than typing a massively long `docker run ...` command every time in the terminal!

### `Dockerfile`
- **What it does:** It is a blueprint that tells Docker step-by-step how to build an image for your Node.js application. 
- **Why we used it in the other folder:** In the development setup, we just ran Node manually with `npm start`. But for production (`dockerize-node-app`), the Node app needs to be baked into a lightweight container so it can be deployed anywhere (like Kubernetes). The `Dockerfile` provides those instructions!
