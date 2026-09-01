# Stage 1: Install dependencies + build
FROM docker.io/library/node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy Prisma schema and generate client only (no db push)
#COPY src/erd/prisma ./prisma

#RUN npx prisma generate

# Copy source and build the TypeScript code
COPY . .
RUN npm run build

# Stage 2: Final stage - Run the application
FROM docker.io/library/node:20-alpine AS production
WORKDIR /app

# Install only production deps (smaller final image)
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the built application
COPY --from=builder /app/dist ./dist
COPY .env .env

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
