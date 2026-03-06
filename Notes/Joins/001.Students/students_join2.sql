-- write a query showing the student name, course name, course id.

SELECT
students.name,
courses.course_name,
courses.course_id
FROM courses
JOIN students
    ON students.course_id = courses.course_id;