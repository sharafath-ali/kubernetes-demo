# AWS Elastic Container Registry (ECR) Deployment Guide

This document outlines the professional workflows for tagging and pushing containerized images to Amazon ECR. 

---

## 🏗️ 1. Choosing a Deployment Strategy

There are two primary ways to organize your images in AWS ECR. Choose the one that best fits your project's scale.

### Option A: Distinct Tagging (Single Repository)
*Best for small projects/demos.*  
All services (`server`, `client`) are pushed to a single repository (e.g., `my-app`) using unique tags.
*   **Pros**: Simpler to manage; fewer ECR repositories to create.
*   **Cons**: Shared lifecycle policies; tag clutter.

### Option B: Separate Repositories (Industrial Standard)
*Best for production/enterprise.*  
Each service gets its own dedicated ECR repository (e.g., `my-app-server` and `my-app-client`).
*   **Pros**: Independent versioning (`:latest`, `:v1`); per-service permissions; dedicated lifecycle policies.
*   **Cons**: Requires creating multiple repositories in AWS.

---

## 📋 2. Prerequisites

Before initiating the push, ensure you are authenticated:

```powershell
# ECR Authentication (valid for 12 hours)
aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com
```

---

## 🚀 3. Implementation Workflow

### Workflow for Option A: Single Repository (`my-app`)

| Service | Tagging Command | Push Command |
| :--- | :--- | :--- |
| **Server** | `docker tag ...-server:latest .../my-app:server` | `docker push .../my-app:server` |
| **Client** | `docker tag ...-client:latest .../my-app:client` | `docker push .../my-app:client` |

### Workflow for Option B: Separate Repositories (Recommended)

Ensure you have created the repositories in the AWS Console first.

```powershell
# Deploy Server to its own repository
docker tag dockerized-mern-app-server:latest <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/my-app-server:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/my-app-server:latest

# Deploy Client to its own repository
docker tag dockerized-mern-app-client:latest <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/my-app-client:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/my-app-client:latest
```

---

## ✅ 4. Final Verification

After pushing, verify your images in the AWS Console. 

**If using Option A (Single Repo), your view will look like this:**
![ECR Console Verification](./aws.png)

---

## 🛠️ 5. Common Troubleshooting

| Issue | Resolution |
| :--- | :--- |
| `Repository not found` | Ensure the repository name matches exactly what exists in ECR. |
| `Authentication failed` | Re-run the ECR Login command (Prerequisites). |
| `No such image` | Build images locally using `docker-compose build` first. |

---

> [!IMPORTANT]  
> **Security Note**: This guide uses `<AWS_ACCOUNT_ID>` and `<REGION>` as placeholders. For your local use, replace these with your actual 12-digit AWS ID and region (e.g., `ap-southeast-2`).
