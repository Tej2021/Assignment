/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Tej Parekh Student ID: 144914207 Date: 8 march 2022
*
* Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/
const express = require("express");
const app = express();
const path = require("path");
const data_service = require("./data-service");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

app.engine(".hbs", exphbs({
  extname: ".hbs",
  defaultLayout: 'main',
  helpers: {
    navLink: function (url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set("view engine", ".hbs");

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {

    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.get("/", function (req, res) {
  res.render("home");
});



app.get("/about", function (req, res) {
  res.render("about");
});



app.get("/employees", function (req, res) {

  if (req.query.status) {

    data_service.getEmployeesByStatus(req.query.status).then(function (data) {
      res.render("employees", { employees: data });
    }).catch(function () {
      res.render({ message: "no results" });
    });
  }
  else if (req.query.department) {
    data_service.getEmployeesByDepartment(req.query.department).then(function (data) {
      res.render("employees", { employees: data });
    }).catch(function () {
      res.render({ message: "no results" });
    });
  }

  else if (req.query.manager) {
    data_service.getEmployeesByManager(req.query.manager).then(function (data) {
      res.render("employees", { employees: data });
    }).catch(function () {
      res.render({ message: "no results" });
    });
  }

  else {

    data_service.getAllEmployees().then(function (data) {
      res.render("employees", { employees: data });

    }).catch(function () {
      res.render({ message: "no results" });
    });

  }

});


app.get("/departments", function (req, res) {

  data_service.getDepartments().then(function (data) {
    res.render("departments", { departments: data });
  }).catch(function () {
    res.render({ message: "no results" });
  });
});



app.get("/employees/add", function (req, res) {
  res.render("addEmployee");
});



app.post("/employees/add", (req, res) => {
  data_service.addEmployee(req.body).then(function (data) {
    res.redirect("/employees");
  }).catch(function (err) {
    res.json({ message: err })
  })
});



app.get("/images/add", function (req, res) {
  res.render("addImage");
});



app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});



app.get("/images", (req, res) => {

  fs.readdir('./public/images/uploaded', (err, data) => {
    if (err) {
      console.log("Unable to read the file!");
    } else {
      
      res.render("images", { images: data })
    }
  })
});




app.get("/employee/:num", (req, res) => {
  data_service.getEmployeeByNum(req.params.num).then(function (data) {
    res.render("employee", { employee: data });
  }).catch(function (err) {
    res.render("employee", { message: "no results" });
  });
});



 app.post("/employee/update", (req, res) => {
  data_service.updateEmployee(req.body).then((data) => {
      console.log(req.body);
      res.redirect("/employees");
  }).catch((err) => {
      console.log(err);
  })
});
 

app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname + "/views/notFound.html"));

});


data_service.Initialize().then(() => {
  try {
    app.listen(HTTP_PORT, function () {
      console.log("Express http server listening on: " + HTTP_PORT);
    });
  } catch (err) {
    console.log("Error!");
  }
});



