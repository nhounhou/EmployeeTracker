const mysql = require('mysql');
const { prompt } = require('inquirer');
const figlet = require('figlet');

let listEmp=[];
let listRoles=[];
let listDept=[];
let listMgr=[];

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
            queryListEmp();
            queryListMgr();
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
                const roleId=response.role.substring(0,response.role.indexOf('-')-1);
                let mgrId=response.manager.substring(0,response.manager.indexOf('-')-1);
                if (mgrId === 'N') {mgrId='Null'}
                queryEmp += `'${response.first}','${response.last}',${roleId},${mgrId})`;
                connection.query(queryEmp, (err, res) => {
                    if (err) throw err;
                    console.log("1 record inserted in Employee");
                    AskQuestions();        
                });
            });
            break;
        case 'Roles':
            queryListDept();
            prompt([
                {
                    type: 'input',
                    message: 'What is the Title?',
                    name: 'title'
                },
                {
                    type: 'input',
                    message: 'What is the Salary?',
                    name: 'salary'
                },
                {
                    type: 'list',
                    message: 'What is the Department?',
                    choices: listDept,
                    name: 'dept'
                },
            ]).then(response => {
                const deptId=response.dept.substring(0,response.dept.indexOf('-')-1);
                queryRoles += `'${response.title}',${response.salary},${deptId})`;
                connection.query(queryRoles, (err, res) => {
                    if (err) throw err;
                    console.log("1 record inserted in Roles");
                    AskQuestions();        
                });
            });
            break;
        case 'Department':
            prompt([
                {
                    type: 'input',
                    message: 'What is the Department name?',
                    name: 'dept'
                }
            ]).then(response => {
                queryDept += `'${response.dept}')`;
                connection.query(queryDept, (err, res) => {
                    if (err) throw err;
                    console.log("1 record inserted in Department");
                    AskQuestions();        
                });
            });
            break;                
        default:
            break;
    }
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

//query DELETE tables
const deleteTable = (table) => {
    var queryEmp = 'DELETE FROM employee WHERE id=';
    var queryRoles = 'DELETE FROM roles WHERE id=';
    var queryDept = 'DELETE FROM department WHERE id=';

    switch (table) {
        case 'employee':
            queryListEmp();
            prompt([
                {
                    type: 'list',
                    message: 'Select the Employee to be deleted',
                    choices: listEmp,
                    name: 'emp'
                }
            ]).then(response => {
                var empId=response.emp.substring(0,response.emp.indexOf('-')-1);
                queryEmp += `${empId})`;
                connection.query(queryEmp, (err, res) => {
                    if (err) throw err;
                    console.log("1 record deleted in Employee");
                    AskQuestions();        
                });
            });
            break;
        case 'roles':
            queryListRoles();
            prompt([
                {
                    type: 'list',
                    message: 'Select the Role to be deleted',
                    choices: listRoles,
                    name: 'role'
                }
            ]).then(response => {
                var roleId=response.role.substring(0,response.role.indexOf('-')-1);
                queryRoles += `${roleId})`;
                connection.query(queryRoles, (err, res) => {
                    if (err) throw err;
                    console.log("1 record deleted in Roles");
                    AskQuestions();        
                });
            });
            break;
        case 'department':
            queryListDept();
            prompt([
                {
                    type: 'list',
                    message: 'Select the Department to be deleted',
                    choices: listDept,
                    name: 'dept'
                }
            ]).then(response => {
                var deptId=response.dept.substring(0,response.dept.indexOf('-')-1);
                queryDept += `${deptId})`;
                connection.query(queryDept, (err, res) => {
                    if (err) throw err;
                    console.log("1 record deleted in Department");
                    AskQuestions();        
                });
            });
            break;
        default:
            break;
    }
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
    // getLists();
    prompt([
        {
            type: 'list',
            message: 'what type of Action?',
            choices: ['C - Create/Insert','R - Read/View','U - Update','D - Delete','Special Query', 'Q - Quit'],
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
            case 'D - Delete':
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
        updateTable(response.table);
    });
};

function askDelete(){
    prompt([commonQuestion('Delete')]).then(response => {
        deleteTable(response.table);
    });
};

// function getLists() {
const queryListEmp= () => {
    connection.query('SELECT * FROM employee', (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      for (i=0;i<res.length;i++) {
        listEmp.push(`${res[i].id} - ${res[i].first_name} ${res[i].last_name}`);
      };
    });
    return listEmp;
};

const queryListRoles= () => {
    connection.query('SELECT * FROM roles', (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      for (i=0;i<res.length;i++) {
        listRoles.push(`${res[i].id} - ${res[i].title}`);
      };
    });
    return listRoles;
};

const queryListDept= () => {
    connection.query('SELECT * FROM department', (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      for (i=0;i<res.length;i++) {
        listDept.push(`${res[i].id} - ${res[i].name}`);
      };
    });
    return listDept;
};

const queryListMgr= () => {
    const myQueryMgr='select * from employee where id in ( select distinct manager_id from employee where manager_id is not null) or manager_id is null';
    connection.query(myQueryMgr, (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      for (i=0;i<res.length;i++) {
        listMgr.push(`${res[i].id} - ${res[i].first_name} ${res[i].last_name}`);
      };
      //adding no manager
      listMgr.push('N - No Manager');
    });
    return listMgr;
};
// }