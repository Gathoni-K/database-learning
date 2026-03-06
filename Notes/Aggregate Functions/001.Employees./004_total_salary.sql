-- sql file containing the query used to calculate the total salary paid per department

SELECT 
departments.name,
SUM(salary)
FROM employees
JOIN departments ON employees.department_id = departments.id
GROUP BY departments.name; 