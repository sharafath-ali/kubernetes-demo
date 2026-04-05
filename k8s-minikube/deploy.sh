#!/bin/bash

# Ensure minikube is running (creates it if it doesn't exist)
echo "🚀 Starting Minikube cluster..."
minikube start

# Apply all Kubernetes configurations
echo "📦 Applying Kubernetes manifests..."
kubectl apply -f k8s/

# Wait for deployments to be ready
echo "⏳ Waiting for pods to spin up..."
kubectl wait --for=condition=ready pod -l app=kubernetes-demo-api --timeout=60s

# Show the status of pods
echo "✅ Pod status:"
kubectl get pods

# Open the service in the browser
echo "🌐 Starting Minikube service tunnel..."
minikube service kubernetes-demo-api-service
