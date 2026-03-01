INSERT INTO loans (member_id, book_id) VALUES
    (
        (SELECT id FROM members WHERE name = 'Lydia Wanjiku'),
        (SELECT id FROM books WHERE title = 'Purple Hibiscus')
    ),
    (
        (SELECT id FROM members WHERE name = 'Tyra Wairimu'),
        (SELECT id FROM books WHERE title = 'Jefty Is Five')
    ),
    (
        (SELECT id FROM members WHERE name = 'Irman Njogu'),
        (SELECT id FROM books WHERE title = 'The Jail Bugs')
    ),
    (
        (SELECT id FROM members WHERE name = 'Grace Wangai'),
        (SELECT id FROM books WHERE title = 'A Man of The People')
    ),
    (
        (SELECT id FROM members WHERE name = 'Tabitha Njeri'),
        (SELECT id FROM books WHERE title = 'The Memory Police')
    ),
    (
        (SELECT id FROM members WHERE name = 'Peaches Njenga'),
        (SELECT id FROM books WHERE title = 'The Testaments')
    ),
    (
        (SELECT id FROM members WHERE name = 'Mohammed Mungai'),
        (SELECT id FROM books WHERE title = 'Shreds of Tenderness')
    ),
    (
        (SELECT id FROM members WHERE name = 'Celeste Mumbi'),
        (SELECT id FROM books WHERE title = 'The Skin Gods')
    ),
    (
        (SELECT id FROM members WHERE name = 'Marc Ndegwa'),
        (SELECT id FROM books WHERE title = 'I Have No Mouth And I Must Scream')
    ),
    (
        (SELECT id FROM members WHERE name = 'Cynthia Mwihaki'),
        (SELECT id FROM books WHERE title = 'Killing Commendatore')
    ),
    (
        (SELECT id FROM members WHERE name = 'Lydia Mumbi'),
        (SELECT id FROM books WHERE title = 'If We Were Villains')
    );