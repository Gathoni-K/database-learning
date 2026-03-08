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
members.name,
COUNT(*)
FROM loans
JOIN members
ON loans.member_id = members.id
GROUP BY members.name
ORDER BY COUNT(*) DESC;

--query for finding the most borrowed book
SELECT
    books.title,
    COUNT(*)
FROM loans
JOIN books ON loans.book_id = books.id
GROUP BY books.title
ORDER BY COUNT(*) DESC;