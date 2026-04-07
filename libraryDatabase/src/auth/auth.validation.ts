import { z } from 'zod';

// Reusable fields

const emailSchema = z
    .string({ error: 'Email is required'})
    .email('Invalid email format');


const phoneNumberSchema = z
    .string({ error: 'Phone number is required'})
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Enter a valid phone number');

const roleSchema = z.enum(['librarian', 'member'], {
    error: 'Role must either be librarian or member'
});

const passwordSchema = z
    .string({ error: 'Password is required'})
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long');

const usernameSchema = z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username is too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain numbers, letters or underscores');

// Auth Schemas.
export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    username: usernameSchema,
    confirmPassword: z.string(),
    phoneNumber: phoneNumberSchema,
    role: roleSchema,
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

export const resetPasswordSchema = z.object({
    token: z.string({ error: 'Token is required'}),
    password: passwordSchema,
    confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
});

export const changePasswordSchema = z.object({
    currrentPassword: z.string({ error: 'Password is required'}),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
})
.refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
})
.refine((data) => data.currrentPassword !== data.newPassword, {
    message: 'New password must differ from the previous one',
    path: ['newPassword']
    //path tells Zod which field to attach the error to.
});


// Token/Session Schema

export const refreshTokenSchema = z.object({
    refreshToken: z.string({ error: 'Refresh token is required'}),
});

// inferred types

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type refreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

