INSERT INTO department (id, department_name)
VALUES (1, "Sales"),
       (2, "Engineering"),
       (3, "Finance"),
       (4, "Legal");
       
       
INSERT INTO roles (id, job_title, salary, department_id)
VALUES  (1, "Sales Lead", 100000, 1),
        (2, "Salesperson", 80000, 1),
        (3, "Lead Engineer", 150000, 2),
        (4, "Software Engineer", 120000, 2),
        (5, "Account Manager", 160000, 3),
        (6, "Accountant", 125000, 3),
        (7, "Legal Team Lead", 250000, 4),
        (8, "Lawyer", 190000, 4);
        
       
INSERT INTO employee (id, first_name, last_name, roles_id, manager_id)
VALUES  (1, "John","Doe", "Sales Lead", "Sales", 100000),
        (2, "Mike","Chan", "Salesperson", "Sales", 80000, "John Doe"),
        (3, "Ashley","Rodriquez", "Lead Engineer", "Engineering", 150000),  
        (4, "Kevin","Tupik", "Software Engineer", "Engineering", 120000, "Ashley Rodriquez"),
        (5, "Kunal","Singh", "Account Manager", "Finance", 160000),  
        (6, "Malia","Brown", "Accountant", "Finance", 125000, "Kunal Singh"), 
        (7, "Sarah","Lourd", "Legal Team Lead", "Legal", 250000),   
        (8, "Tom","Allen", "Lawyer", "Legal", 190000, "Sarah Lourd"); 
        