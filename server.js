const inquirer = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3002;

// Connect to database
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'dbpass',
	database: 'employees_db',
});

connection.connect(function (err) {
	if (err) throw err;
	console.log(`Connected!`);
	figlet('Employee Tracker!', function (err, data) {
		if (err) {
			console.log('Something went wrong...');
			console.dir(err);
			return;
		}
		console.log(data);
	});
	startApp();
});

startApp = () => {
	inquirer
		.prompt([
			{
				name: 'action',
				type: 'list',
				message:
					'Welcome to the Employee Manager Database! What would you like to do?',
				choices: [
					'View all departments',
					'View all roles',
					'View all employees',
					'View all employees by manager',
					'View all employees by department',
					'View utilized budget by department',
					'Add a department',
					'Add a role',
					'Add an employee',
					'Update employee role',
					'Update employee manager',
					'Exit',
				],
			},
		])
		.then((answer) => {
			switch (answer.action) {
				case 'View all departments':
					viewAllDepartments();
					break;

				case 'View all roles':
					viewAllRoles();
					break;

				case 'View all employees':
					viewAllEmployees();
					break;

				case 'View all employees by manager':
					viewAllEmployeesByManager();
					break;

				case 'View all employees by department':
					viewAllEmployeesByDepartment();
					break;

				case 'View utilized budget by department':
					viewUtilizedBudgetByDepartment();
					break;

				case 'Add a department':
					addDepartment();
					break;

				case 'Add a role':
					addRole();
					break;

				case 'Add an employee':
					addEmployee();
					break;

				case 'Update employee role':
					updateEmployeeRole();
					break;

				case 'Update employee manager':
					updateEmployeeManager();
					break;

				case 'Exit':
					connection.end();
					console.log(
						`\n"Thank you for visiting the Employee Manager Database.\n`
					);
					return;
				default:
					break;
			}
		});
};

viewAllDepartments = () => {
	connection.query(
		`SELECT * FROM department ORDER BY department.id ASC;`,
		(err, res) => {
			if (err) throw err;
			console.table('\n', res, '\n');
			startApp();
		}
	);
};

viewAllRoles = () => {
	connection.query(
		`SELECT 
    roles.id,
    job_title AS title, 
    department_name AS department, 
    salary 
    FROM roles 
    INNER JOIN department 
    ON roles.department_id = department.id 
    ORDER BY roles.id ASC;`,
		(err, res) => {
			if (err) throw err;
			console.table('\n', res, '\n');
			startApp();
		}
	);
};

viewAllEmployees = () => {
	connection.query(
		`SELECT 
      employee.id,
      employee.first_name, 
      employee.last_name, 
      job_title,
      salary,
      department_name AS department,
      CONCAT(manager.first_name, ' ', manager.last_name)As manager
      FROM employee 
      LEFT JOIN employee manager
          ON manager.id = employee. manager_id
      INNER JOIN roles 
          ON employee.roles_id = roles.id
      INNER JOIN department
          ON department.id = roles.department_id
          ORDER BY employee.id ASC;`,
		(err, res) => {
			if (err) throw err;
			console.table('\n', res, '\n');
			startApp();
		}
	);
};

viewAllEmployeesByManager = () => {
	connection.query(
		`SELECT 
      employee.id,
      employee.first_name, 
      employee.last_name, 
      job_title,
      salary,
      department_name AS department,
      CONCAT(manager.first_name, ' ', manager.last_name)As manager
      FROM employee 
      LEFT JOIN employee manager
          ON manager.id = employee. manager_id
      INNER JOIN roles 
          ON employee.roles_id = roles.id
      INNER JOIN department
          ON department.id = roles.department_id
          ORDER BY manager ASC;`,
		(err, res) => {
			if (err) throw err;
			console.table('\n', res, '\n');
			startApp();
		}
	);
};

viewAllEmployeesByDepartment = () => {
	connection.query(
		`SELECT 
      employee.id,
      employee.first_name, 
      employee.last_name, 
      job_title,
      salary,
      department_name AS department,
      CONCAT(manager.first_name, ' ', manager.last_name)As manager
      FROM employee 
      LEFT JOIN employee manager
          ON manager.id = employee. manager_id
      INNER JOIN roles 
          ON employee.roles_id = roles.id
      INNER JOIN department
          ON department.id = roles.department_id
          ORDER BY department_name ASC;`,
		(err, res) => {
			if (err) throw err;
			console.table('\n', res, '\n');
			startApp();
		}
	);
};

viewUtilizedBudgetByDepartment = () => {
	connection.query(
		`SELECT 
      department_name AS department, 
      SUM(salary) AS utilized_budget 
      FROM roles 
      INNER JOIN department 
      ON roles.department_id = department.id 
      GROUP BY  department_name;`,
		(err, res) => {
			if (err) throw err;
			console.table('\n', res, '\n');
			startApp();
		}
	);
};

