-- sql file containing queries concerning members entity

--query for registering new members
INSERT INTO members(name, email)
VALUES(
    ('Michelle Minaji', 'minajimichelle@gmail.com'),
    ('Orina Bochaberi', 'michelleorina@gmail.com')
);

--query for deleting a record, first look up the id
DELETE FROM loans WHERE member_id = (SELECT id FROM members WHERE name = 'Irman Njogu');
