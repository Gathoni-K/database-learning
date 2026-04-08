# DOCKER 101.

## 1.Dockerfile.

-Create this file at the root of your project.

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

    # Compile TS to JS (outputs to /app/dist based on your tsconfig)
    RUN npm run build 


    # STAGE 2: PRODUCTION
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


## 2.tsconfig.json

-Ensures it outputs to 'dist/'

    {
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "commonjs",
    "target": "es2020",
    "strict": true
    }
    }

-Add package.json build script.

    "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "ts-node src/server.ts"
    //add the line above if not already present
    }

## 3.Supabase credentials.

-Ensure they are in the .env file, then run the following command:

    docker run -p 3000:3000 --env-file .env my-node-app

-Run this after running the container, step 6.

## 4.dockerignore

-Prevents unnecessary files from being copied into the image.

    node_modules
    dist          
    //let the builder stage generate this fresh
    .env
    .git
    *.js.map

## 5.Building the docker image.

    docker build -t my-node-app .

-Name should be lowercase.

## 6.Running the container.

    docker run -p 3000:3000 my-node-app
