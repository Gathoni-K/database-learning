/*
-This is our central error handler
-It reads whatever status was attached to the error, reads whatever
message was attached to the error then sends it to the client as a clean
JSON response.
*/

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';


export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
 ) => {
    if (error instanceof AppError) {
        return res.status(error.status).json({ message: error.message });
    }

    res.status(500).json({ message: 'Internal Server Error'});
 };




