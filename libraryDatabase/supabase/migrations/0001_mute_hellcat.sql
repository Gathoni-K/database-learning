ALTER TABLE "books" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "fines" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "loans" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "members" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "fines" ADD COLUMN "paid" boolean DEFAULT false NOT NULL;