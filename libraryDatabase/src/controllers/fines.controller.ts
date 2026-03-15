import { Request, Response, NextFunction } from 'express';
import * as service from '../services/fines.service';

export const getAllFines = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await service.getAllFines();
        res.status(200).json(result);
    }
    catch (error){
        next(error);
    }
};

export const getFinesById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { id }= req.params as {id: string};
        const result = await service.getFinesById(id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}

export const calculateFine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { loanId } = req.params as {loanId: string};
        const result = await service.calculateFine(loanId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const getMembersFine = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { memberId }  = req.params as {memberId: string};
        const result = await service.getMembersFine(memberId);
        res.status(200).json(result);
    }
    catch (error){
        next(error);
    }
};

export const payFine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fineId } = req.params as { fineId: string};
        const result = await service.payFine(fineId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};