import { Request, Response, NextFunction } from 'express';
import * as service from '../services/loans.service';

export const getAllLoans = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await service.getAllLoans();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const getLoansById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { id } = req.params as { id: string };
        const result = await service.getLoansById(id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const getActiveLoans = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await service.getActiveLoans();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const getOverdueLoans = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await service.getOverdueLoans();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const deleteLoan = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { id } = req.params as { id: string };
        const result = await service.deleteLoan(id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const addLoans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const result = await service.addLoans(data);
        res.status(200).json(result);
    }
    catch (error){
        next(error);
    }
};

export const updateLoan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string};
        const data = req.body;
        const result = await service.updateLoan(id, data);
        res.status(200).json(result);
    }
    catch(error){
        next(error);
    }
};



