"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_validator_1 = __importDefault(require("email-validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../config/db"));
const sequelize_1 = require("sequelize");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = "your_secret_key";
async function adduser(req, res) {
    try {
        const { username, firstname, lastname, email, password } = req.body;
        const hashedpassword = await bcrypt_1.default.hash(password, 10);
        const createdAt = new Date();
        const updatedAt = new Date();
        if (!username) {
            res.status(400).json({ error: "Username is required" });
            return;
        }
        if (!email) {
            res.status(400).json({ error: "Email is required" });
            return;
        }
        if (!password) {
            res.status(400).json({ error: "Password is required" });
            return;
        }
        const isValid = email_validator_1.default.validate(email);
        if (!isValid) {
            res.status(400).json({ error: "Email is not valid" });
            return;
        }
        const checkuser = await db_1.default.sequelize.query(`SELECT * from Users where email=:email`, {
            replacements: { email: email },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (checkuser.length != 0) {
            res.status(409).json({ error: "User already exists" });
            return;
        }
        const user = db_1.default.sequelize.query(`INSERT INTO Users(username, firstname, lastname, email, password, createdAt, updatedAt) VALUES(:username, :firstname, :lastname, :email, :password, :createdAt, :updatedAt)`, {
            replacements: { username: username, firstname: firstname, lastname: lastname, email: email, password: hashedpassword, createdAt: createdAt, updatedAt: updatedAt },
            type: sequelize_1.QueryTypes.INSERT
        });
        res.status(200).json({ message: "Users Successfully Added" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password cannot be empty" });
            return;
        }
        const user = await db_1.default.sequelize.query(`SELECT * from Users where email=:email`, {
            replacements: { email: email },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (user.length == 0) {
            res.status(400).json({ error: "User does not exist" });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user[0].password);
        if (!isPasswordValid) {
            res.status(400).send("Invalid credentials.");
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user[0].id, username: user[0].username, email: user[0].email }, secretKey, {
            expiresIn: "1h",
        });
        res.send({ token: token });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
async function getAllusers(req, res) {
    try {
        const users = db_1.default.sequelize.query('SELECT * FROM Users');
        res.send(users);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
async function getselecteduser(req, res) {
    try {
        const id = req.params.userId;
        const user = db_1.default.sequelize.query('SELECT * FROM Users where id=:id', {
            replacements: { id: id },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
async function updateselecteduser(req, res) {
    try {
        const id = req.params.userId;
        const body = req.body;
        const updatedAt = new Date();
        let col = "";
        Object.keys(body).forEach(key => {
            col = col + `${key}` + "=" + ":" + `${key}` + ",";
        });
        const query = "UPDATE `Users` SET " + col + "updatedAt=:updatedAt";
        const result = await db_1.default.sequelize.query(query, {
            replacements: { updatedAt: updatedAt },
            type: sequelize_1.QueryTypes.UPDATE
        });
        res.status(200).json({ message: "Successfully Updated the user details" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
async function logout(req, res) {
    console.log("hello");
    res.clearCookie("authToken", {
        path: "/",
        secure: true,
        sameSite: "strict"
    });
    console.log("hello");
    res.status(200).json({ message: "Logged out successfully" });
}
const userController = {
    adduser: adduser,
    login: login,
    getAllusers: getAllusers,
    getselecteduser: getselecteduser,
    updateselecteduser: updateselecteduser,
    logout: logout
};
exports.default = userController;
