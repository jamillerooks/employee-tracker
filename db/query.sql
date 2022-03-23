SELECT * FROM department ORDER BY department.id ASC;
SELECT * FROM employee ORDER BY employee.id ASC;


SELECT 
department_name AS department, 
SUM(salary) AS utilized_budget 
FROM roles 
INNER JOIN department 
ON roles.department_id = department.id 
GROUP BY  department_name;

SELECT 
roles.id,
job_title AS title, 
department_name AS department, 
salary 
FROM roles 
INNER JOIN department 
ON roles.department_id = department.id 
ORDER BY roles.id ASC;

SELECT 
employee.id,
employee.first_name, 
employee.last_name, 
job_title,
salary,
department_name AS department,
CONCAT(manager.first_name, ' ', manager.last_name)As manager
FROM employee 
LEFT JOIN employee manager
    ON manager.id = employee. manager_id
INNER JOIN roles 
    ON employee.roles_id = roles.id
INNER JOIN department
    ON department.id = roles.department_id
    ORDER BY employee.id ASC;



SELECT 
employee.id,
employee.first_name, 
employee.last_name, 
job_title,
salary,
department_name AS department,
CONCAT(manager.first_name, ' ', manager.last_name)As manager
FROM employee 
LEFT JOIN employee manager
    ON manager.id = employee. manager_id
INNER JOIN roles 
    ON employee.roles_id = roles.id
INNER JOIN department
    ON department.id = roles.department_id
    ORDER BY manager ASC;

SELECT 
employee.id,
employee.first_name, 
employee.last_name, 
job_title,
salary,
department_name AS department,
CONCAT(manager.first_name, ' ', manager.last_name)As manager
FROM employee 
LEFT JOIN employee manager
    ON manager.id = employee. manager_id
INNER JOIN roles 
    ON employee.roles_id = roles.id
INNER JOIN department
    ON department.id = roles.department_id
    ORDER BY department_name ASC;


