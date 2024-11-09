#!/bin/bash

# Pull the latest MongoDB image
docker pull mongo:latest

# Check if a container named "dev-mongo" exists
if [ "$(docker ps -aq -f name=dev-mongo)" ]; then
    echo "'dev-mongo' exists."

    # Check if the container is running
    if [ "$(docker ps -q -f name=dev-mongo)" ]; then
        echo "'dev-mongo' is already running."
    else
        echo "'dev-mongo' is not running. Starting the container..."
        docker start dev-mongo
        echo "'dev-mongo' has been started."
    fi
else
    echo "'dev-mongo' does not exist. Creating and starting a new container..."
    docker run -d --name dev-mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=mongo -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest
    echo "MongoDB container started with username 'mongo' and password 'password' and accessible at port 27017."
fi
