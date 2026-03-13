# SETTING UP A BACKEND FOR OUR LIBRARY MANAGEMENT SYSTEM

Tech stack : Node.js with Express

-We are working with a driver, 'pg' it is what connects our database with our backend.

-The general format of our server.ts file would be:

    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import //routes here
    import { errorHandler } from '/pathtoMiddlewareFolder';


    dotenv.config();

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json());

    // Routes go here

    app.use(errorHandler);
    //the error handler always comes after all the routes

    app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    });

-The usual dependencies we install:

    express, cors, dotenv, pg         // core packages
    @types/express, @types/cors, 
    @types/pg, @types/node, 
    typescript, tsx, nodemon          // dev tools

## Project structure

    /src
    /config - database connections, env variable loaders
    -Drizzle client lives here
    /controllers - request handling (entry/exit points)
    /middleware - guards (auth, error handling, logging)
    /models - data schemas
    -only schema definitions, no logic or queries
    /routes - URL path definitions
    /services - the brain (business logic and API calls)
    -the only place where the db client is imported and used
    -where the Drizzle queries are used.
    /validations - schema validation
    /utils - global helper functions
    /types - TS interfaces and types
    /migrations - database schema changes / seeds
    server.ts - the server entry point

-The general order of building would be:

1. Models
2. Services
3. Controllers
4. Routes
5. Validations and Middleware

-It is advisable to build vertically by feature:

-Do the user signup feature(Model - Service - Controller - Route)
-Test it.
-Move on to user login feature
-Test it.


-In modern backend development, raw SQL strings are rarely written and the heavy-lifting is handled by ORMs.

-Our ORM of choice being Prisma.

## Working with ORMs

-ORMs are mostly used for the daily grind, and Raw SQL is used for heavy-lifting.

-SQL is used for massive data dumps, complex reporting and database-specific features.

-What problems does ORMs actually solve:

1.Type safety - ensures our queries return typed results.

2.SQL Injection prevention.

3.Refactoring safety - when a column is renamed in our schema, TS will show us every broken query across our entire database

4.Migrations management, schema changes are tracked, versioned and reproducible across environments.

-ORM of choice is Drizzle, because it is TS-based.

-Install using:

    npm install drizzle-orm postgres
    npm install -D drizzle-kit

-Set up our '.env' file using the connection string.

-Create the drizzle.config.ts file, this file needs to know where our schema lives, where to put generated migrations, what database dialect is being used and how to connect our DB.

-At the root folder, create the 'drizzle.config.ts' and it should look something like:

    import { defineConfig } from 'drizzle-kit';
    import dotenv from 'dotenv';

    dotenv.config();

    export default defineConfig({
        schema: './src/models/index.ts',
        <!-- where table definitions live -->
        out: './src/migrations',
        <!-- where generated SQL migrations will be saved, tells Drizzle where to put the new generated files. -->
        dialect: 'postgresql',
        <!-- our database type, postgresql, sql, mysql -->
        dbCredentials: {
            url: process.env.DATABASE_URL!,
            <!-- connection string from '.env' -->
        },
    });

-This is how our db.ts file will look like now:

    import { drizzle } from 'drizzle-orm/postgres-js';
    import postgres from 'postgres';
    import * as schema from '../models/index';
    import dotenv from 'dotenv';

    dotenv.config();

    const client = postgres(process.env.DATABASE_URL!);
    //raw connection to our DB

    export const db = drizzle(client, { schema});
    //drizzle wraps the connection

-The 3 concepts of any ORM:

1.Schema - our source of truth, where the database tables are in code, the ORM reads this to know what exists, the types of our data and how tables relate.

2.Migration - this is where code is synced to the database.

3.Query builder - writing queries instead of using raw SQL strings, chain methods used by the ORM that translates it into SQL.

-The most preferred plan for handling this is writing the Drizzle schema only then run:

    drizzle-kit generate
    //this writes the SQL migrations for us.

-It is important to note that in our 'env' file, we connect our database using the Connection String provided in Supabase under ORM, remember to remove the quotes, then run:

    npx drizzle-kit introspect

-In our index.ts file, we import our schemas and exports them as well.

-This is because we had defined index.ts as the entry point of our schemas.


### Understanding Drizzle Syntax.

-The general approach in development is writing the Drizzle schema then migrating this to raw SQL with the help of our ORM.

#### 1.Column Types.

    varchar({ length: 100})
    //fixed max length, used for names, emails, phones
    text()
    //unlimited length, used for description and content

    integer()
    //whole numbers, counts, prices, quantities
    numeric()
    //decimals, for precise money values

    uuid()
    //unique IDs

    timestamp()
    //date + time
    date()
    //date only

    boolean()
    //true or false flags

#### 2.Constraints

    .notNull()
    .notNull() = nullable
    //value can be optional

    uuid().primaryKey()

    uuid().defaultRandom()
    //generates a UUID automatically
    timestamp().defaultNow()
    //sets current time automatically
    integer().default(0)
    //generates a static default value

    varchar({ length 100}).unique()
    //define a unique value

        OR 
    (table) => [
    unique("constraint_name").on(table_name)
    ]
    //define a unique column as a named constraint in the table callback

####  3.Defining Foreign Keys and Relationships.

    (table) => [
        foreignKey({
            columns: [table.memberId],
            <!-- column in this table -->
            foreignColumns: [members.id],
            <!-- column in the other table -->
            name: "constraintName in the DB"
            <!-- tableName_columnName_fkey -->
        }).onDelete("restrict. cascade")
    ]


### Defining Relations in Drizzle.

