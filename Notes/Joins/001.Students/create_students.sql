-- creating an sql table for students, properties are id, name and course_name

-- CREATE TABLE students(
--     student_id UUID PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     course_name UUID REFERENCES course(name) ON DELETE RESTRICT
-- );

/*
Problems in our schema
-The foreign key column should be course_id and not course_name, it stores
an id not a name.
REFERENCES points to the wrong table and column.

    course_id UUID REFERENCES courses(course_id)
*/

CREATE TABLE students(
    student_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    course_id UUID REFERENCES courses(course_id) ON DELETE RESTRICT
);
