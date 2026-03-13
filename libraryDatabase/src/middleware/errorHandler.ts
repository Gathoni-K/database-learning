/*
-This is our central error handler
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