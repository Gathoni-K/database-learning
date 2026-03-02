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

