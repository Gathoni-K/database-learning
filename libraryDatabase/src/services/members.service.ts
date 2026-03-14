/*
-File holding the service functions of the members table

    getMembers()
    getMemberById()
    registerMember()
    updateMember()

*/

import { db } from '../config/db';
import { members } from '../models/schema';
import { eq } from 'drizzle-orm';

export const getAllMembers = async () => {
    return await db.select().from(members);
};
//function for selecting all members

export const getMemberById = async (id: string) => {
    const result =  await db.select().from(members)
    .where(eq(members.id , id));

    if (result.length === 0) {
        const error: any = new Error('Record not found');
        error.status = 404;
        throw error;
    }

    return result[0];
};
// function for selecting members by id

export const registerMember = async (data: typeof members.$inferInsert) => {
    return await db.insert(members)
    .values(data)
    .returning();
};
//function for adding members

export const updateMembers = async (id: string, data: Partial<typeof members.$inferInsert>) => {
    const result = await db.update(members)
    .set(data)
    .where(eq(members.id, id))
    .returning();

    if(result.length === 0) {
        const error: any = new Error ('Record not found');
        error.status = 404;
        throw error;
    }

    return result[0];
};

export const deleteMembers = async (id: string) => {
    const result = await db.delete(members)
    .where(eq(members.id, id))
    .returning();

    if(result.length === 0) {
        const error: any = new Error ('Record not found');
        error.status = 404;
        throw error;
    }

    return result [0];
};
//function for deleting members

