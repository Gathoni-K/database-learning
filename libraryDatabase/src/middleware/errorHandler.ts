/*
-This is our central error handler
-It reads whatever status was attached to the error, reads whatever
message was attached to the error then sends it to the client as a clean
JSON response.
*/

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
)=> {
    const status = error.status || 500;
    const message = error.message || 'Internal Server error';

    res.status(status).json({ message });
};