# Stage 1: Install dependencies
FROM 192.168.2.164:5000/node:20-alpine AS dependencies
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY src/erd/prisma ./prisma

COPY .env .env
RUN npx prisma db push --accept-data-loss


# Stage 2: Build the application
FROM 192.168.2.164:5000/node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./

COPY --from=dependencies /app/node_modules ./node_modules

COPY --from=dependencies /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=dependencies /app/node_modules/@prisma ./node_modules/@prisma
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 3: Final stage - Run the application
FROM 192.168.2.164:5000/node:20-alpine AS runner

WORKDIR /app

# Copy production dependencies and the built application
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env .env

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]