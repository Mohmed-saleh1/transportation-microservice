# Use official Node.js image as base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before copying the rest of the code
COPY package.json package-lock.json ./

# Install dependencies
RUN npm i --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Expose the port NestJS runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
