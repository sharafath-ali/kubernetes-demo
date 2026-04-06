#!/bin/bash

set -e

NAME="k8s-demo-api"
USERNAME="sharafathalivk"
IMAGE="$USERNAME/$NAME:latest"

echo "Building Docker image ..."
docker build -t $IMAGE .

echo "Pushing image to Docker Hub ..."
docker push $IMAGE

echo "Applying Kubernetes manifests ..."
kubectl apply -f k8s/

echo "Getting pods ..."
kubectl get pods

echo "Getting services ..."
kubectl get services

echo "Fetching the main service"
kubectl get services kubernetes-demo-api-service

echo "Starting Minikube service tunnel..."
minikube service kubernetes-demo-api-service
