/*
File containing the business logic for the books table

-The service should reflect real library actions

    getBooks()
    getBookById()
    addBook()
    updateBook()
    deleteBook()
*/

import { db } from '../config/db';
import { books } from '../models/schema';
import { eq } from 'drizzle-orm';

export const getAll = async () => {
    return await db.select().from(books);
};
// function for fetching all books

export const getById = async(id: string) => {
    const result = await db.select().from(books)
    .where(eq(books.id, id));

    if (result.length === 0) {
        const error: any = new Error('Record not found');
        error.status = 404;
        throw error;
    }
    //displaying the specific error message

    return result[0];
};
//function for fetching books by id

export const addBook = async( data: typeof books.$inferInsert) => {
    return await db.insert(books)
    .values(data)
    .returning();
};
/*
-Function for inserting  a book, what we need to insert, title, author, copies available and genre
*/

export const updateBook = async (id: string, data: Partial<typeof books.$inferInsert>) => {
    const result =  await db.update(books)
    .set(data)
    .where(eq(books.id, id))
    .returning();

    if(result.length == 0 ){
        const error: any = new Error ('Record not found');
        error.status = 404;
        throw error;
    }

    return result[0];
};
//function for updating books

export const deleteBook = async (id: string) => {
    const result = await db.delete(books)
    .where(eq(books.id, id))
    .returning();

    if(result.length === 0) {
        const error: any = new Error('Record not found');
        error.status = 404;
        throw error;
    }

    return result [0];

};
//function for deleting a book

