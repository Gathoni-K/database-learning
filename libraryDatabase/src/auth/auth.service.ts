import { createClient } from '@supabase/supabase-js';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { RegisterInput, LoginInput } from './auth.validation';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const register = async (data: RegisterInput) => {
  const { confirmPassword, ...rest} = data;

  const { data: result, error} = await supabase.auth.signUp ({
    email: rest.email,
    password: rest.password,
    options: {
      data:{
        username: rest.username,
      }
    }
  });

  if(error) throw new BadRequestError(error.message);

  return result.user;
};

export const login = async (data: LoginInput) => {
  const { data: result, error} = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if(error) throw new UnauthorizedError(error.message);

  return{
    token: result.session.access_token,
    user: result.user,
  };
};

export const logout = async (token: string) => {
  const { error } = await supabaseAdmin.auth.admin.signOut(token);
  if (error) throw new BadRequestError(error.message);
  return { message: 'Logged out successfully' };
};


export const forgotPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.PASSWORD_RESET_REDIRECT_URL!,
  });

  if(error) throw new BadRequestError(error.message);

  return { message: 'If that email exists, a reset link has been sent.'};
};

export const resetPassword = async (newPassword: string) => {
  const { data: result, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw new BadRequestError(error.message);

  return result.user;
}