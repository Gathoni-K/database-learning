/*
File holding the controller functions for the books table
*/

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/books.service';



export const getAll = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await service.getAll();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const { id } = req.params as { id: string };
        const result = await service.getById(id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const addBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const result = await service.addBook(data);
        res.status(201).json(result);
    }
    catch (error){
        next(error);
    }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } =  req.params as { id: string };
        const data = req.body;
        const result = await service.updateBook(id, data);
        res.status(200).json(result);
    }
    catch(error) {
        next(error);
    }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { id } = req.params as { id: string };
        const result = await service.deleteBook(id);
        res.status(200).json(result);
    }
    catch(error) {
        next(error);
    }
};


