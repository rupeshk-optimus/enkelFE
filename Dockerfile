# Stage 1: Build the Angular application
FROM node:14 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY . .

RUN npm install -g @angular/cli@8.3.1

# Install dependencies
RUN npm install


# Build the Angular application
RUN npm run build

# Stage 2: Serve the Angular application
FROM nginx:alpine

# Copy the built Angular application from the previous stage
COPY --from=build /app/dist/Client-Portal /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
