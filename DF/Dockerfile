# Stage 1: Install dependencies and run migrations
FROM 192.168.2.164:5000/node:20-alpine AS dependencies
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire source code and configs (tsconfig.json, .env, etc.)
COPY . .

# Run migrations (make sure migrations exist in repo or generation is intentional)
RUN npm run migration:generate || true
RUN npm run migration:run

# Stage 2: Build the application
FROM 192.168.2.164:5000/node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 3: Final stage - Run the application
FROM 192.168.2.164:5000/node:20-alpine AS runner
WORKDIR /app

# Copy production dependencies and built app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env .env

# Expose the application port
EXPOSE 3000

# Start the app

CMD ["node", "dist/main"]
