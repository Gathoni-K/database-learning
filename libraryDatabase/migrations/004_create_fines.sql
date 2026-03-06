-- sql file containing the fines table and its data, records overdue books

CREATE TABLE fines(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    price INT NOT NULL,
    due_date UUID REFERENCES loans(due_date) ON DELETE RESTRICT
);