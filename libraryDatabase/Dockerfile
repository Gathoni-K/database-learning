# STAGE 1: BUILD
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies like TypeScript)
RUN npm install

# Copy source code AND TypeScript config
COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build 


FROM node:20-alpine AS production

WORKDIR /app

# Copy dependency files again
COPY package*.json ./

# Install ONLY production dependencies (keeps the image small and secure)
RUN npm ci --only=production

# Copy the compiled JavaScript code from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start the server using the file specified in your package.json
CMD ["node", "dist/server.js"]