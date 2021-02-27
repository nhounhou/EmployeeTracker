const mysql = require('mysql');
const { prompt } = require('inquirer');
const figlet = require('figlet');

let listEmp=[];
let listRoles=[];
let listDept=[];

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
const viewTable = (table) => {
    const query=`SELECT * FROM ${table}`;
    connection.query(query, (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      console.table(res);
      AskQuestions();
    });
  };

//query INSERT INTO tables
const insertTable = (table) => {
    var queryEmp = 'INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (';
    var queryRoles = 'INSERT INTO roles (title, salary, department_id) VALUES (';
    var queryDept = 'INSERT INTO department (name) VALUES (';

    switch (table) {
        case 'Employee':
            prompt([
                {
                  type: 'input',
                  message: 'what is the Employee First Name?',
                  name: 'first'
                },
                {
                    type: 'input',
                    message: 'what is the Employee Last Name?',
                    name: 'last'
                  },
                  {
                    type: 'list',
                    message: "what is the Employee's roles ID?",
                    choices: listRoles,
                    name: 'role'
                  },
                  {
                    type: 'list',
                    message: "what is the Employee's Manager ID?",
                    choices: listMgr,
                    name: 'manager'
                  },
            ]).then(response => {
                const roleId=reponse.role.substring(0,response.dept.indexOf('-')-1);
                const mgrId=reponse.manager.substring(0,response.dept.indexOf('-')-1);
                queryEmp += `${reponse.fisrt},${response.last},${roleId},${mgrId})`;
                connection.query(sql, (err, res) => {
                    if (err) throw err;
                    console.log("1 record inserted");
                    AskQuestions();        
                });
            });
            break;
        case 'Roles':
            // const query=queryRoles;
            break;
        case 'Department':
            // const query=queryDept;
            break;                
        default:
            break;
    }
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
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
                choices() {
                    let deptArray=[];
                    // console.log('Table Department:');
                    for (i=0;i<res.length;i++) {
                        deptArray.push(`${res[i].id} - ${res[i].name}`);
                    }
                    return deptArray;                        
                },
                name: 'dept'
            },
        ]).then(reponse => {
            // console.log(reponse);
            const deptId=reponse.dept.substring(0,response.dept.indexOf('-')-1);
            var sql = `INSERT INTO roles (title, salary, department_id) VALUES ("${reponse.title}", ${reponse.salary}, ${deptId})`;
            connection.query(sql, (err, res) => {
            if (err) throw err;
            console.log("1 record inserted");
            AskQuestions();
            });
        });
    });
};

//query UPDATE tables
const updateRoles = () => {
    connection.query('SELECT id, first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;
        prompt([
            {
                type: 'list',
                message: 'Select the Employee to be updated',
                choices() {
                    let empArray=[];
                    for (i=0;i<res.length;i++) {
                        empArray.push(`${res[i].id} - ${res[i].first_name} ${res[i].last_name}`);
                    }
                    return empArray;
                },
                name: 'emp'
            },
            {
                type: 'input',
                message: 'What is the role ID?',
                name: 'roleId'
            }
        ]).then(response => {
            const empId=response.emp.substring(0,response.emp.indexOf('-')-1);
            var sql = "UPDATE employee SET roles_id = ? WHERE id = ?";
            // console.log(response.emp.indexOf('-'));
            // console.log(response.emp[0]);
            // console.log(response.emp.substring(0,1));
            // console.log(`id selected= ${empId}`);
            connection.query(sql, [ response.roleId, empId],function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
            }); 
            AskQuestions();
            // connection.end();
        });
    });
};

start();

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
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
    getLists();
    prompt([
        {
            type: 'list',
            message: 'what type of Action?',
            choices: ['C - Create/Insert','R - Read/View','U - Update','D- Delete','Special Query', 'Q - Quit'],
            name: 'action'
        },
    ]).then(response => {
        switch (response.action) {
            case 'C - Create/Insert':
                askCreate();
                break;
            case 'R - Read/View':
                askRead();
                break;
            case 'U - Update':
                askUpdate();
                break;
            case 'D- Delete':
                askDelete();
                break;
            case 'Special Query':
                sqlQueries();
                break;                                                
            case 'Q - Quit':
                connection.end();
            break;                                                
            default:
                break;
        }
    });
};

const commonQuestion = (param) =>  {
    const objReturn={
        type: 'list',
        message: `${param} for Which Table?`,
        choices: ['Employee','Roles','Department'],
        name: 'table'
    };
    return objReturn;
};

function askCreate(){
    prompt([commonQuestion('View')]).then(response => {
        insertTable(response.table);
    });
};

function askRead(){
    prompt([commonQuestion('View')]).then(response => {
        viewTable(response.table);
    });
};

function askUpdate(){
    prompt([commonQuestion('Update')]).then(response => {
        switch (response.table) {
            case 'Employee':
                console.log('U Emp');
                break;
            case 'roles':
                console.log('U Roles');
                break;
            case 'Department':
                console.log('U Dept');
                break;                
            default:
                break;
        }
        start();
    });
};

function askDelete(){
    prompt([commonQuestion('Delete')]).then(response => {
        switch (response.table) {
            case 'Employee':
                console.log('D Emp');
                break;
            case 'roles':
                console.log('D Roles');
                break;
            case 'Department':
                console.log('D Dept');
                break;                
            default:
                break;
        }
        start();
    });
};

function getLists() {
    const queryListEmp='SELECT * FROM employee';
    connection.query(queryListEmp, (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      for (i=0;i<res.length;i++) {
        listEmp.push(`${res[i].id} - ${res[i].first_name} ${res[i].last_name}`);
      };
    });

    const queryListRoles='SELECT * FROM roles';
    connection.query(queryListRoles, (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      for (i=0;i<res.length;i++) {
        listRoles.push(`${res[i].id} - ${res[i].title}`);
      };
    });

    const queryListDept='SELECT * FROM department';
    connection.query(queryListDept, (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      for (i=0;i<res.length;i++) {
        listDept.push(`${res[i].id} - ${res[i].name}`);
      };
    });
    return;
}