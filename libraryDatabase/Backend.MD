# SETTING UP A BACKEND FOR OUR LIBRARY MANAGEMENT SYSTEM

Tech stack : Node.js with Express

-We are working with a driver, 'pg' it is what connects our database with our backend.

-We are also working with a pool, this ensures that many requests can be handled at the same time.

-Use a pool, which manages multiple database connections so requests do not queue up waiting for one connection to finish.

-The general format of our server.ts file would be:

    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';

    dotenv.config();

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json());

    // Routes go here

    app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    });

-The usual dependencies we install:

    express, cors, dotenv, pg          ← core packages
    @types/express, @types/cors, 
    @types/pg, @types/node, 
    typescript, tsx, nodemon           ← dev tools

