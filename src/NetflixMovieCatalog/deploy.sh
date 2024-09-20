#!/bin/bash

# Define variables
IMAGE_NAME="anshika1718/netflix-movie-catalog:v0.0.1"
CONTAINER_PORT=8080
HOST_PORT=8080
CONTAINER_NAME="netflix-movie-catalog"

# Ensure the system is up to date
sudo apt update && sudo apt upgrade -y

# Install Docker if it's not already installed
if ! [ -x "$(command -v docker)" ]; then
    echo "Installing Docker..."
    sudo apt install -y docker.io
fi

# Pull the latest Docker image for Netflix Movie Catalog
echo "Pulling the latest Docker image..."
sudo docker pull $IMAGE_NAME

# Check if a container is already running for this specific service
RUNNING_CONTAINER=$(sudo docker ps -q --filter name=$CONTAINER_NAME)

if [ -n "$RUNNING_CONTAINER" ]; then
    # Stop the running container for this service
    echo "Stopping the running NetflixMovieCatalog container..."
    sudo docker stop $CONTAINER_NAME

    # Remove the stopped container
    echo "Removing the stopped container..."
    sudo docker rm $CONTAINER_NAME
fi

# Run a new container from the image with a specific name
echo "Starting a new NetflixMovieCatalog container..."
sudo docker run --name $CONTAINER_NAME -p $HOST_PORT:$CONTAINER_PORT -d $IMAGE_NAME

# Verify the new container is running
NEW_CONTAINER=$(sudo docker ps -q --filter name=$CONTAINER_NAME)
if [ -n "$NEW_CONTAINER" ]; then
    echo "New NetflixMovieCatalog container started successfully. Container ID:"
    echo $NEW_CONTAINER

    # Optionally, inspect the new container
    sudo docker container inspect $NEW_CONTAINER
else
    echo "Failed to start a new container."
fi
