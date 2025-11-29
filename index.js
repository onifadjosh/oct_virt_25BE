const express = require("express");
const app = express();
const cors = require('cors')
const bcrypt = require("bcryptjs")
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const dotenv = require("dotenv")
dotenv.config()
app.use(cors())

const UserRouter = require('./routes/user.routes.js')
app.use('/user', UserRouter)

let mongoose = require("mongoose");

let URI =process.env.DATABASE_URI;

mongoose
  .connect(URI)
  .then(console.log("Database connected successfully"))
  .catch((err) => {
    console.log("error connecting to database", err);
  });

//Create, Read, Update, Delete

const UserModel = require('./models/User.model.js')

let user = [
  {
    fullname: "Pamilerin Pamilerin",
    course: "Software",
    Address: "USA",
  },

  {
    fullname: "Mrs Inioluwa",
    course: "Software",
    Address: "Somalia",
  },

  {
    fullname: "Matthew",
    course: "Software",
    Address: "Canada",
  },

  {
    fullname: "Dare",
    course: "Software",
    Address: "USA",
  },

  {
    fullname: "Passion",
    course: "Software",
    Address: "Nigeria",
  },

  {
    fullname: "Clement",
    course: "Software",
    Address: "USA",
  },
  {
    fullname: "Tolulope",
    course: "Software",
    Address: "USA",
  },
];

let loggedUser = [];

// app.get(path, callback)
app.get("/", (req, res) => {
  // res.send('Application working perfectly')
  // res.send(2+3+6+9)
  // res.send(user)

  let pathOfFile = __dirname;

  // console.log(pathOfFile+'/index.html')
  // res.sendFile(pathOfFile+'/index.html')
  res.sendFile(pathOfFile + "/omo.jpg");
});

//artist name, album name, album year, artcover, number of fans etc...

app.get("/index", (req, res) => {
  let gender = "male";
  res.render("index", { gender, user });
});


//creating our own backend server
// app.listen(port, callback)
let port = 5005;
app.listen(port, (err) => {
  if (err) {
    console.log("cannot start server at this time");
  } else {
    console.log(`server started on port ${port}`);
  }
});
