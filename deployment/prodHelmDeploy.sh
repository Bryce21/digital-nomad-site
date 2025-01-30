#!/bin/bash

CHART_NAME="traveler-deployment"
RELEASE_NAME="prod"
NAMESPACE="default"


# Ensure Helm is initialized
if ! helm version >/dev/null 2>&1; then
    echo "Helm is not initialized. Initializing Helm..."
    helm init  # For Helm v2
fi

kubectl create secret docker-registry registrypullsecret --docker-server=https://index.docker.io/v1/  --docker-username= --docker-password= --docker-email=


# Install or upgrade the Helm chart
echo "Deploying Helm chart..."
# helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx                                                                17:10:32
# helm repo update
# helm install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace
helm upgrade --install "$RELEASE_NAME" "$CHART_NAME" --namespace "$NAMESPACE"

# Check if the deployment was successful
if [ $? -eq 0 ]; then
    echo "Helm chart deployed successfully."
else
    echo "Failed to deploy Helm chart."
fi
