/*
-Business logic to implement:

    calculateFine()
    payFine()
    getMembersFines()

*/

import { db } from '../config/db';
import { fines, loans } from '../models';
import { eq } from 'drizzle-orm';
import { BadRequestError, NotFoundError } from '../utils/errors';

export const getAllFines = async () => {
    return await db.select().from(fines);
};

export const getFinesById = async (id: string) => {
    const result = await db.select().from(fines)
    .where(eq(fines.id, id));

    if (result.length === 0) {
        throw new NotFoundError("Fine not found.")
    }
} ;

const FINE_RATE_PER_DAY = 30;

export const calculateFine = async (loanId: string) => {
  // 1. fetch the loan
    const loanResult = await db.select().from(loans)
        .where(eq(loans.id, loanId));

    const loan = loanResult[0];

        if (!loan) {
    throw new BadRequestError("Loan not found.")
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
        throw new NotFoundError("Fine not found.")
    }

    return memberFine;
};

export const payFine = async (fineId: string) => {
  // fetch first to check existence and paid status
    const existing = await db.select().from(fines)
        .where(eq(fines.id, fineId));

    const fine = existing[0];

    if (!fine) {
        throw new NotFoundError("Fine not found");
    }

    if (fine.paid === true) {
        throw new BadRequestError("Fine already paid.")
    }

    // update paid to true
    const result = await db.update(fines)
        .set({ paid: true })
        .where(eq(fines.id, fineId))
        .returning();

    return result[0];
    };
