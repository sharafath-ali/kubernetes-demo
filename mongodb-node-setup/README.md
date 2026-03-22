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
