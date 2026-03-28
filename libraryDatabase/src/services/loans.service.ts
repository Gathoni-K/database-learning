import { db } from '../config/db';
import { loans } from '../models';
import { eq, isNull, and, lt } from 'drizzle-orm';
import { NotFoundError } from '../utils/errors';

export const getAllLoans = async () => {
    return await db.select().from(loans);
};
//function for fetching all loans

export const addLoans = async (data: typeof loans.$inferInsert) => {
    return await db.insert(loans)
    .values(data)
    .returning();
};
//function for adding loans

export const getLoansById = async (id: string) => {
    const result = await db.select().from(loans)
                    .where(eq(loans.id, id));

        if(result.length === 0) {
           throw new NotFoundError("Loan not found");
        }

        return result[0];
};
//function for getting loans by id

export const updateLoan = async (id: string, data: Partial<typeof loans.$inferInsert>) => {
    const result = await db.update(loans)
    .set(data)
    .where(eq(loans.id, id))
    .returning();

    if (result.length === 0) {
        throw new NotFoundError("Loan not found");
    }

    return result[0];
};
//function for updating loans, handles returning the book, by updating the returning date

export const deleteLoan = async (id: string) => {
    const result = await db.delete(loans)
    .where(eq(loans.id, id))
    .returning();

    if (result.length === 0) {
       throw new NotFoundError("Loan not found");
    }
    return result [0];
    //return first loan
};
//function for deleting loans

/*
Function for fetching overdue loans
-Condition to be met, returned_at is null
*/

export const getActiveLoans = async () => {
    return await db.select().from(loans)
    .where(isNull(loans.returnedAt));
};

/*
Function for overdue loans.
-Condition to be met, returned_at is Null and overdue_date has surpassed the current date
*/

export const getOverdueLoans = async () => {
    return await db.select().from(loans)
    .where(
        and(
            isNull(loans.returnedAt),
            lt(loans.dueDate, new Date().toISOString())
        ));
};

