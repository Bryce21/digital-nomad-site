#!/bin/bash

# Define the directories
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
DATABASE_DIR="database"
SECRET_DIR="secret"


# echo "Applying secret resources..."
kubectl apply -f $SECRET_DIR

# Apply the YAML files in each directory
echo "Applying frontend resources..."
kubectl apply -f $FRONTEND_DIR

echo "Applying backend resources..."
kubectl apply -f $BACKEND_DIR

echo "Applying database resources..."
kubectl apply -f $DATABASE_DIR

echo "Deployment complete."