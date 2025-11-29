const express = require("express");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model.js");
const jwt = require("jsonwebtoken");
const dotenv= require('dotenv')
dotenv.config()
const nodemailer = require("nodemailer");



let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});




const registerPage = (req, res) => {
  let message = "";
  res.render("register", { message });
};

const register = async (req, res) => {
  // console.log(req.body)
  try {
    const { fullname, email, password, country, course, hobby } = req.body;
    // loggedUser.push(req.body)
    // console.log(loggedUser)
    let saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    let hashedPassword = await bcrypt.hash(password, salt);
    let user = await UserModel.create({
      fullname,
      email,
      password: hashedPassword,
      country,
      course,
      hobby,
    });
    let message = "User Registered Successfully";
    // res.render('register', {message})
    res.send({
      status: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        country: user.country,
      },
      message,
    });
  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      res.send({ status: false, message: "User already registered" });
    } else {
      res.send({
        status: false,
        message: "user not registered at this moment",
      });
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      res.send({ status: false, message: "invalid credentials" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.send({ status: false, message: "invalid credentials" });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.send({
          status: true,
          user: {
            fullname: user.fullname,
            email: user.email,
            country: user.country,
            token,
          },
          message: "user can now log in",
        });

        let mailOptions = {
          from: process.env.MAIL_USER,
          to: ['onifadjosh@gmail.com', "oladiranolamilekan@gmail.com"],
          subject: 'Welcome to class',
          text: 'That was easy! 🥳'
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "invalid credentials" });
  }
};

const deleteUser = async (req, res) => {
  try {
    // const id = req.params.id
    const { id } = req.params;
    // console.log(id);
    // loggedUser.splice(id, 1);

    let user = await UserModel.findByIdAndDelete({ _id: id });
    // res.render("displayUser", { loggedUser });
    res
      .status(200)
      .json({ status: true, message: "user deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "user deletion failed" });
  }
};

const editUserPage = (req, res) => {
  const { id } = req.params;
  console.log(id);
  // res.redirect(`/edit/${id}`)
  res.render("editUser");
};

const editUser = (req, res) => {
  const { id } = req.params;
  const { fullname, country, course, hobby } = req.body;
  loggedUser.splice(id, 1, req.body);
  res.render("displayUser", { loggedUser });
};

const displayUser = async (req, res) => {
  // console.log(`the user  ${req.user.id}`)
  
  try {
    console.log(req.user.id);
    
    const person =await UserModel.findById({_id:req.user.id})
    console.log(person.isAdmin)
    if(!person.isAdmin){
      res.send({
        status: false,
        message: "User cannot make this request",
      });
    }else{

      let user = await UserModel.find();
      res.send({ status: true, user });
    }
    // res.render("displayUser", { loggedUser });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: "User cannot be fetched at this moment",
    });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1]
      ? req.headers["authorization"].split(" ")[1]
      : req.headers["authorization"].split(" ")[0];

      console.log(token)

    const user = jwt.verify(
      token,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) {
          res.json({
            status: false,
            message: "User unauthorized!",
          });
        } else {
          console.log(decoded.id);
          req.user={id:decoded.id}

          next();
        }
      }
    );
  } catch (error) {
    res.json({
      status: false,
      message: "User unauthorized!",
    });
  }
};

module.exports = {
  registerPage,
  register,
  deleteUser,
  editUserPage,
  editUser,
  displayUser,
  login,
  verifyToken
};
