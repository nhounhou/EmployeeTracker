const mysql = require('mysql');
const { prompt } = require('inquirer');
const figlet = require('figlet');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: '12345678',
  database: 'companyDB',
});

//query all data per tables
const afterConnectionEmp = () => {
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.log('Table Employee:');
    console.log(res);
    connection.end();
  });
};

const afterConnectionRoles = () => {
  connection.query('SELECT * FROM roles', (err, res) => {
    if (err) throw err;
    console.log('Table Roles:');
    console.log(res);
    connection.end();
  });
};

let deptArray=[];
const afterConnectionDept = () => { 
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        // console.log('Table Department:');
        // console.log(res);
        for (i=0;i<res.length;i++){
            deptArray.push(res[i].id);
        };
    });
    return deptArray;    
};

//query INSERT INTO tables
const insertRoles = () => {
    prompt([
        {
            type: 'input',
            message: 'enter TITLE',
            name: 'title'
        },
        {
            type: 'input',
            message: 'enter SALARY',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'enter DEPARTMENT id',
            choices: afterConnectionDept(),
            name: 'dept'
        },
    ]).then(reponse => {
        // console.log(reponse);
        var sql = `INSERT INTO roles (title, salary, department_id) VALUES ("${reponse.title}", ${reponse.salary}, ${reponse.dept})`;
        connection.query(sql, (err, res) => {
          if (err) throw err;
          console.log("1 record inserted");
        });
    });
};

//query UPDATE tables
const updateRoles = () => {
    var sql = "UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    }); 
};

start();

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    // insertRoles();
    AskQuestions();
});

function start(){
    figlet.text('Employee Tracker !!', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 90,
        whitespaceBreak: true
    }, function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
    });};

function AskQuestions(){
    prompt([
        {
            type: 'list',
            message: 'What query do you want to execute?',
            choices: ['Employee List','Roles List','Department List', 'Insert Roles', 'Quit'],
            name: 'queryName'
        },
    ]).then(reponse => {
        switch (reponse.queryName) {
            case 'Employee List':
                afterConnectionEmp();
                break;
            case 'Roles List':
                afterConnectionRoles();
                break;
            case 'Department List':
                afterConnectionDept();
                break;
            case 'Insert Roles':
                insertRoles();
                break;
            default:
                break;
        };
    });
};