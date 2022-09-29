const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'latifah',
        database: 'employee_db'
    },
    console.log("connected")
);

const promptUser = () => {
    inquirer
        .prompt({
            type: "list",
            choices: ["view departments", "view roles", "view employee", "add new department", "add new role", "add new employee", "quit"],
            message: "choose an option",
            name: "choice"
        })
        .then(({ choice }) => {
            switch (choice) {
                case "view departments":
                    getDepartments();
                    break;
                case "view employee":
                    getEmployees();
                    break;

                case "view roles":
                    getRoles();
                    break;

                case "add new department":
                    addDepartment();
                    break;

                case "add new employee":
                    addEmployee();
                    break;
                case "add new role":
                    addRole();
                    break;
                case "Update Employee Role":
                    updateEmp();
                    break;
        
                case "Exit Program":
                    console.log("Goodbye!");
                    connection.end();
                    break;
        
                default:
                    console.log("No option selected.");
                    break;    
            }
        });
};


const getDepartments = () => {
    db.query("SELECT * FROM departments", (err, data) => {
        if (err) {
            console.log(err)
            db.end();
        } else {
            console.table(data);
            promptUser();
        }
    }
    )
};

const getEmployees = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, roles.department_id, departments.name FROM employee JOIN roles on employee.role_id=roles.id JOIN departments ON roles.department_id=departments.id", (err, data) => {
        if (err) {
            console.log(err)
            db.end();
        } else {
            console.table(data);
            promptUser();
        }
    }
    )
};

function getRoles() {
    connection.query(`SELECT A.id, A.title, A.salary, B.department_name FROM roles AS A LEFT JOIN departments AS B ON B.id = A.department_id`,
        function (err, results) {
            if (err)  {
            console.table(results);
            } else {
                viewRoles();
            }
        }
    );
};

const addDepartment = () => {
    inquirer.prompt(departmentPrompt)
        .then(choice => {
            db.query(`INSERT INTO departments (name) VALUES(?)`, [choice.name], (err, data) => {
                if (err) {
                    console.log(err);
                    db.end();
                } else {
                    console.log("department added");
                    viewDepartments();
                }
            })

        })
};

const addRole = () => {
    db.query("SELECT * FROM departments", (err, data) => {
        if (err) {
            console.log(err)
            db.end();
        } else {
            const inqDept = data.map(department => {
                return {
                    name: department.name,
                    value: department.id
                }
            })
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Department: ",
                        choices: inqDept,
                        name: "department_id"
                    },
                    {
                        type: "input",
                        message: "Job Title: ",
                        name: "title"
                    },
                    {
                        type: "input",
                        message: "Salary: ",
                        name: "salary"
                    }
                ]).then(answers => {
                    db.query(`INSERT INTO roles (title,salary,department_id) VALUES(?,?,?)`,
                        [answers.title, answers.salary, answers.department_id], (err, data) => {
                            if (err) {
                                console.log(err);
                                db.destroy();
                            } else {
                                console.log("role added");
                                viewRoles();
                            }
                        }
                    )
                });
        }
    })
};

const addEmployee = () => {
    db.query("SELECT * FROM roles", (err, data) => {
        if (err) {
            console.log(err)
            db.end();
        } else {
            const inqRoles = data.map(role => {
                return {
                    name: role.title,
                    value: role.id
                }
            });
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Job Title: ",
                        choices: inqRoles,
                        name: "role_id"
                    },
                    {
                        type: "input",
                        message: "Employee First Name: ",
                        name: "first_name"
                    },
                    {
                        type: "input",
                        message: "Employee Last Name: ",
                        name: "last_name"
                    },
                    {
                        type: "input",
                        message: "Manager ID(optional): ",
                        name: "manager_id"
                    }

                ]).then(answers => {
                    db.query(`INSERT INTO employee (first_name,last_name,role_id, manager_id) VALUES(?,?,?,?)`,
                        [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, data) => {
                            if (err) {
                                console.log(err);
                                db.destroy();
                            } else {
                                console.log("employee added");
                                viewEmployee();
                            }
                        }
                    )
                });
        }
    })
};

const updateEmp = () => {
    connection.query(
        'SELECT CONCAT(employees.first_name, " ",employees.last_name) AS full_name, employees.id as empl_id, roles.* FROM employees RIGHT JOIN roles on employees.role_id = roles.id',
        function (err, res) {
            if (err) throw err;
            let employeeList = res.map(employee => ({
                full_name: employee.full_name,
                id: employee.empl_id,
                value: [employee.full_name, employee.empl_id]
            }))

            let roleList = res.map(roles => ({
                title: roles.title,
                id: roles.id,
                value: [roles.title, roles.id]
            }));

            inquirer.prompt([{
                type: 'list',
                name: 'employee',
                choices: employeeList,
                message: 'Which employee would you like to edit?'
            },
            {
                type: 'list',
                name: 'newRole',
                choices: roleList,
                message: 'What role do you want to assign to this employee?'
            }
            ])

            .then((answer) => {
                let editID = answer.employee[1];
                let newRoleId = answer.newRole[1];
                connection.query(`UPDATE employees SET role_id=${newRoleId} WHERE id=${editID};`,
                    function (err, res) {
                        if (err) {
                            console.log(err)
                        } else {
                        console.table(res);
                        moreActions();
                    }
                    })
            })
        }
    )
};

promptUser();
