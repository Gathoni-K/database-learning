INSERT INTO loans (member_id, book_id, due_date) VALUES
    (
        (SELECT id FROM members WHERE name = 'Lydia Wanjiku'),
        (SELECT id FROM books WHERE title = 'Purple Hibiscus'),
        -- use parentheses to enclose values that contain a subquery
        -- a subquery is always needed when the inserted values need to be retrieved from another table
        '2025-04-18'
    ), 
    (
        (SELECT id FROM members WHERE name = 'Tyra Wairimu'),
        (SELECT id FROM books WHERE title = 'Jefty Is Five'),
        '2026-02-23'
    ),
    (
        (SELECT id FROM members WHERE name = 'Irman Njogu'),
        (SELECT id FROM books WHERE title = 'The Jail Bugs'),
        '2026-04-07'
    ),
    (
        (SELECT id FROM members WHERE name = 'Grace Wangai'),
        (SELECT id FROM books WHERE title = 'A Man of The People'),
        '2025-12-30'
    ),
    (
        (SELECT id FROM members WHERE name = 'Tabitha Njeri'),
        (SELECT id FROM books WHERE title = 'The Memory Police'),
        '2026-01-13'
    ),
    (
        (SELECT id FROM members WHERE name = 'Peaches Njenga'),
        (SELECT id FROM books WHERE title = 'The Testaments'),
        '2026-03-17'
    ),
    (
        (SELECT id FROM members WHERE name = 'Mohammed Mungai'),
        (SELECT id FROM books WHERE title = 'Shreds of Tenderness'),
        '2026-03-30'
    ),
    (
        (SELECT id FROM members WHERE name = 'Celeste Mumbi'),
        (SELECT id FROM books WHERE title = 'The Skin Gods'),
        '2025-09-24'
    ),
    (
        (SELECT id FROM members WHERE name = 'Marc Ndegwa'),
        (SELECT id FROM books WHERE title = 'I Have No Mouth And I Must Scream'),
        '2025-04-30'
    ),
    (
        (SELECT id FROM members WHERE name = 'Cynthia Mwihaki'),
        (SELECT id FROM books WHERE title = 'Killing Commendatore'),
        '2025-12-27'
    ),
    (
        (SELECT id FROM members WHERE name = 'Lydia Mumbi'),
        (SELECT id FROM books WHERE title = 'If We Were Villains'),
        '2026-05-12'
    );