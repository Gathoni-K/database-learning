import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models/index';
import dotenv from 'dotenv';

dotenv.config();

const client = postgres(process.env.DATABASE_URL!);
//raw connection to our DB

export const db = drizzle(client, { schema});
//drizzle wraps the connection