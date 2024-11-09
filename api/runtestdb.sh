#!/bin/bash

echo 'Starting Docker MongoDB script'

# Check if MongoDB container is already running
if [ "$(docker ps -q -f name=dev-mongo)" ]; then
    echo 'Docker MongoDB container already running'
else
    # Run MongoDB container
    docker run -d --rm \
        --name dev-mongo \
        -e MONGO_INITDB_ROOT_USERNAME=mongo \
		-e MONGO_INITDB_ROOT_PASSWORD=password \
        -p 27017:27017 \
        mongo:latest
fi

# Wait for MongoDB to start accepting connections
while ! docker exec dev-mongo mongo --username mongo --password password --eval "db.stats()" >/dev/null 2>&1; do
    echo 'Waiting for MongoDB to start accepting connections...'
    sleep 1
done

echo 'MongoDB is ready to accept connections'
