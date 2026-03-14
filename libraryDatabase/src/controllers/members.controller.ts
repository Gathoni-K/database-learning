import { Request, Response, NextFunction } from 'express';
import * as service from '../services/members.service';


export const getAllMembers = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await service.getAllMembers();
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const getMemberById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { id } = req.params as { id: string};
        const result = await service.getMemberById(id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const registerMember = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const data = req.body;
        const result = await service.registerMember(data);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const updateMembers = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { id } = req.params as { id: string};
        const data = req.body;
        const result = await service.updateMembers(id, data);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}

export const deleteMembers = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { id } = req.params as { id: string };
        const result = await service.deleteMembers(id);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
