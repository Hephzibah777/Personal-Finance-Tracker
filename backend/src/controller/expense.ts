


import { Request, Response, NextFunction } from "express";
import db from "../config/db";
import { QueryTypes } from "sequelize";
import verifyToken from "../helper/verifyToken";
import expenseRepo from "../repositary/expense";


// Add Expense
async function addExpense(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
    const { amount, category, description } = req.body;
    const { userId } = verifyToken(req);
    const expense={
      amount:amount,
      category:category,
      description:description,
      userId:userId
    }
    expenseRepo.addExpense(expense, next);
    res.status(200).json({ message: "Successfully added the expense details" });
  } catch (error) {
    next(error);
  }
}

// Get Selected Expense
async function getSelectedExpense(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = verifyToken(req);

    const expense= await expenseRepo.getSelectedExpense(id, userId, next);

    if (expense.length === 0) {
     res.status(404).json({ error: "Expense not found" });
     return;
    }
    res.json(expense[0]);
  } catch (error) {
    next(error);
  }
}

//  Get All Expenses (Latest 5)
async function getAllExpense(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
    const { userId } = verifyToken(req);
    console.log(typeof userId);
    const expenses=await expenseRepo.getAllExpense(userId, next);

    res.json(expenses);
  } catch (error) {
    next(error);
  }
}

//  Delete Expense
async function deleteSelectedExpense(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
    const { id } = req.params;
    expenseRepo.deleteSelectedExpense(id, next);
    res.json({ message: "Successfully deleted the expense details" });
  } catch (error) {
    next(error);
  }
}

//  Update Expense
async function updateSelectedExpense(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = verifyToken(req);
    const body = {...req.body, userId:userId};

    if (Object.keys(body).length === 0) {
     res.status(400).json({ error: "At least one field is required to update" });
     return;
    }

   expenseRepo.updateSelectedExpense(id, body, next)
    res.json({ message: "Successfully updated the expense details" });
  } catch (error) {
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

export default expenseController;
