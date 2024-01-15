#!/bin/bash

echo "Pulling from git"
git push origin master

echo "Building "
docker-compose up -d build