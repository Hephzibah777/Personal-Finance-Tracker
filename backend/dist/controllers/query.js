"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const sequelize_1 = require("sequelize");
async function totalincome(req, res) {
    try {
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const response = await db_1.default.sequelize.query('SELECT SUM(amount) income FROM `Incomes` where userId=:userId', {
            replacements: { userId: userId },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(response);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function totalexpense(req, res) {
    try {
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const response = await db_1.default.sequelize.query('SELECT SUM(amount) expense FROM `Expenses` where userId=:userId', {
            replacements: { userId: userId },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(response);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getByMonth(req, res) {
    try {
        const year = req.params.year;
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const response = await db_1.default.sequelize.query(`select sum(a.amount) incomes, sum(b.amount) expenses, monthname(a.createdAt) month  from Incomes a JOIN Expenses b where  year(a.createdAt)=:year AND a.userId=:userId group by month`, {
            replacements: { userId: userId, year: year },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(response);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getByCategory(req, res) {
    try {
        console.log("hello00000");
        const currentMonth = new Date().getMonth() + 1;
        console.log(currentMonth + "month");
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const response = await db_1.default.sequelize.query(`select SUM(amount)/(select SUM(amount) from Incomes)*100 percentage, category FROM Expenses where userId=:userId AND month(createdAt)=:month group by category ORDER BY percentage DESC LIMIT 3;`, {
            replacements: { userId: userId, month: currentMonth },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(response);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getdescincomes(req, res) {
    try {
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const month = new Date().getMonth() + 1;
        const response = await db_1.default.sequelize.query(`select description, amount from Incomes where userId=:userId AND month(createdAt)=:month order by amount DESC LIMIT 3;`, {
            replacements: { userId: userId, month: month },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(response);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getdescexpenses(req, res) {
    try {
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const month = new Date().getMonth() + 1;
        const response = await db_1.default.sequelize.query(`select category, amount from Expenses where userId=:userId AND month(createdAt)=:month order by amount DESC LIMIT 3;`, {
            replacements: { userId: userId, month: month },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(response);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getcategorypercentage(req, res) {
    try {
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const month = new Date().getMonth() + 1;
        const response = await db_1.default.sequelize.query(`Select SUM(amount)/(Select SUM(amount) FROM Incomes where userId=:userId and month(createdAt)=:month)*100 percentage FROM Expenses where userId=:userId and month(createdAt)=:month`, {
            replacements: { userId: userId, month: month },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(response);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const queryController = {
    totalincome: totalincome,
    totalexpense: totalexpense,
    getByMonth: getByMonth,
    getByCategory: getByCategory,
    getdescincomes: getdescincomes,
    getdescexpenses: getdescexpenses,
    getcategorypercentage: getcategorypercentage
};
exports.default = queryController;
