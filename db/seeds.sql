USE employee_db;
INSERT INTO departments(name)
VALUES 
('Engineering'),
('Sales'),
('Human Resources'),
('Leagal');

INSERT INTO roles(title, salary, department_id)
VALUES
('Project Manager', 200000, 1),
('Sales Rep', 50000, 2),
('Receptionist', 20000, 3);
('HR Representative', 36000, 3),
('Frontend Developer', 35000, 1),
('Backend', 30000, 2),
('Lawywer', 40000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) 
VALUES
('Tom', 'Lew', 1, null),
('Mike', 'Smith', 2, 1),
('John', 'Snow', 3, 1),
("Michelle", "Myers", 3, 1),
("Gill", "Frankel", 5, 1),
("Sherry", "McDonald", 3, 1),
("Katie", "Cormack", 4, 1),
("Kendall", "Mancino", 3, 1),
("Mark", "Rowley", 3, 1);

