"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifyToken_1 = __importDefault(require("../helper/verifyToken"));
const dotenv_1 = __importDefault(require("dotenv"));
const income_1 = __importDefault(require("../repositary/income"));
// Load environment variables
dotenv_1.default.config();
// Add Income
async function addIncome(req, res, next) {
    try {
        const { amount, description } = req.body;
        const { userId } = (0, verifyToken_1.default)(req);
        income_1.default.addIncome(amount, description, userId, next);
        res.status(201).json({ message: "Income added successfully" });
    }
    catch (error) {
        next(error);
    }
}
// Get All Income
async function getAllIncome(req, res, next) {
    try {
        const { userId } = (0, verifyToken_1.default)(req);
        const income = await income_1.default.getAllIncome(userId, next);
        res.status(200).json(income);
    }
    catch (error) {
        next(error);
    }
}
// Get Selected Income
async function getSelectedIncome(req, res, next) {
    try {
        const { id } = req.params;
        const { userId } = (0, verifyToken_1.default)(req);
        const income = await income_1.default.getSelectedIncome(id, userId, next);
        if (!income.length) {
            res.status(404).json({ error: "Income not found" });
            return;
        }
        res.status(200).json(income[0]);
    }
    catch (error) {
        next(error);
    }
}
// Delete Selected Income
async function deleteSelectedIncome(req, res, next) {
    try {
        const { id } = req.params;
        const { userId } = (0, verifyToken_1.default)(req);
        income_1.default.deleteSelectedIncome(id, userId, next);
        res.status(200).json({ message: "Income deleted successfully" });
    }
    catch (error) {
        next(error);
    }
}
// Update Selected Income
async function updateSelectedIncome(req, res, next) {
    try {
        const { id } = req.params;
        const { userId } = (0, verifyToken_1.default)(req);
        const body = req.body;
        income_1.default.updateSelectedIncome(id, userId, body, next);
        res.status(201).json({ message: "Income updated successfully" });
    }
    catch (error) {
        next(error);
    }
}
const incomeController = {
    addIncome,
    getAllIncome,
    getSelectedIncome,
    deleteSelectedIncome,
    updateSelectedIncome,
};
exports.default = incomeController;
