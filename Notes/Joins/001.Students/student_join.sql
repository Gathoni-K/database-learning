/*
-There are two tables, students(id, name,course_id) and courses(id, course_name)
Write a query showing student's name along their courses.

*/

SELECT
courses.name,
students.name
FROM courses
JOIN courses
    ON students.course_name = courses.name;

/*
Problems with our code:
1. FROM and JOIN, we are joining the courses table to itself.
-The general rule is:
    FROM - thing being investigated.
    JOIN - thing we're looking up details from.

2.The ON is all wrong,why?
course_name does not exist, it is course_name.
we want to link the foreign key to the primary key, not match names,
we use id instead of name, why?

    ON students.course_id = courses.course_id

Normalization.
-Never store the same information twice if it can be avoided.



*/
