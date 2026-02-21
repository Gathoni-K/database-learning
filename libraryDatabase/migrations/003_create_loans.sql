-- sql file containing the loans table and its data
CREATE TABLE loans(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE RESTRICT,
    book_id UUID REFERENCES books(id) ON DELETE RESTRICT,
    borrowed_at TIMESTAMP DEFAULT now() NOT NULL,
    returned_at TIMESTAMP NULL
);