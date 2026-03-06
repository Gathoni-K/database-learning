-- sql file containing queries concerning books

--query for adding books
INSERT INTO books (title, author, genre)
VALUES (
    ('Wuthering Heights', 'Emily Bronte', 'Classic literature'),
    ('The Deer Leap', 'Martha Grimes', 'Mystery')
);

--query for deleting a record
DELETE FROM books WHERE title = 'Babel';

--query for counting the number of books each member has borrowed
SELECT 
members.name
books.title
COUNT(loans.)
FROM loans
GROUP BY members.name, books.title;