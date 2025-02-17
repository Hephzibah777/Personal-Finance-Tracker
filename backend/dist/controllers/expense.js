"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const sequelize_1 = require("sequelize");
async function addexpense(req, res) {
    try {
        const { amount, category, description } = req.body;
        const createdAt = new Date();
        const updatedAt = new Date();
        if (!amount || !category) {
            res.status(400).json({ error: "amount and category is missing" });
        }
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const expense = await db_1.default.sequelize.query(`INSERT INTO Expenses(userId, amount, category, description, createdAt, updatedAt) VALUES(:userId, :amount, :category, :description, :createdAt, :updatedAt)`, {
            replacements: { userId: userId, amount: amount, category: category, description: description, createdAt: createdAt, updatedAt: updatedAt },
            type: sequelize_1.QueryTypes.INSERT
        });
        res.status(200).json({ error: "Successfully added the expense details" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getselectedexpense(req, res) {
    try {
        const id = req.params.id;
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const expense = await db_1.default.sequelize.query(`SELECT * From Expenses where userId=:userId AND id=:id`, {
            replacements: { userId: userId, id: id },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(expense[0]);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getAllexpense(req, res) {
    try {
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const expense = await db_1.default.sequelize.query(`SELECT * From Expenses where userId=:userId`, {
            replacements: { userId: userId },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(expense);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function deleteselectedexpense(req, res) {
    try {
        const id = req.params.id;
        const expense = await db_1.default.sequelize.query(`DELETE FROM Expenses WHERE id=:id`, {
            replacements: { id: id },
            type: sequelize_1.QueryTypes.DELETE
        });
        res.status(200).json({ message: "Successfully deleted the expense details" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function updateselectedexpense(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;
        const updatedAt = new Date();
        let col = "";
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        Object.keys(body).forEach(key => {
            col = col + `${key}` + "=" + ":" + `${key}` + ",";
        });
        const query = `UPDATE Expenses SET ` + col + `updatedAt=:updatedAt WHERE id=:id AND userId=:userId`;
        console.log(query);
        const expense = await db_1.default.sequelize.query(query, {
            replacements: { ...body, updatedAt: updatedAt, id: id, userId: userId },
            type: sequelize_1.QueryTypes.UPDATE
        });
        res.status(200).json({ message: "Successfully updated the expense details" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}
const expenseController = {
    addexpense: addexpense,
    getAllexpense: getAllexpense,
    deleteselectedexpense: deleteselectedexpense,
    updateselectedexpense: updateselectedexpense,
    getselectedexpense: getselectedexpense
};
exports.default = expenseController;
