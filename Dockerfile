# 1. Build Stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# 2. Production Stage
FROM nginx:alpine

# Copy build files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]