addDepartment = () => {
	inquirer
		.prompt([
			{
				name: 'addNewDepartment',
				type: 'input',
				message: 'Enter the name of the new department?',
			},
		])
		.then((answer) => {
			connection.query(
				`INSERT INTO department SET ?`,
				{
					department_name: answer.addNewDepartment,
				},
				(err, res) => {
					if (err) throw err;
					console.log(
						`\n ${answer.addNewDepartment} successfully added to database! \n`
					);
					viewAllDepartments();
					startApp();
				}
			);
		});
};

addRole = () => {
	connection.query(`SELECT * FROM department;`, (err, res) => {
		if (err) throw err;
		let departments = res.map((department) => ({
			name: department.department_name,
			value: department.id,
		}));

		inquirer
			.prompt([
				{
					name: 'jobTitle',
					type: 'input',
					message: 'Enter the job title for the new role.',
				},
				{
					name: 'salary',
					type: 'input',
					message: 'Add salary for the new role.',
				},
				{
					name: 'departmentName',
					type: 'list',
					message: 'Select department and add new role.',
					choices: departments,
				},
			])
			.then((answer) => {
				connection.query(
					`INSERT INTO roles SET ?`,
					{
						job_title: answer.jobTitle,
						salary: answer.salary,
						department_id: answer.departmentName,
					},
					(err, res) => {
						if (err) throw err;
						console.log(
							`\n ${answer.title} successfully added to database! \n`
						);
						viewAllRoles();
						startApp();
					}
				);
			});
	});
};

addEmployee = () => {
	connection.query(`SELECT * FROM roles;`, (err, res) => {
		if (err) throw err;

		let role = res.map((roles) => ({ name: roles.job_title, value: roles.id }));
		connection.query(`SELECT * FROM employee;`, (err, res) => {
			if (err) throw err;
			let employees = res.map((employee) => ({
				name: employee.first_name + ' ' + employee.last_name,
				value: employee.id,
			}));

			inquirer
				.prompt([
					{
						name: 'firstName',
						type: 'input',
						message: 'Enter the first name of the new employee.',
					},
					{
						name: 'lastName',
						type: 'input',
						message: 'Enter the last name of the new employee.',
					},
					{
						name: 'newRole',
						type: 'list',
						message: 'Enter the job title for the new employee.',
						choices: role,
					},
					{
						name: 'manager',
						type: 'list',
						message: 'Select a manager for the new employee.',
						choices: employees,
					},
				])
				.then((answer) => {
					connection.query(
						`INSERT INTO employee SET ?`,
						{
							first_name: answer.firstName,
							last_name: answer.lastName,
							roles_id: answer.newRole,
							manager_id: answer.manager,
						},

						(err, res) => {
							if (err) throw err;
							console.log(
								`\n ${answer.firstName} ${answer.lastName} successfully added to database! \n`
							);
							viewAllEmployees();
							startApp();
						}
					);
				});
		});
	});
};

updateEmployeeRole = () => {
	connection.query(`SELECT * FROM roles;`, (err, res) => {
		if (err) throw err;
		let role = res.map((roles) => ({ name: roles.job_title, value: roles.id }));

		connection.query(`SELECT * FROM employee;`, (err, res) => {
			if (err) throw err;
			let employees = res.map((employee) => ({
				name: employee.first_name + ' ' + employee.last_name,
				value: employee.id,
			}));

			inquirer
				.prompt([
					{
						name: 'employee',
						type: 'list',
						message: 'Select an employee to update the job title.',
						choices: employees,
					},
					{
						name: 'newRole',
						type: 'list',
						message: 'Select the new job title for the employee.',
						choices: role,
					},
				])
				.then((answer) => {
					connection.query(
						`UPDATE employee SET ? WHERE ?`,
						[{ roles_id: answer.newRole }, { manager_id: answer.employee }],

						(err, res) => {
							if (err) throw err;
							console.log(`\n successfully updated the job title! \n`);
							//viewAllEmployees();
							startApp();
						}
					);
				});
		});
	});
};

updateEmployeeManager = () => {
	connection.query(`SELECT * FROM employee;`, (err, res) => {
		if (err) throw err;
		let employees = res.map((employee) => ({
			name: employee.first_name + ' ' + employee.last_name,
			value: employee.id,
		}));

		inquirer
			.prompt([
				{
					name: 'employee',
					type: 'list',
					message: 'Select an employee to update the manager.',
					choices: employees,
				},
				{
					name: 'newManager',
					type: 'list',
					message: 'Select the new manager for the employee.',
					choices: employees,
				},
			])
			.then((answer) => {
				connection.query(
					`UPDATE employee SET ? WHERE ?`,
					[
						{
							manager_id: answer.newManager,
						},
						{ id: answer.employee },
					],

					(err, res) => {
						if (err) throw err;
						console.log(
							`\n successfully updated the manager to the database! \n`
						);
						viewAllEmployees();
						startApp();
					}
				);
			});
	});
};
