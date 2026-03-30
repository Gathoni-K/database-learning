import { pgTable, unique, uuid, varchar, pgEnum, integer, foreignKey, timestamp, boolean } from "drizzle-orm/pg-core"
// import { sql } from "drizzle-orm"

export const roleEnum = pgEnum('role', ['librarian', 'member']);
//defining an enum

export const members = pgTable("members", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	phoneNumber: varchar("phone_number", { length: 25 }).notNull(),
	password: varchar("password", {length: 255 }).notNull(),
	role: roleEnum('role').notNull().default('member')
}, (table) => [
	unique("members_email_key").on(table.email),
]);

export const books = pgTable("books", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 250 }).notNull(),
	author: varchar({ length: 200 }).notNull(),
	genre: varchar({ length: 100 }).notNull(),
	copiesAvailable: integer("copies_available").notNull(),
});

export const loans = pgTable("loans", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	memberId: uuid("member_id"),
	bookId: uuid("book_id"),
	borrowedAt: timestamp("borrowed_at", { mode: 'string' }).defaultNow().notNull(),
	returnedAt: timestamp("returned_at", { mode: 'string' }),
	dueDate: timestamp("due_date", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.bookId],
			foreignColumns: [books.id],
			name: "loans_book_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "loans_member_id_fkey"
		}).onDelete("restrict"),
]);

export const fines = pgTable("fines", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	price: integer().notNull(),
	memberId: uuid("member_id"),
	loansId: uuid("loans_id"),
	paid: boolean().notNull().default(false)
}, (table) => [
	foreignKey({
			columns: [table.loansId],
			foreignColumns: [loans.id],
			name: "fines_loans_id_fkey"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "fines_member_id_fkey"
		}).onDelete("restrict"),
]);
