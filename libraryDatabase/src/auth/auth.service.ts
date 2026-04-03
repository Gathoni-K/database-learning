import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { members } from '../models/schema';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { db } from '../config/db';
import { RegisterInput, LoginInput } from './auth.validation';


const SALT_ROUNDS = 10;


export const register = async (data: RegisterInput) => {

  const { confirmPassword, ...rest} = data;

  const cleanData = {
    ...rest,
    email: rest.email.toLowerCase().trim(),
  };
  
  // 1. check if user already exists[]
  const existing = await db.select().from(members)
    .where(eq(members.email, data.email));

  if (existing[0]) {
    throw new BadRequestError('Email already registered');
  }

  // 2. hash the password
  const hashedPassword = await bcrypt.hash(rest.password, SALT_ROUNDS);

  // 3. save to DB with hashed password
  const result = await db.insert(members).values({
  name:        rest.username,
  email:       rest.email,
  phoneNumber: rest.phoneNumber,
  password:    hashedPassword,
  role:        rest.role
}).returning();

  // 4. return without password
  const { password, ...safeUser } = result[0] as typeof members.$inferSelect;
  return safeUser;
};

export const login = async (data: LoginInput) => {
  // 1. find user by email
  const result = await db.select().from(members)
    .where(eq(members.email, data.email));

  const user = result[0];

  // 2. does user exist?
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // 3. compare passwords
  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // 4. generate token
  const token = jwt.sign(
  { id: user.id as string, role: user.role as string },
  process.env.JWT_SECRET!,
  { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
);

  // 5. return token + user without password
  const { password, ...safeUser } = user;

  return {
    token,
    user: safeUser
  };
};