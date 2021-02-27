DROP DATABASE IF EXISTS companyDB;

CREATE DATABASE companyDB;

USE companyDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(8,2) NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    roles_id INTEGER NOT NULL,
    manager_id INTEGER NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (roles_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- ADD DEPARTMENT SEEDS -----
INSERT INTO department (name)
VALUES ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

-- ADD EMPLOYEE ROLE SEEDS -------
INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2),
    ("Legal Team Lead", 250000, 4),
    ("Accountant", 125000, 3),
    ("Sales Lead", 100000, 1),
    ("Salesperson", 80000, 1),
    ("Software Engineer", 120000, 2),
    ("Lawyer", 190000, 4);

-- ADD EMPLOYEE SEEDS -------
INSERT INTO employee (first_name, last_name, manager_id, roles_id)
VALUE ("Jessica", "Haze", null, 1),
    ("Tiffany", "Patric", null, 2),
    ("Mia","Lam",null,3),
    ("Bently", "Lao", 1, 4),
    ("Chris", "Melby", 4, 5),
    ("Jason", "Baker", 1, 6),
    ("Tom", "Nice", 2, 7);

-- UPDATE employee Roles
USE companyDB;
UPDATE employee
SET roles_id=4
WHERE id=1;

-- UPDATE employee manager
USE companyDB;
UPDATE employee
SET manager_id=4
WHERE id=1;

-- DELETE employee
USE companyDB;
DELETE FROM employee
WHERE id=1;

-- DELETE roles
USE companyDB;
DELETE FROM roles
WHERE id=1;

-- DELETE department
USE companyDB;
DELETE FROM department
WHERE id=1;

-- query all employee
USE companyDB;
select * from employee;

-- query all roles
USE companyDB;
select * from roles;

-- query all department
USE companyDB;
select * from department;

-- query view all employee details
USE companyDB;
select * 
from employee e
left join  employee m
on e.manager_id=m.id;


-- query view total utilized budget => total salaries by department
USE companyDB;
select d.name 'Department Name', sum(r.salary) 'Utilized Budget'
from employee e
join roles r
on e.roles_id=r.id
join department d
on r.department_id=d.id
where r.department_id=4;

-- query to get all managers
use companyDB;
select *
from employee
where id in (
select distinct manager_id
from employee
where manager_id is not null)
or manager_id is null;