import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from './auth.validation';

export const register = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const data = registerSchema.parse(req.body);
        const result = await authService.register(data);

        res.status(201).json({
            success: true,
            message: 'Registration successful.Please check email to confirm your account',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const data = loginSchema.parse(req.body);
        const result = await authService.login(data);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    }
    catch (error){
        next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const { email } = forgotPasswordSchema.parse(req.body);
        const result = await authService.forgotPassword(email);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction ) : Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided'
            });
            return;
        }
        const result = await authService.logout(token);
        res.status(200).json({
            success: true,
            message: result.message
        });
    }
    catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const { password } = resetPasswordSchema.parse(req.body);
        const result = await authService.resetPassword(password);

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { currrentPassword, newPassword } = changePasswordSchema.parse(req.body);
        
        if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
    }

        await authService.changePassword(req.user.sub, currrentPassword, newPassword);
        
        res.status(200).json({
        success: true,
        message: 'Password changed successfully.',
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        
        if (!req.user) {                                          // ← add this
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
        };

        res.status(200).json({
            success: true,
            data: req.user,
        });
    }
    catch (error) {
        next(error);
    }
};


