# INTRO.

-Are user-defined classes that allows one to create and handle application-specific error scenarios with more detail and structure than generic built-in errors.

-A custom error class looks like so:

    export class AppError extends Error{
        status: number;

        constructor(message: string, status: number) {
            super(message);
            //passes message to built-in error
            this.status = status;
            //attaches the status code
            this.name = this.constructor.name;
            //names the error class
        }
    }

-Then specific errors extend that base:

    //src/utils/error.ts

    export class NotFoundError extends AppError{
        constructor(message = 'Record not found') {
            super(message, 404);
        }
    }

    export class BadRequestError extends AppError {
        constructor(message = 'Bad Request') {
            super(message, 400);
        }
    }

    export class UnauthorizedError extends AppError{
        constructor(message = 'Unauthorized') {
            super(message, 401);
        }
    }

    export class ForbiddenError extends AppError {
        constructor(message = 'Forbidden'){
            super(message, 403);
        }
    };


    400  →  Bad Request    (invalid data, fine already paid)
    401  →  Unauthorized   (not logged in)
    403  →  Forbidden      (logged in, no permission)
    404  →  Not Found      (record doesn't exist)
    500  →  Server Error   (unexpected crash)
    
-How does our error handler change?

-Before:

    export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    const status = error.status || 500;
    const message = error.message || 'Internal server error';
    res.status(status).json({ message });
    };

-After:

    import { AppError } from '../utils/errors';

    export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    if (error instanceof AppError) {
        // known, expected error
        return res.status(error.status).json({ message: error.message });
    }

    // unknown, unexpected error
    res.status(500).json({ message: 'Internal server error' });
    };

-How does this affect our service functions?

-Before:

    const error: any = new Error('Fine already paid');
    error.status = 400;
    throw error;

-After:


    throw new BadRequestError('Fine already paid');