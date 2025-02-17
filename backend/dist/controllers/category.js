"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const sequelize_1 = require("sequelize");
async function addcategory(req, res) {
    try {
        const { name } = req.body;
        console.log(name);
        if (!name) {
            res.status(400).json({ error: "category is missing" });
        }
        const category = await db_1.default.sequelize.query(`INSERT INTO Categories(name) VALUES(:name)`, {
            replacements: { name: name },
            type: sequelize_1.QueryTypes.INSERT,
        });
        res.status(200).json({ message: "Successfully added" });
    }
    catch (error) {
        res.status(500).json(error);
    }
}
async function getAllcategory(req, res) {
    try {
        const categories = await db_1.default.sequelize.query(`SELECT * From Categories`, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.send(categories);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const categoryController = {
    addcategory: addcategory,
    getAllcategory: getAllcategory,
};
exports.default = categoryController;
