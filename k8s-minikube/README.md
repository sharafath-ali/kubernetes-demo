# Pushing Docker Image to Docker Hub

Before deploying the application to Kubernetes, the first step is to build the Docker image and push it to a container registry like Docker Hub so that Kubernetes can pull it.

## Prerequisites

- You need a Docker Hub account. If you don't have one, create it at [hub.docker.com](https://hub.docker.com/).
- Docker must be installed and running on your local machine.

## Steps

### 1. Log in to Docker Hub
Open your terminal and run the following command to authenticate with Docker Hub:
```bash
docker login
```
Enter your Docker Hub username and password when prompted.

### 2. Build or Tag the Docker Image

**Scenario A: Building a new image**
Build the Docker image from your `Dockerfile`. Make sure to tag it with your Docker Hub username, the repository name, and an optional version tag (like `latest` or `1.0.0`).

```bash
docker build -t <your-dockerhub-username>/k8s-minikube-demo:latest .
```

**Scenario B: If the image is already created**
If you have already built an image locally (e.g., named `k8s-minikube-demo:latest`), you just need to tag it so that Docker knows where to push it:

```bash
docker tag k8s-minikube-demo:latest <your-dockerhub-username>/k8s-minikube-demo:latest
```

*Note: Replace `<your-dockerhub-username>` with your actual Docker Hub username.*

### 3. Push the Image to Docker Hub
Once the image is built successfully, push it to Docker Hub using the `docker push` command:

```bash
docker push <your-dockerhub-username>/k8s-minikube-demo:latest
```

After these steps are complete, your image is securely stored in Docker Hub and can be used in your Kubernetes manifests (e.g., in a `Deployment` file) to run the application in your Minikube cluster.
