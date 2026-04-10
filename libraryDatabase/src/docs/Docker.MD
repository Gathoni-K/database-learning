# DOCKER 101.

## 1.Dockerfile.

-Create this file at the root of your project.

    # STAGE 1: BUILD
    //declare our baseImage which is our starting point.
    FROM node:20-alpine AS builder

    WORKDIR /app
    //think of this like the 'cd' command
    //tells docker where our app is

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
    //tells Docker what port our app is using.

    # Start the server using the file specified in your package.json
    CMD ["node", "dist/server.js"]

**Layer Caching.**

-Docker has this to look at every layer independently.

-How does that work?

-If one layer changes, rebuild, if a layer did not change, use cache.




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

    // -t - tag, giving our image a name tag.

-Name should be lowercase.

## 6.Running the container.

    docker run -p 3000:3000 my-node-app

    // -p - port forwarding; a bridge between our image and our container.


## 7.Debugging.

-View logs using Docker Desktop.

## 8.Docker Scout.

-Generates a detailed report on the container, about any vulnerabilities and offers suggestions.

-This is done by using Docker Desktop.

## 9.Docker Compose and Docker Volumes.

-Adding database and frontend to Docker.

-Separate containers for each service; a multi-container application.

-Docker compose tells all our containers how to work together to run a full application.

-Create a 'compose.yaml' file, where we will define our services.

-The file is created at the root directory.

    services:
        backend: 
            build: .
            ports:

        db:
            image: postgres:latest
            environment: 
                add env keys here 

        frontend:


-Docker Volume is a folder that saves data from our containers and shares that data between them.

-To achieve that:

    volumes:
        postgres_data: 

-Run this in terminal:

    docker compose up

-Run this command after creating the 'compose.yaml' file

-To shut down the containers, run:

    docker compose down


Or one could run:

    docker init

-This allows docker to create the necessary files for us.

**Docker build cloud**
