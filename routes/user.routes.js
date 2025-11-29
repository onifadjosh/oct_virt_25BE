const express = require("express");

const { registerPage, register, deleteUser, editUserPage, editUser, displayUser, login, verifyToken } = require("../controllers/user.controller");

const router = express.Router();

router.get("/register", registerPage);

router.post("/register", register);

router.post("/delete/:id", deleteUser);

router.get("/edit/:id", editUserPage);

router.post("/edit/:id", editUser);

router.get("/displayUser",verifyToken,displayUser);
router.post("/login", login);


module.exports= router;
