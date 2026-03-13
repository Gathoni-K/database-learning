# SETTING UP A BACKEND FOR OUR LIBRARY MANAGEMENT SYSTEM

Tech stack : Node.js with Express

-We are working with a driver, 'pg' it is what connects our database with our backend.

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

    import { db } from '/pathTo db.ts';
    import { tableName } from 'pathToModels folder';
    import { eq } from 'drizzle-orm';

    //get all
    export const getAll = async () => {
        return await db.select().from(tableName);
    }

    //get one
    export const getById = async (id: string) => {
        return await db.select().from(tableName)
        .where(eq(tableName.id, id));
    }

    //create
    export const create = async (data: typeof tableName.$inferInsert) => {
        return await db.insert(tableName).values(data).returning();
    }

    //update
    export const update = async (id: string, data: Partial<typeof tableName.$inferInsert>) => {
        return await db.update(tableName)
        .set(data)
        .where(eq(tableName.id, id))
        .returning();
    }

    //delete
    export const delete = async (id : string) => {
        return await db.delete(tableName)
        .where(eq(tableName.id, id))
        .returning();
    }

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
