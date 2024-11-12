#!/bin/bash

CHART_NAME="traveler-deployment"
RELEASE_NAME="dev"
NAMESPACE="default"

# Check if Minikube is running
if ! minikube status | grep -q "Running"; then
    echo "Minikube is not running. Starting Minikube..."
    minikube start
fi

# Ensure Helm is initialized
if ! helm version >/dev/null 2>&1; then
    echo "Helm is not initialized. Initializing Helm..."
    helm init  # For Helm v2
fi

# Install or upgrade the Helm chart
echo "Deploying Helm chart..."
helm upgrade --install "$RELEASE_NAME" "$CHART_NAME" --namespace "$NAMESPACE"

# Check if the deployment was successful
if [ $? -eq 0 ]; then
    echo "Helm chart deployed successfully."
else
    echo "Failed to deploy Helm chart."
fi
