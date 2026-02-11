CREATE TABLE Department(
    department_id NUMBER NOT NULL
    constraint pk_Department PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL,
    department_location VARCHAR(30),
);

CREATE TABLE Employee(
    employee_id VARCHAR(10) NOT NULL
    CONSTRAINT pk_Employee PRIMARY KEY,
    last_name VARCHAR(20) NOT NULL,
    first_name VARCHAR(18) NOT NULL,
    date_of_birth DATE,
    salary NUMBER,
    department_id NUMBER,
);

ALTER TABLE Employee 
ADD CONSTRAINT fk_department
FOREIGN KEY(department_id)
REFERENCES department(deparment_id)
