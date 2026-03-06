CREATE TABLE employees(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    salary VARCHAR(20) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE RESTRICT
);
