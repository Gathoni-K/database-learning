import { z } from 'zod';

export const booksSchema = z.object({
    name: z.string().min(1),
    author: z.string().min(1),
    genre: z.string().min(1),
    copiesAvailable: z.number().min(0),
});

export const updateBooksSchema = booksSchema.partial();

export type booksInput = z.infer<typeof booksSchema>;
export type updateBooksInput = z.infer<typeof updateBooksSchema>;