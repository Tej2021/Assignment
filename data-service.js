const fs = require("fs");

var employees = [];
var departments = [];




module.exports.Initialize = function () {

    return new Promise(function (resolve, reject) {

        try {

            fs.readFile('./data/employees.json', function (err, data) {
                if (err)

                    throw err;

                employees = JSON.parse(data);

            });

            fs.readFile('./data/departments.json', function (err, data) {
                if (err) throw err;
                departments = JSON.parse(data);
            });

        } catch (ex) {

            reject("Unable to read file");
        }
        resolve("File successfully read.");

    });
}


module.exports.getAllEmployees = function () {

    return new Promise(function (resolve, reject) {

        if (employees.length == 0) {

            reject("No data")
        }
        else {
            resolve(employees);
        }
    });
}


module.exports.getManagers = function () {

    var managers = [];

    return new Promise(function (resolve, reject) {

        for (i = 0; i < employees.length; i++) {

            if (employees[i].isManager == true) {
                managers.push(employees[i])
            };

        }

        if (managers.length == 0) {

            reject("No data")
        }

        resolve(managers);

    });
}



module.exports.getDepartments = function () {

    return new Promise(function (resolve, reject) {

        if (employees.length == 0) {

            reject("No results returned")
        }

        else {
            resolve(departments);
        }


    });
}




module.exports.addEmployee = function (employeeData) {


    return new Promise(function (resolve, reject) {

        if (employeeData.isManager == undefined) {

            employeeData.isManager == false;
        }

        else {
            employeeData.isManager == true;
        }
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve(employees);
    });
}


module.exports.getEmployeesByStatus = function (status) {


    var EmployeesByStatus = [];

    return new Promise(function (resolve, reject) {

        for (i = 0; i < employees.length; i++) {

            if (employees[i].status == status) {
                EmployeesByStatus.push(employees[i])
            };

        }

        if (EmployeesByStatus.length == 0) {

            reject("No data")
        }

        resolve(EmployeesByStatus);

    });
}




module.exports.getEmployeesByDepartment = function (department) {


    var EmployeesByDepartment = [];

    return new Promise(function (resolve, reject) {

        for (i = 0; i < employees.length; i++) {

            if (employees[i].department == department) {
                EmployeesByDepartment.push(employees[i])
            };

        }

        if (EmployeesByDepartment.length == 0) {

            reject("No data")
        }

        resolve(EmployeesByDepartment);

    });
}



module.exports.getEmployeesByManager = function (manager) {


    var EmployeesByManager = [];

    return new Promise(function (resolve, reject) {

        for (i = 0; i < employees.length; i++) {

            if (employees[i].employeeManagerNum == manager) {
                EmployeesByManager.push(employees[i])
            };

        }

        if (EmployeesByManager.length == 0) {

            reject("No data")
        }

        resolve(EmployeesByManager);

    });
}



module.exports.getEmployeeByNum = function (num) {

    return new Promise(function (resolve, reject) {

        let returnedEmployee;

        for (i = 0; i < employees.length; i++) {

            if (employees[i].employeeNum == num) {
                returnedEmployee = employees[i];
            };

        }
        resolve(returnedEmployee);

    });
}



module.exports.updateEmployee = (employeeData) => {

    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise((resolve, reject) => {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == employeeData.employeeNum) {
                employees.splice(employeeData.employeeNum - 1, 1, employeeData);
            }

        }
        if (employees.length == 0) {
            reject("No Result Returned!!!");
        }
        resolve(employees);
    });
}