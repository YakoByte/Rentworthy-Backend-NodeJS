# Use an official Node runtime as a parent image
FROM node:18.17.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Make port available to the world outside this container
EXPOSE 5000

RUN npm run build

# Run the app when the container launches
CMD ["npm", "start"]