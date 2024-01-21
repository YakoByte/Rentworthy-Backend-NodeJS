# Use an official Node runtime as a parent image for the build stage
FROM node:18.17.1 AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Build the application if necessary (for TypeScript, React, etc.)
# Uncomment the next line if you have a build script in your package.json
# RUN npm run build


# Use an official Node runtime as a parent image for the final stage
FROM node:18.17.1

# Set the working directory in the container
WORKDIR /usr/src/app


# Install nodemon globally
RUN npm install -g nodemon ts-node

# Copy the built application from the previous stage
COPY --from=builder /usr/src/app .

# If you have a build process, you might only need to copy the build output, e.g.,
# COPY --from=builder /usr/src/app/dist ./dist

# Expose port 5006 to the world outside this container
EXPOSE 5006

# Add a health check (customize the curl command as needed)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5006/ || exit 1




# Run the app when the container launches
CMD ["npm", "run", "dev"]

