/*
File holding the controller functions for the books table
*/

import { Request, Response } from 'express';
import * as service from '../services/books.service';

export const getAllBooks = async (req: Request, res: Response ) => {
    try{
        const result = await service.getAll();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch books' });
    }
};
