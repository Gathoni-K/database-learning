import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface SupabaseJwtPayload {
    aud: string;
    exp: number;
    sub: string;
    email?: string;
    phone?: string;
    app_metadata: {
        provider?: string;
        providers?: string[];
        [key: string]: any;
    };
    user_metadata: {
        [key: string]: any;
    };
    role: string;
    aal: string;
    amr: any[];
    session_id: string;
}

declare global{
    namespace Express{
        interface Request {
            user?: SupabaseJwtPayload;
        }
    }
}

export const requireSupabaseAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try{
        const secret = process.env.SUPABASE_JWT_SECRET;

        if(!secret) {
            console.error('CRITICAL: SUPABASE_JWT_SECRET environment variable is missing');
            res.status(500).json({ error: 'Internal Server error' });
            return;
        }

        const payload = jwt.verify(token!, secret, {
    audience: 'authenticated',
    algorithms: ['HS256'],
    }) as unknown as SupabaseJwtPayload;
        

    req.user = payload;

    next();
    }
    catch(error){
        const message = error instanceof jwt.TokenExpiredError ? 'Forbidden: Supabase token has expired' : 'Forbidden: Invalid space token';

        res.status(403).json({ error: message });
        return;
    }
}