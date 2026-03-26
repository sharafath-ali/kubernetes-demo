# AWS ECR Push Guide

This guide explains how to tag and push your containerized MERN application images to Amazon ECR.

![AWS Architecture](./aws.png)

## 1. Prerequisites

Before pushing, ensure you are authenticated with AWS CLI and logged into ECR:

```bash
aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com
```

## 2. What to Push

A MERN application typically consists of multiple services. You should push your custom application code images.

| Service | Local Image Name | ECR Target Tag |
|---|---|---|
| **Server (Express API)** | `dockerized-mern-app-server:latest` | `:server` |
| **Client (React Frontend)** | `dockerized-mern-app-client:latest` | `:client` |
| **MongoDB (Optional)** | `mongo:7` | `:mongodb` |

## 3. How to Push

Follow these steps for each service you want to deploy.

### Step 1: Tag the Image
This tells Docker to alias your local image with the remote ECR repository path.

```bash
# For Server
docker tag dockerized-mern-app-server:latest <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/my-app:server

# For Client
docker tag dockerized-mern-app-client:latest <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/my-app:client
```

### Step 2: Push the Image
This uploads the image layers to AWS.

```bash
# Push Server
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/my-app:server

# Push Client
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/my-app:client
```

## 4. Why use distinct tags?

Since you have one ECR repository named `my-app`, using `:latest` for everything will overwrite the previous image. 

By using `:server` and `:client` tags, both images can coexist in the same repository. You can then reference them in your ECS Task Definition or Kubernetes Deployment YAML:

- `<AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/my-app:server`
- `<AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/my-app:client`

## 5. Troubleshooting

- **Image not found:** Ensure you have built the images locally first using `docker-compose build`.
- **Repository not found:** Ensure the repository name (`my-app`) matches exactly what you created in the AWS Console.
- **Authentication error:** Re-run the `aws ecr get-login-password` command.
