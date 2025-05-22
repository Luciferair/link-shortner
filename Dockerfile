# Build stage
FROM oven/bun:canary-alpine AS builder

WORKDIR /app
COPY package*.json ./

COPY . .
RUN bun install

RUN bun run build

# Production stage
FROM nginx:alpine

# Copy the built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html


EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]