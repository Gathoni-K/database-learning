import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    console.error(error); 
    //logs everything to terminal

    if (error instanceof AppError) {
        return res.status(error.status).json({ message: error.message });
    }

    // if we reach here, it's an unexpected error — log extra detail
    console.error('Unhandled error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    };