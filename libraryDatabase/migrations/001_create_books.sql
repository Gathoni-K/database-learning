-- sql file containing the book table and its data

CREATE TABLE book(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    author VARCHAR(200) NOT NULL,
    genre VARCHAR(100) NOT NULL
);
