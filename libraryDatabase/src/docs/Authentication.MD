# AUTHENTICATION 101.

-Answers the question 'Who are you?' 

-Is the process of verifying a user's identity.

-Common factors include passwords, magic links, biometrics, social logins.

-After successful AuthN, the server gives the user a JWT or a Session Cookie, their 'ID card' for the rest of the visit.

-Tool of choice Supabase Auth.

-All files related to auth are kept in the same folder: 'auth'

-One is sufficient for both the backend and the frontend; this is how the relationship works in practice:

1.Frontend (ATM) - is where our users interact. Install the Supabase client here to show 'Loging with Google' button. When clicke d, Supabase handles the complex OAuth handshake with Google, logs the user in, and hands the frontend a JWT.

2.Backend (The Vault) - will not handle the login process, instead when asked for private data, it passes the JWT along. It simply looks at our token and says 'Did Supabase sign this? Yes? Okay, let them in.'


## How JWT Authentication works.

1.User sends email + password.

2.Server checks credentials against DB.

3.Credentials correct? Server generates a JWT token.

4.Token sent back to client.

5.Client sends token with every future request.

6.Server verifies token on protected routes.

7.Valid token? Request goes through.
 Invalid token? 401 Unauthorized.

-A JWT looks like so:

    eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMyIsInJvbGUiOiJsaWJyYXJpYW4ifQ.abc123
        ↑                         ↑                              ↑
    header                     payload                       signature
  (algorithm)              (your data)                   (verification)

-Head over to JWT keys in Project Settings and copy past the 'Legacy JWT secret' into our .env file.


## Build Order for Auth.

    1.  Update schema        →  add password + role to members table
    2.  Install dependencies →  bcrypt, jsonwebtoken
    3.  Update .env          →  add JWT_SECRET, JWT_EXPIRES_IN
    4.  Create error classes →  UnauthorizedError, ForbiddenError
    5.  Auth validation      →  registerSchema, loginSchema, inferred types
    6.  Auth service         →  register + login logic
    7.  Auth middleware      →  JWT verification + authorize
    8.  Auth controller      →  request handling
    9.  Auth routes          →  /register, /login
    10. Register in server.ts →  wire up auth routes
    11. Protect routes       →  add middleware to protected routes
    12. Test in Postman      →  register → login → access protected route
  

**Protected Routes.**

-These are routes that require one to be logged in in order to access them.

    public - anyone can access, no login needed.
    protected - must be logged in to access.

-One someone is logged i, authorization then decides what o

**Schema changes.**

-Every project needs the foolowing fields on the users table:

    password - string, hashed, never plain text.
    role - enum, defines permissions

    password: varchar("password", { length: 255}).notNull(),

**Defining an Enum.**

-Enums are used when the field has a fixed set of values.

    import { pgEnum } from 'drizzle';

    export const enumName = pgEnum('db_enum_name', ['value1', 'value2', 'value3']);

    export const tableName =pgTable("table_name", {
        columnName: enumName("column_name").notNull().default('value1');
    })

-ALways define enums before the tables that use them.

-The 2 names to be provided are:

    db_enum_namte; 
    //what the enum is called in the db
    columnName;
    //what the column is called in the table.


**Changes to .env**

    JWT_SECRET=secret_key_here
    JWT_EXPIRES_IN=timeHere

-We get our JWT secret by running the following command:

    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

## Setup.

-Using Supabase auth, we do not need bcrypt.

-Install jsonwebtoken using:

    npm install jsonwebtoken
    npm install -D @types/jsonwebtoken

-Install supabase using:

    npm install @supabase/supabase-js

### 1.Auth.validation.

-Input validation with Zod.