-The general pattern for doing this is:

    export const tableRelations = relations(thisTable, ({one, many }) => ({

        <!-- one - this table belongs to another table, has a foreign key -->
        otherTable: one(otherTable, {
            fields: [thisTable.foreignKeyColumn],
            <!-- our foreign key lives here -->
            references: [otherTable.id]
            <!-- table our foreign key points to -->
        }),

        <!-- many - other tables belong to this table -->
        otherTable: many(otherTable),

        <!-- no fields or references needed -->
    }));

    one() - the table has the foreign key column
    many() - the other table has the foreign key column


## Writing our Service Functions.

-This is handled in the 'services' folder, the general rule being one file per table.

-Service functions answer the question 'What needs to happen for this action to complete?'

-An example would be, issuing a book to a member, the raw query would be:

    INSERT INTO loans...

-But the business logic answers these questions:

    1.Does the book exist?
    2.Are there copies available?
    3.Is the member already borrowing this book?
    4.Reduce copies_available by 1.
    5.Create the loan record.
    6.Return the loan details.

-The service functions should reflect real library actions.

-The general naming convention would be:

    tableName.service.ts

-The general template for these files:

    import { db } from '../config/db';
    import { tableName } from '../models';
    import { eq } from 'drizzle-orm';
    

    // GET ALL
    export const getAll = async () => {
    return await db.select().from(tableName);
    };

    // GET BY ID
    export const getById = async (id: string) => {
    const result = await db.select().from(tableName)
        .where(eq(tableName.id, id));

    if (result.length === 0) {
        const error: any = new Error('Record not found');
        error.status = 404;
        throw error;
    }

    return result[0];
    };

    // CREATE
    export const create = async (data: typeof tableName.$inferInsert) => {
    return await db.insert(tableName).values(data).returning();
    };

    // UPDATE
    export const update = async (id: string, data: Partial<typeof tableName.$inferInsert>) => {
    const result = await db.update(tableName)
        .set(data)
        .where(eq(tableName.id, id))
        .returning();

    if (result.length === 0) {
        const error: any = new Error('Record not found');
        error.status = 404;
        throw error;
    }

    return result[0];
    };

    // DELETE
    export const remove = async (id: string) => {
    const result = await db.delete(tableName)
        .where(eq(tableName.id, id))
        .returning();

    if (result.length === 0) {
        const error: any = new Error('Record not found');
        error.status = 404;
        throw error;
    }

    return result[0];
    };

-The general Drizzle Query pattern would be:

    //SELECT
    db.select().from(table)

    //SELECT with filter
    db.select().from(table).where(eq(table.column, value))

    //INSERT
    db.insert(table).value({ column: value })

    //UPDATE
    db.update(table).set({ column: value }).where(eq(table.column, value))

    //DELETE
    db.delete(table).where(eq(table.column, value))

-We use '.returning()' for INSERT, UPDATE and DELETE commands.

-The rule of thumb is that if the function needs to modify data then '.returning' is used.


## Writing Controller Functions.

-These are functions that handle requests.

-Only thinks about what cam ein from HTTP and what goes out as HTTP.

-Their general template is:

    import { Request, Response } from 'express';
    import * as service from '../services/tableName.service';

    export const functionName = async (req: Request, res: Response) => {
        try{
            1.extract what is needed from the request
            2.call the service function
            3.send the response 
        } catch (error) {
            res.status(500).json({ message: 'error message' });
        }
    };

-How they change per CRUD operation:

    //Get all
    export const getAll = async (req: Request, res: Response) => {
        try {
            const result = await service.getAll();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch... ' });
        }
    };

    //get by id

    -extract id from URL params

    export const getById = async (req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const result = await service.getById(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch... ' });
        }
    };

    //create

    -export data from request body

    export const addItem = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const result = await service.addItem(data);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Failed to add ...' });
        }
    };

    //update

    -extract id from params and data from body

    export const updateItem = async (req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const data = req.body;
            const result = await service.updateItem(id, data);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Failed to...' });
        }
    };

    //delete

    -extract id from params only

    export const deleteItem(req: Request, res: Response) => {
        try{
            const { id } = req.params;
            const result = await service.deleteItem(id);
            res.status(200).json....
        }
        catch(error) {
            ....
        }
    };

-In our code, we are not handling the exceptions properly, to handle this, we create a central error handle that will be stored in the middleware.

-The central error handler matches the correct status codes.

-The general template of our errorHandler is:

    import { Request, Response, NextFunction } from 'express';

    export const errorHandler = (
        error: any,
        //error object thrown anywhere in the app
        req: Request,
        //the incoming request
        res: Response,
        //what is used to send the response
        next: NextFunction
        //required by Express to recognize this as error middleware
    ) => {
        const status = error.status || 500;
        // 'error' - reads whatever status the service attached
        //falls back to 500 if nothing was attached
        const message = error.message || 'INternal server error';
    
    res.status(status).json({ message });
    };


-How this will change our controller functions:

    //Remember to import the 'NextFunction' from express

    export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };
            const result = await service.getById(id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
            //the error is passed to the central handler
        }
    }

-How errors flow:

1.Controller catches the error, it passes it to the next, which then passes it to our middleware, this ensures a consistent response sent to the client.


## Writing Routes Functions.

- Are our URL path definitions.

-The general template would be:

    import { Router } from 'express';
    import * as controller from '../controllers/table.controller';

    const router = Router();

    //Read
    router.get('/', controller.getAll);
    router.get('/:id', controller.getById);

    //Create
    router.post('/', controller.create);

    //Update
    router.patch('/:id', controller.update);

    //Delete
    router.delete('/:id', controller.functionNameToDelete);

    export default router;

    //the part that goes in controller.functionName is the name of functions in the controllers folder


    ```
    The pattern per HTTP method

    GET - read data
    POST - creating data
    PATCH - partial update
    PUT - full replacement
    DELETE - remove data

    ```