const { prompt } = require('inquirer');

function start() {
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
            break;                                                
            default:
                break;
        }
    });
};

start();

const commonQuestion = (param) =>  {
    const objReturn={
        type: 'list',
        message: `${param} in Which Table?`,
        choices: ['Employee','Roles','Departments'],
        name: 'table'
    };
    return objReturn;
};

function askCreate(){
    prompt([commonQuestion('Create')]).then(response => {
        switch (response.table) {
            case 'Employee':
                console.log('C Emp');
                break;
            case 'roles':
                console.log('C Roles');
                break;
            case 'Department':
                console.log('C Dept');
                break;                
            default:
                break;
        }
        start();
    });
};

function askRead(){
    prompt([commonQuestion('View')]).then(response => {
        switch (response.table) {
            case 'Employee':
                console.log('R Emp');
                break;
            case 'roles':
                console.log('R Roles');
                break;
            case 'Department':
                console.log('R Dept');
                break;                
            default:
                break;
        }
        start();
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

function sqlQueries() {
    console.log('SQL Queries');
    start();
};