-The generic template for this would be:

    import { z } from 'zod';

    <!-- REUSABLEFIELD SCHEMAS -->

    const emailSchema = z
    .string({ error: 'Email is required'})
    .email('Invalid email format')
    .toLowerCase()
    .trim();

    const passwordSchema = z
    .string({ error: 'Password is required'})
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long');

    const usernameSchema = z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username is too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, underscores');

    <!-- AUTH SCHEMAS -->

    export const loginSchema = z.object({
        email: emailSchema,
        password: passwordSchema,
        //username: usernameSchema
        //fullName: z.string().min(1).max(100),
        //add the last two if the project needs it
    });

    export const forgotPasswordSchema = z.object({
        email: emailSchema,
    });

    export const resetPasswordSchema = z.object({
        token: z.string({ error: 'Token is required '}),
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
    });
    // this refine block is used to confirm that the user has used the same password twice

    export const changePasswordSchema = z.object({
        currentPassword: z.string({ error: 'Password is required'}),
        newPassword: passwordSchema,
        confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Passwords do not match',
        path: ['confirmNewPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'New password must differ from current password',
        path:['newPassword'],
    });
    //this check prevents the user from reusing the same password,


    <!-- TOKEN / SESSION SCHEMA -->
    export const refreshTokenSchema = z.object({
        refreshToken: z.string({ error: 'Refresh token is required' }),
    });

    <!-- INFERRED TYPES -->

    export type LoginInput = z.infer<typeof LoginSchema>;
    export type RegisterInput = z.infer<typeof registerSchema>;
    export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
    export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
    export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
    export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
    export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

-What changes per project:

1.passwordSchema - min(), complexity rules.

2.registerSchema - username, fullName, phone, role, inviteCode

3.usernameSchema - may not exist at all.

4.OAuth fields - provider, providerToken, idToken

5.MFA schema - otpCode, backupCode

6.Error messages, public apps use friendly messages.

'.refine()' - calls for cross-field logic(password match)

### 2.Auth.service

    //src/auth/auth.service.ts

    import { createClient } from '@supabase/supabase-js';
    import { BadRequestError, UnauthorizedError } from '../utils/errors';
    import { RegisterInput, LoginInput } from './auth.validation';

    // ─── Supabase Client ───────────────────────────────────────────────────────

    const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
    );

    const supabaseAdmin = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ─── REGISTER ─────────────────────────────────────────────────────────────

    export const register = async (data: RegisterInput) => {
    const { confirmPassword, ...rest } = data;

    const { data: result, error } = await supabase.auth.signUp({
        email: rest.email,
        password: rest.password,
        options: {
        data: {
            // add any extra fields your project needs here
            // username: rest.username,
            // fullName: rest.fullName,
        }
        }
    });

    if (error) throw new BadRequestError(error.message);

    return result.user;
    };

    // ─── LOGIN ─────────────────────────────────────────────────────────────────

    export const login = async (data: LoginInput) => {
    const { data: result, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });

    if (error) throw new UnauthorizedError(error.message);

    return {
        token: result.session.access_token,
        user: result.user,
    };
    };

    // ─── LOGOUT ───────────────────────────────────────────────────────────────

    export const logout = async (token: string) => {
    const { error } = await supabaseAdmin.auth.admin.signOut(token);

    if (error) throw new BadRequestError(error.message);

    return { message: 'Logged out successfully' };
    };

    // ─── FORGOT PASSWORD ──────────────────────────────────────────────────────

    export const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: process.env.PASSWORD_RESET_REDIRECT_URL!,
    });

    if (error) throw new BadRequestError(error.message);

    // always return the same message — don't reveal if email exists
    return { message: 'If that email exists, a reset link has been sent' };
    };

    // ─── RESET PASSWORD ───────────────────────────────────────────────────────

    export const resetPassword = async (newPassword: string) => {
    const { data: result, error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) throw new BadRequestError(error.message);

    return result.user;
    };


### 3.Auth.middleware

-The generic template for this file would be:

    import { Request, Response, NextFunction } from 'express';
    import jwt from 'jsonwebtoken';

    <!-- Supabase - Specific Payload -->
    export interface SupabaseJwtPayload {
        aud: string;
        exp: number;
        sub: string;
        //the user UUID
        email?: string;
        phone?: string;
        app_metadata: {
            provider?: string;
            providers?: string[];
            [key: string]: any;
        };
        user_metadate: {
            [key: string]: any;
            //any custom fields passed when the user signs up
        };
        role: string;
        aal: string;
        amr: any[];
        session_id: string;
    }

    <!-- EXPRESS TYPE EXTENSION -->
    declare global{
        namespace Express{
            interface Request {
                user?: SupabaseJwtPayload;
            }
        }
    }

    <!-- THE MIDDLEWARE FUNCTION -->
    export const requireSupabaseAuth = (req: Request, res: Response, next: NextFunction): void => {

        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized: Mising or invalid token format' });
            return;

        }

        const token = authHeader.split(' ')[1];

        try {
            //this must be the JWT secret from our Supabase project settings
            const secret = process.env.SUPABASE_JWT_SECRET;

            if(!secret) {
                console.error('CRIRTICAL: SUPABASE_JWT_SECRET environment variable is missing.');
                res.status(500).json({ error: 'Internal Server error' });
                return;
            }

            //Verify token locally, ensure the audience is authenticated to prevent anonymous Supabase keys from accessing protected API routes.
            const payload = jwt.verify(token, secret, {
                audience: 'authenticated'
            }) as SupabaseJwtPayload;

            //attach the payload to the request
            req.user = payload;
            

            next();
        }
        catch(error){
            const message = error instanceof jwt.TokenExpiredError
            ? 'Forbidden: Supabase token has expired'
            : 'Forbidden: Invalid space token';

            res.status(403).json({ error: message });
            return;
        }
    }

