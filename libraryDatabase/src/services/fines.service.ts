/*
-Business logic to implement:

    calculateFine()
    payFine()
    getMembersFines()

*/

import { db } from '../config/db';
import { fines, loans, members } from '../models';
import { eq } from 'drizzle-orm';

export const getAllFines = async () => {
    return await db.select().from(fines);
};

export const getFinesById = async (id: string) => {
    const result = await db.select().from(fines)
    .where(eq(fines.id, id));

    if (result.length === 0) {
        const error: any = new Error('Record not found');
        error.status = 404;
        throw error;
    }
} ;

const FINE_RATE_PER_DAY = 30;

export const calculateFine = async (loanId: string) => {
  // 1. fetch the loan
    const loanResult = await db.select().from(loans)
        .where(eq(loans.id, loanId));

    const loan = loanResult[0];

        if (!loan) {
    const error: any = new Error('Loan not found');
    error.status = 404;
    throw error;
    }

    // 2. calculate days overdue
    const returnDate = loan.returnedAt ? new Date(loan.returnedAt) : new Date();
    const daysOverdue = Math.ceil(
        (returnDate.getTime() - new Date(loan.dueDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    // 3. calculate price
    const price = daysOverdue * FINE_RATE_PER_DAY;

    // 4. insert fine
    const fine = await db.insert(fines).values({
        loansId: loanId,
        memberId: loan.memberId,
        price: price
    }).returning();

  // 5. return fine
    return fine[0];
};

export const getMembersFine = async (memberId: string) => {
    const memberFine = await db.select().from(fines)
    .where(eq(fines.id, memberId));

    if (memberFine.length === 0){
        const error: any = new Error('Record not found');
        error.status = 404;
        throw error;
    }

    return memberFine;
};

export const payFine = async (fineId: string) => {
  // fetch first to check existence and paid status
    const existing = await db.select().from(fines)
        .where(eq(fines.id, fineId));

    const fine = existing[0];

    if (!fine) {
        const error: any = new Error('Fine not found');
        error.status = 404;
        throw error;
    }

    if (fine.paid === true) {
        const error: any = new Error('Fine already paid');
        error.status = 400;
        throw error;
    }

    // update paid to true
    const result = await db.update(fines)
        .set({ paid: true })
        .where(eq(fines.id, fineId))
        .returning();

    return result[0];
    };
