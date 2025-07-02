# Multi-stage build for Vue.js SPA
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 8084
EXPOSE 8084

# Start nginx
CMD ["/start.sh"] 