-The project-specific logic includes:

1.The 'AuthPayload' interface, interface must perfectly match the object passed into 'jwt.sign()' when the user logs in.

2.The secret key source, use the one provided in our Supabase project settings.

3.The payload shape - supabase dictates the structure of the JWT.

4.The audience - supabase tokens often have an audience claim set to 'authenticated'.


-At this point the variables that should exist in our .env file are:

    SUPABASE_URL=
    SUPABASE_ANON_KEY=
    SUPABASE_SERVICE_ROLE_KEY=  # needed for admin.signOut
    SUPABASE_JWT_SECRET=         # needed for middleware verification
    PASSWORD_RESET_REDIRECT_URL= # needed for forgotPassword


### 4.Auth.controller

-The generic template for this would be:

    import { Request, Response, NextFunction } from 'express';
    import * as authService from '//path to auth.serviceFile';
    import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '//path to auth.validation'

    <!-- REGISTER -->
    export const register = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {

        try{
            const data = registerSchema.parse(req.body);
            const result = await authService.register(data);

            res.status(201).json({
                success: true,
                message: 'Registration successful.Please check your email to confirm your account',
                data: result,
            });

        }
        catch (error) {
            next (error);
        }
    };

    <!-- LOGIN -->
    export const login = async (Req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const data = loginSchema.parse(req.body);
            const result = await authService.login(data);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };

    <!-- LOGOUT -->
    export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if(!token) {
                res.status(401).json({ success: false, message: 'No token provided' });
                return;
            }

            const result = await authService.logout(token);
            res.status(200).json({
                success: true,
                message: result.message
            });
        }
        catch(error){
            next(error);
        }
    };

    <!-- FORGOT PASSWORD -->
    export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
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

    <!-- RESET PASSWORD -->
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
        catch(error){
            next(error);
        }
    };

    //add changePassword if necessary

    export const changePassword = async (req:Request, res: Response, next:NextFunction) : Promise<void> => {
        try {
            const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

            if(!req.user) {
                res.status(401).json({ success: false, message: 'Unauthorized '});
                return;
            }

            await authService.changePassword(req.user.sub, currentPassword, newPassword);

            res.status(200).json({
                success: true,
                message: 'Password changed successfully',
            });
        }
        catch (error) {
            next(error);
        }
    };

    <!-- GET CURRENT USER -->
    export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json({
                
                    success: true,
                    data: req.user,
            });
        }
        catch(error) {
            next(error);
        }
    };

-What is being parsed in the controller functions is whatever the user passed in the 'req.body'.


### 5.Auth.routes.

-The general template for this would be:

    import { Router } from 'express';
    import * as authController from './auth.controller';
    import { requireSupabaseAuth } from '../middleware/auth.middleware';

    const router = Router();

    // ─── PUBLIC ROUTES ────────────────────────────────────────────────────────
    // No token needed — anyone can hit these

    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.post('/forgot-password', authController.forgotPassword);
    router.post('/reset-password', authController.resetPassword);

    // ─── PROTECTED ROUTES ─────────────────────────────────────────────────────
    // Token required — middleware runs first

    router.post('/logout', requireSupabaseAuth, authController.logout);
    router.post('/change-password', requireSupabaseAuth, authController.changePassword);
    router.get('/me', requireSupabaseAuth, authController.getMe);

    export default router;


    Public   → register, login, forgot-password, reset-password
    Protected → everything that requires a logged in user

    POST → anything that creates or changes something
    GET  → anything that only reads data

    
### 6.Register in server.ts

-Register the auth routes as the first one before all other routes.
