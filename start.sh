#!/bin/sh

# Substitute environment variables in nginx configuration
envsubst '${SEARCH_API_HOST} ${SEARCH_API_PORT} ${SEARCH_SPA_PORT}' < /etc/nginx/nginx.conf > /tmp/nginx.conf

# Start nginx with the substituted configuration
exec nginx -g "daemon off;" -c /tmp/nginx.conf 