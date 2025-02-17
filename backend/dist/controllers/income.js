"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const sequelize_1 = require("sequelize");
async function addincome(req, res) {
    try {
        const { amount, description } = req.body;
        const createdAt = new Date();
        const updatedAt = new Date();
        if (!amount || !description) {
            res.status(400).json({ error: "amount and description is missing" });
        }
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const income = await db_1.default.sequelize.query(`INSERT INTO Incomes(userId, amount, description, createdAt, updatedAt) VALUES(:userId, :amount, :description, :createdAt, :updatedAt)`, {
            replacements: { userId: userId, amount: amount, description: description, createdAt: createdAt, updatedAt: updatedAt },
            type: sequelize_1.QueryTypes.INSERT
        });
        res.status(200).json({ error: "Successfully added the income details" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getAllincome(req, res) {
    try {
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const income = await db_1.default.sequelize.query(`SELECT * From Incomes where userId=:userId`, {
            replacements: { userId: userId },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(income);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getselectedincome(req, res) {
    try {
        const id = req.params.id;
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const income = await db_1.default.sequelize.query(`SELECT * From Incomes where userId=:userId AND id=:id`, {
            replacements: { userId: userId, id: id },
            type: sequelize_1.QueryTypes.SELECT
        });
        res.send(income[0]);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function deleteselectedincome(req, res) {
    try {
        const id = req.params.id;
        const rtoken = req.header("Authorization");
        const token = rtoken.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const income = await db_1.default.sequelize.query(`DELETE FROM Incomes WHERE id=:id AND userId=:userId`, {
            replacements: { id: id, userId: userId },
            type: sequelize_1.QueryTypes.DELETE
        });
        res.status(200).json({ message: "Successfully deleted the income details" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function updateselectedincome(req, res) {
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
        const query = `UPDATE Incomes SET` + ` ` + col + `updatedAt=:updatedAt where id=:id AND userId=:userId`;
        const income = await db_1.default.sequelize.query(query, {
            replacements: { ...body, updatedAt: updatedAt, id: id, userId: userId },
            type: sequelize_1.QueryTypes.UPDATE
        });
        res.status(200).json({ message: "Successfully updated the income details" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const incomeController = {
    getselectedincome: getselectedincome,
    addincome: addincome,
    getAllincome: getAllincome,
    deleteselectedincome: deleteselectedincome,
    updateselectedincome: updateselectedincome,
};
exports.default = incomeController;
