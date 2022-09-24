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