const mysql = require('mysql');
const { prompt } = require('inquirer');
const figlet = require('figlet');

var listEmp=[];
var listRoles=[];
var listDept=[];
var listMgr=[];

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

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
    AskQuestions();
});


//query all data per tables
function viewTable(table) {
    const query=`SELECT * FROM ${table}`;
    connection.query(query, (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      console.table(res);
      AskQuestions();
    });
  };

// query INSERT INTO tables
function insertTable(table) {
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
function updateTable(table) {
    var queryUptEmp = 'UPDATE employee SET ';
    var queryUptRoles = 'UPDATE roles SET ';
    var queryUptDept = 'UPDATE department SET ';
    
    switch (table) {
        case 'Employee':
            prompt([
                {
                    type: 'list',
                    message: 'Select the Employee to be update',
                    choices: listEmp,
                    name: 'emp'
                }
            ]).then(response => {
                prompt([
                    {
                        type: 'list',
                        message: 'Select the field to be updated',
                        choices: ['first_name','last_name','role','manager'],
                        name: 'choix'
                    },
                ]).then(reponse => {
                    console.log(response.emp);
                    console.log(reponse.choix);
                    if (reponse.choix === 'role') {
                        console.log(listRoles);
                        prompt([
                            {
                                type: 'list',
                                message: 'Select the new Role',
                                choices: listRoles,
                                name: 'role'
                            }
                        ]).then(answer => {
                            var roleId=answer.role.substring(0,answer.role.indexOf('-')-1);
                            queryUptEmp += `roles_id = ${roleId} `
                            var empId=response.emp.substring(0,response.emp.indexOf('-')-1);
                            queryUptEmp += `WHERE id=${empId}`;
                            connection.query(queryUptEmp, (err, res) => {
                                if (err) throw err;
                                console.log("1 record updated in Employee");
                                AskQuestions();        
                            });
                        });
                    } else if (reponse.choix === manager) {
                        prompt([
                            {
                                type: 'list',
                                message: 'Select the new Manager',
                                choices: listMgr,
                                name: 'mgr'
                            }
                        ]).then(answer => {
                            var mgrId=answer.mgr.substring(0,answer.mgr.indexOf('-')-1);
                            queryUptEmp += `manager_id = ${mgrId} `
                            var empId=response.emp.substring(0,response.emp.indexOf('-')-1);
                            queryUptEmp += `WHERE id=${empId}`;
                            connection.query(queryUptEmp, (err, res) => {
                                if (err) throw err;
                                console.log("1 record updated in Employee");
                                AskQuestions();        
                            });
                        });
                        
                    } else {
                        prompt([
                            {
                                type: 'input',
                                message: 'Enter the new value',
                                name: 'value'
                            }
                        ]).then(answer => {
                            queryUptEmp += `${reponse.choix} = ${answer.value} `
                            var empId=response.emp.substring(0,response.emp.indexOf('-')-1);
                            queryUptEmp += `WHERE id=${empId}`;
                            connection.query(queryUptEmp, (err, res) => {
                                if (err) throw err;
                                console.log("1 record updated in Employee");
                                AskQuestions();        
                            });
                        });
                    };
                });    
            });
            break;
        case 'Roles':
            prompt([
                {
                    type: 'list',
                    message: 'Select the Role to be updated',
                    choices: listRoles,
                    name: 'role'
                }
            ]).then(response => {
                prompt([
                    {
                        type: 'list',
                        message: 'Select the field to update',
                        choices: ['salary','departement'],
                        name: 'choix'
                    }
                ]).then(reponse => {
                    if (reponse.choix === 'salary'){
                        prompt([
                            {
                                typer: 'input',
                                message: 'Enter the new salary',
                                name: 'salary'
                            }
                        ]).then(answer => {
                            var roleId=response.role.substring(0,response.role.indexOf('-')-1);
                            queryUptRoles += ` salary=${answer.salary} where id=${roleId}`
                            connection.query(queryUptRoles, (err, res) => {
                                if (err) throw err;
                                console.log("1 record updated in Roles");
                                AskQuestions();        
                            });
                        });
                    } else {
                        prompt([
                            {
                                type: 'list',
                                message: 'Select the new departement',
                                choices: listDept,
                                name: 'dept'
                            }
                        ]).then(answer => {
                            var roleId=response.role.substring(0,response.role.indexOf('-')-1);
                            var deptId=answer.dept.substring(0,answer.dept.indexOf('-')-1);
                            queryUptRoles += ` department_id=${deptId} WHERE id=${roleId}`
                            connection.query(queryUptRoles, (err, res) => {
                                if (err) throw err;
                                console.log("1 record updated in Roles");
                                AskQuestions();        
                            });
                        });
                    };
                });
            });
            break;
        case 'Department':
            prompt([
                {
                    type: 'list',
                    message: 'Select the department to be updated',
                    choices: listDept,
                    name: 'dept'
                },
                {
                    type: 'input',
                    message: 'What is the new name?',
                    name: 'name'
                }
            ]).then(response => {
                var deptId=response.dept.substring(0,response.dept.indexOf('-')-1);
                queryUptDept += `name='${response.name}' WHERE id=${deptId}`
                connection.query(queryUptDept, (err, res) => {
                    if (err) throw err;
                    console.log("1 record updated in Department");
                    AskQuestions();        
                });
            });
            break;
        default:
            break;
    }
};

//query DELETE tables
function deleteTable(table) {
    var queryDelEmp = 'DELETE FROM employee WHERE id=';
    var queryDelRoles = 'DELETE FROM roles WHERE id=';
    var queryDelDept = 'DELETE FROM department WHERE id=';
    
    switch (table) {
        case 'Employee':
            // console.log(listEmp);
            prompt([
                {
                    type: 'list',
                    message: 'Select the Employee to be deleted',
                    choices: listEmp,
                    name: 'emp'
                }
            ]).then(response => {
                var empId=response.emp.substring(0,response.emp.indexOf('-')-1);
                queryDelEmp += `${empId}`;
                connection.query(queryDelEmp, (err, res) => {
                    if (err) throw err;
                    console.log("1 record deleted in Employee");
                    AskQuestions();        
                });
            });
            break;
        case 'Roles':
            // console.log(listRoles);
            prompt([
                {
                    type: 'list',
                    message: 'Select the Role to be deleted',
                    choices: listRoles,
                    name: 'role'
                }
            ]).then(response => {
                var roleId=response.role.substring(0,response.role.indexOf('-')-1);
                queryDelRoles += `${roleId}`;
                connection.query(queryDelRoles, (err, res) => {
                    if (err) throw err;
                    console.log("1 record deleted in Roles");
                    AskQuestions();        
                });
            });
            break;
        case 'Department':
            // console.log(listDept);
            prompt([
                {
                    type: 'list',
                    message: 'Select the Department to be deleted',
                    choices: listDept,
                    name: 'dept'
                }
            ]).then(response => {
                var deptId=response.dept.substring(0,response.dept.indexOf('-')-1);
                queryDelDept += `${deptId}`;
                connection.query(queryDelDept, (err, res) => {
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

function commonQuestion(param) {
    const objReturn={
        type: 'list',
        message: `${param} for Which Table?`,
        choices: ['Employee','Roles','Department'],
        name: 'table'
    };
    return objReturn;
};

function askCreate(){
    prompt([commonQuestion('Insert')]).then(response => {
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

function getLists() {
    listEmp=[];
    connection.query('SELECT * FROM employee', (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      for (i=0;i<res.length;i++) {
        listEmp.push(`${res[i].id} - ${res[i].first_name} ${res[i].last_name}`);
      };
    //   console.log('getLists: EMP=' + listEmp);
    });
    
    listRoles=[];
    connection.query('SELECT * FROM roles', (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      for (i=0;i<res.length;i++) {
        listRoles.push(`${res[i].id} - ${res[i].title}`);
      };
    //   console.log('getLists: ROLE=' + listRoles);
    });

    listDept=[];
    connection.query('SELECT * FROM department', (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      for (i=0;i<res.length;i++) {
        listDept.push(`${res[i].id} - ${res[i].name}`);
      };
    //   console.log('getLists: DEPT=' + listDept);
    });

    listMgr=[];
    const myQueryMgr='select * from employee where id in ( select distinct manager_id from employee where manager_id is not null) or manager_id is null';
    connection.query(myQueryMgr, (err, res) => {
      if (err) throw err;
      // console.log('Table Employee:');
      for (i=0;i<res.length;i++) {
        listMgr.push(`${res[i].id} - ${res[i].first_name} ${res[i].last_name}`);
      };
      //adding no manager
      listMgr.push('N - No Manager');
    //   console.log('getLists: MGR=' + listMgr);
    });
};