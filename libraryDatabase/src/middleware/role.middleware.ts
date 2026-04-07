import { Request, Response, NextFunction } from 'express';

export const requireRole = (...roles: string[]) => {

    return (req: Request, res: Response, next: NextFunction) : void => {

        if(!req.user){
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });

            return;
        }

        const userRole = req.user.user_metadata?.role ?? req.user.role;
        //extract role by checking user_metadata first, which falls back to token root

        if(!roles.includes(userRole)) {
            res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to perform this action',
            });
            return;
        }

        next();
    }
}

export const requireOwnerRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) : void => {

        if(!req.user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const userRole = req.user.user_metadata?.role ?? req.user.role;
        const isOwner = req.params.id === req.user.sub;
        const hasRole = roles.includes(userRole);

        if(!isOwner && !hasRole){
            res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to perform this action',
            });
            return;
        }

        next();
    }
}