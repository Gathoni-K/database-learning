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
    return await db.select().from(members)
    .where(eq(members.id , id));
};
// function for selecting members by id