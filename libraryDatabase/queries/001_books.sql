-- sql file containing queries concerning books

--query for add ing books
INSERT INTO books (title, author, genre)
VALUES (
    ('Wuthering Heights', 'Emily Bronte', 'Classic literature'),
    ('The Deer Leap', 'Martha Grimes', 'Mystery')
);

--query for deleting a record
DELETE FROM books WHERE title = 'Babel';