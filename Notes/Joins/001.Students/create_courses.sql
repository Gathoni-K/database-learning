-- sql file containing the courses table, properties are id and course_name

CREATE TABLE courses(
    course_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL
);