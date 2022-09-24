const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log("connected to db")
);

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

