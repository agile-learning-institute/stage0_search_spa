# Stage 1: Build stage
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Set build timestamp and build the application
ARG SPA_BUILT_AT
ENV SPA_BUILT_AT=$SPA_BUILT_AT
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port
EXPOSE 8084

# Start nginx with environment variable substitution
CMD ["/start.sh"] 