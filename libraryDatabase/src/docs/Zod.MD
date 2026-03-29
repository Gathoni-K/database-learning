# ZOD 101.

-Is a TS-first validation library, it validates that the data coming into our API Is exactly what we expect before we reach our services.

-Our API trusts whatever comes in:

    const data = req.body;
    await service.addBook(data);

-The problem with this is, what if someone sends:

    {
        "title" : "",
        "copiesAvailable" : "five"
    }
    //no title, wrong type.

-The above is sent straight to our database, and we get a confusing DB error instead of a clear validation message.

-What Zod does, when the request comes in, Zod checks the data shape; fails, returns a clear error message immediately. When it passes the data reaches our service clean and typed.

## SETUP.

-Install using:

    npm install zod

-It does not just validate, it also infers TS types from our schema.

## CORE CONCEPTS.

### 1.Defining a Schema.

-THis is where we define what valid data looks like:

    import { z } from 'zod';

    export const itemSchema = z.object({
        stringField: z.string().min(1),
        //required not empty
        numberField: z.number().int().min(0),
        //whole number, no negatives
        booleanField: z.boolean(),
        //true or false
        emailField: z.email(),
        //valid email format
        uuidField: z.uuid(),
        optionalField: z.string().optional(),
        //not required
        nullableField: z.string().nullable(),
        //can be null
    });

-THe validate file only contains the schema definitions, the update schema via '.partial()', export inferred types.

-The fields defined here are the only ones coming from the user in the request body.

### 2.Inferring Types from Schema.

    type ItemInput = z.infer<typeof itemSchema>;
    <!-- never write types manually when the Zod schema is installed -->

    const createItem = async (data: ItemInput) => {...}
    <!-- use it as the type everywhere -->

-The inferred type lives right below its schema, then import the type whenever needed.

-Is in the same file where we defined our schema.


### 3.Parsing Data.

    const result = schema.safeParse(req.body);
    //preferred as it never throws

    if(!result.success) {
        //if the validation fails, run the errors below
        result.error.flatten().fieldErrors
        //errors per field
    }

    result.data
    //validation passed

    const data = schema.parse(req.body);
    //parse - throws if validation fails, use only when we want to throw the error.

-Use safeParse in middleware, when we want to control the error response.

-Use parse when we want the error to bubble to our central error handler.

-For errors that are unexpected or not related to use input, these are the ones passed to the central error handler.

    Database crashes.
    Record not found.
    Server errors.
    Connection failures.


### 4.Validation Middleware.

    //src/middleware/validate.ts

    import { z } from 'zod';
    import { Request, Response, NextFunction } from 'express';

    export const validate = (schema: z.ZodSchema) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse(req.body);

            if(!result.success) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: result.error.issues.map(issue => ({
                        field: issue.path.join('.'),
                        message: issue.message
                    }))
                });
            }

            req.body = result.data;
            //replace the body with clean, typed data
            next();

            //pass to controller
        }
    }

-This file never changes across projects.

### 5.Partial Schema for Updates.

    //create the schema - all fields are required.
    export const tableNameSchema = z.object({
        fieldName: zodTypeConstraint,
    });

    //update schema - call .partial() on createSchema
    export const updateTableNameSchema = tableNameSchema.partial();
    //every field automatically becomes optional
    
### 6.Plugging into Routes.

    import { validate } from '../middleware/validate';
    import { tableNameSchema, updateItemSchema } from '../validations/item.validation';

    router.post('/', validate(tableNameSchema), controller.createFunction);
    router.patch('/:id', validate(updateItemSchema), controller.update);

    //GET and DELETE don't need body validation
    router.get('/', controller.getAll);
    router.get('/:id', controller.getById);
    router.delete('/:id', controller.remove);

### 7.Common Constraints Cheatsheet.

    <!-- strings -->
    z.string()
    //must be a string
    z.string().min(1)
    //should not be empty
    z.string().max(100)
    //max length
    z.string().email()
    //produce a valid email
    z.string().uuid()
    //ensure valid uuid
    z.string().url()
    //valid URL

    <!-- numbers -->
    z.number()
    //must be a number
    z.number().int()
    //whole numbers only
    z.number().min(0)
    //no negatives
    z.number().max(100)
    //max value
    z.number().positive()
    //must be greater than 0

    <!-- other data types -->
    z.boolean()
    z.date()
    z.enum(['a', 'b', 'c'])
    //must be one of these
    z.array(z.string())
    //an array of strings

    <!-- modifiers - chain on any type -->
    .optional()
    .nullable()
    .default(value)
    //a fallback if not provided.

-Enums are fields that must be one of  the fixed set of values.

-Used when the field has a defined list of accepted values, anything outside that list is invalid.


### 8.The Validation File Pattern.

    //src/validations/tableName.validation.ts

    import { z } from 'zod';

    export const tableNameSchema = z.object({
        //define all fields here
        fieldName: zodTypeConstraint,
    });
    //the create schema - strict, enter all required fields.

    export const updateTableNameSchema = tableNameSchema.partial();
    //update schema - all fields optional

    //inferred types
    export type TableNameInput = z.infer<typeof tableNameSchema>;
    export type UpdateTableNameInput = z.infer<typeof updateTableNameSchema>;

### 9.Order of Building with Zod from the Start.

    1. Models       →  Drizzle schema (what the DB looks like)
        ↓
    2. Validations  →  Zod schemas (what valid input looks like)
            ↓
    3. Middleware   →  validate.ts + errorHandler.ts
            ↓
    4. Services     →  business logic + queries
            ↓
    5. Controllers  →  request/response handling
            ↓
    6. Routes       →  URL mapping + validate middleware plugged in
            ↓
    7. Test
   
-The controller stays exactly the same, what changes are the routes, in our current project.
