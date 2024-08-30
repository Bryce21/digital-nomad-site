#!/bin/bash

DOCKER_HUB_USERNAME=""
REPO_NAME=""

# List of images and their tags
IMAGES=("digital-nomad-site-frontend" "digital-nomad-site-backend")

for IMAGE in "${IMAGES[@]}"; do
    echo "Tagging and pushing $IMAGE..."
    docker tag $IMAGE:latest $DOCKER_HUB_USERNAME/$REPO_NAME:$IMAGE-latest
    docker push $DOCKER_HUB_USERNAME/$REPO_NAME:$IMAGE-latest
done

echo "All images pushed to Docker Hub."