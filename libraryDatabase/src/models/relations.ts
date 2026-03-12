import { relations } from "drizzle-orm/relations";
import { books, loans, members, fines } from "./schema";

export const loansRelations = relations(loans, ({one, many}) => ({
	book: one(books, {
		fields: [loans.bookId],
		references: [books.id]
	}),
	member: one(members, {
		fields: [loans.memberId],
		references: [members.id]
	}),
	fines: many(fines),
}));

export const booksRelations = relations(books, ({many}) => ({
	loans: many(loans),
}));

export const membersRelations = relations(members, ({many}) => ({
	loans: many(loans),
	fines: many(fines),
}));

export const finesRelations = relations(fines, ({one}) => ({
	loan: one(loans, {
		fields: [fines.loansId],
		references: [loans.id]
	}),
	member: one(members, {
		fields: [fines.memberId],
		references: [members.id]
	}),
}));