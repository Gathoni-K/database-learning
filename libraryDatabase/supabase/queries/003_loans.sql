--sql file containing queries concerning the loans entity

--query for issuing a loan
INSERT INTO loans (member_id, book_id) VALUES(
    (SELECT id FROM members WHERE name = 'Lydia Wanjiku'),
    (SELECT id FROM books WHERE title = 'Drunk')
);

--query for deleting a loan
DELETE FROM loans WHERE name = 'Irman Njogu';

--query for returning a book
--should be update not insert as initially done
UPDATE loans
SET returned_at = '2026-01-25 11:45:15'
WHERE member_id = (SELECT id FROM members WHERE name = 'Lydia Wanjiku')
AND book_id = (SELECT id FROM books WHERE title = 'Purple Hibiscus')
AND returned_at IS NULL;

--query for fetching data using JOIN
--poor attempt of fetching loans with both the book, book details and member details attached
-- SELECT name FROM members
-- JOIN books ON members.id = books.id
-- JOIN loans ON books.id = loans.id


SELECT
    members.name        AS member_name,
    members.email,
    books.title         AS book_title,
    books.author,
    books.genre,
    loans.borrowed_at,
    loans.returned_at
FROM loans
JOIN members ON loans.member_id = members.id
JOIN books   ON loans.book_id   = books.id;

--query for fetching all overdue loans
-- SELECT 
-- loans.due_date
-- FROM loans;

/*
Problems with our code:
-Our query is incomplete, at the moment, it is currently fetching all lans not just
the overdue ones, to fix that we need to add a WHERE clause, that will dictate the condition under which 
the loan is overdue.
-A loan is overdue if the due_date is less than the current date and the returned_at is set to false

    WHERE loans.due_date < NOW() AND loans.returned_at IS NULL;
    
-Less is used to mean that something happened at an earlier date.

-It is also incomplete because we need to fetch information from the members and the books table,
we need the member's name, the book's title, the due_date.
*/
SELECT
members.name AS name,
books.title AS title,
loans.due_date
FROM loans
JOIN members
    ON loans.member_id = members.id
JOIN books
    ON loans.books_id = books.id
WHERE loans.due_date < NOW() AND loans.returned_at IS NULL;


