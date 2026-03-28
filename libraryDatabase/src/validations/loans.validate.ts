import { z } from 'zod';

export const loansSchema = z.object({
    memberId: z.uuid(),
    bookId: z.uuid(),
    dueDate: z.string(),
});

export const updateLoansSchema = loansSchema.partial();


export type loansInput = z.infer<typeof loansSchema>;
export type updateLoansInput = z.infer<typeof updateLoansSchema>;
