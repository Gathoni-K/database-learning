import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

interface RegisterInput {
    name: string,
    password: string,
    email: string,
    phoneNumber: string,
}

export const register = async (data:RegisterInput) => {

    //check is user already exixts
    
}