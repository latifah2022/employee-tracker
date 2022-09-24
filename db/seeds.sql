USE employee_db;
INSERT INTO departments(name)
VALUES 
('Engineering'),
('Sales'),
('Human Resources');

INSERT INTO roles(title, salary, department_id)
VALUES
('Project Manager', 200000, 1),
('Sales Rep', 50000, 2),
('HR Representative', 36000, 3),
('Frontend Developer', 35000, 1),
('Receptionist', 20000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id) 
VALUES
('Erik', 'Lew', 1, null),
('Mike', 'Lowry', 2, 1),
('John', 'Snow', 3, 1);