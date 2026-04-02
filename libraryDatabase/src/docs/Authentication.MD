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

-Install using:

    npm install bcrypt jsonwebtoken
    npm install -D @types/bcrypt @types/jsonwebtoken

    bcrypt - hashes passwords
    jsonwebtoken - generates and verifies JWT tokens.

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

    import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken';

    const SALT_ROUNDS = 10;
    //This is how many times bcrypt hashes, higher; more secure but slower.
    //10 is the industry standard.

    //REGISTER
    export const register = async (data:RegisterInput) => {
        //1.check if hte user already exists.
        const exisiting = await db.select().from(TABLE_NAME)
        .where(eq(TABLE_NAME.email, email));

        if (existing[0]) {
            throw new BadRequestError('Email already registered.');
        }
        /2./hash the passwor

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    //3.save user to db with hashed password.
     const result = await db.insert(TABLE_NAME).values({
            ...data,
            password: hashedPassword
        }).returning();
    //4.return user without the password
    const { password, ...safeUser } = result[0];
    return safeUser;
    }.

    //LOGIN
    export const login = async (data:LoginInput) => {
        //1.find user by email
        //2.does user exist?If not, uanothorized erroor
        const isMatch = await bcrypt.compare(data.password, user.password);
        //3.password match?If not, unauthorized error
        //4.generate JWT token.

        const token = jwt.sign(
            { id:user.id, role: user.role },
            //payload - define what goes in the token.
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN }
            //set the expiry data
        );

        //return token - user without password.
    }




