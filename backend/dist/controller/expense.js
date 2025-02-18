"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifyToken_1 = __importDefault(require("../helper/verifyToken"));
const expense_1 = __importDefault(require("../repositary/expense"));
// Add Expense
async function addExpense(req, res, next) {
    try {
        const { amount, category, description } = req.body;
        const { userId } = (0, verifyToken_1.default)(req);
        const expense = {
            amount: amount,
            category: category,
            description: description,
            userId: userId
        };
        expense_1.default.addExpense(expense, next);
        res.status(200).json({ message: "Successfully added the expense details" });
    }
    catch (error) {
        next(error);
    }
}
// Get Selected Expense
async function getSelectedExpense(req, res, next) {
    try {
        const { id } = req.params;
        const { userId } = (0, verifyToken_1.default)(req);
        const expense = await expense_1.default.getSelectedExpense(id, userId, next);
        if (expense.length === 0) {
            res.status(404).json({ error: "Expense not found" });
            return;
        }
        res.json(expense[0]);
    }
    catch (error) {
        next(error);
    }
}
//  Get All Expenses (Latest 5)
async function getAllExpense(req, res, next) {
    try {
        const { userId } = (0, verifyToken_1.default)(req);
        console.log(typeof userId);
        const expenses = await expense_1.default.getAllExpense(userId, next);
        res.json(expenses);
    }
    catch (error) {
        next(error);
    }
}
//  Delete Expense
async function deleteSelectedExpense(req, res, next) {
    try {
        const { id } = req.params;
        expense_1.default.deleteSelectedExpense(id, next);
        res.json({ message: "Successfully deleted the expense details" });
    }
    catch (error) {
        next(error);
    }
}
//  Update Expense
async function updateSelectedExpense(req, res, next) {
    try {
        const { id } = req.params;
        const { userId } = (0, verifyToken_1.default)(req);
        const body = { ...req.body, userId: userId };
        if (Object.keys(body).length === 0) {
            res.status(400).json({ error: "At least one field is required to update" });
            return;
        }
        expense_1.default.updateSelectedExpense(id, body, next);
        res.json({ message: "Successfully updated the expense details" });
    }
    catch (error) {
        next(error);
    }
}
//  Export Controller
const expenseController = {
    addExpense,
    getAllExpense,
    deleteSelectedExpense,
    updateSelectedExpense,
    getSelectedExpense,
};
exports.default = expenseController;
