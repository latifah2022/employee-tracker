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