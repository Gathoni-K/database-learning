-- sql file containing the fines table and its data, records overdue books

CREATE TABLE fines(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    price INT NOT NULL,
    member_id UUID REFERENCES members(id) ON DELETE RESTRICT,
    loans_id UUID REFERENCES loans(id) ON DELETE RESTRICT,
    paid BOOLEAN NOT NULL
);