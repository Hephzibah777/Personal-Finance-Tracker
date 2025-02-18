

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import db from "../config/db";
import { QueryTypes } from "sequelize";

interface PayloadType {
  userId: number;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

const SECRET_KEY = "your_secret_key";

// Helper function to extract and verify JWT token
const verifyToken = (req: Request): PayloadType => {
  const rtoken = req.header("Authorization");
  if (!rtoken) {
    throw { status: 401, message: "Authorization token is required" };
  }

  const token = rtoken.replace("Bearer ", "");
  return jwt.verify(token, SECRET_KEY) as PayloadType;
};

// ✅ Add Expense
async function addExpense(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
    const { amount, category, description } = req.body;
    if (!amount || !category) {
        return next(new Error('Amount and Category are required'));
    }

    const { userId } = verifyToken(req);
    const createdAt = new Date();
    const updatedAt = new Date();

    await db.sequelize.query(
      `INSERT INTO Expenses (userId, amount, category, description, createdAt, updatedAt) 
       VALUES (:userId, :amount, :category, :description, :createdAt, :updatedAt)`,
      {
        replacements: { userId, amount, category, description, createdAt, updatedAt },
        type: QueryTypes.INSERT,
      }
    );

    res.status(200).json({ message: "Successfully added the expense details" });
  } catch (error) {
    next(error);
  }
}

// ✅ Get Selected Expense
async function getSelectedExpense(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = verifyToken(req);

    const expense = await db.sequelize.query(
      `SELECT * FROM Expenses WHERE userId = :userId AND id = :id`,
      {
        replacements: { userId, id },
        type: QueryTypes.SELECT,
      }
    );

    if (expense.length === 0) {
     res.status(404).json({ error: "Expense not found" });
     return;
    }

    res.json(expense[0]);
  } catch (error) {
    next(error);
  }
}

// ✅ Get All Expenses (Latest 5)
async function getAllExpense(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
    const { userId } = verifyToken(req);

    const expenses = await db.sequelize.query(
      `SELECT * FROM Expenses WHERE userId = :userId ORDER BY createdAt DESC LIMIT 5`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      }
    );

    res.json(expenses);
  } catch (error) {
    next(error);
  }
}

// ✅ Delete Expense
async function deleteSelectedExpense(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
    const { id } = req.params;
    
    const result = await db.sequelize.query(
      `DELETE FROM Expenses WHERE id = :id`,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );


    res.json({ message: "Successfully deleted the expense details" });
  } catch (error) {
    next(error);
  }
}

// ✅ Update Expense
async function updateSelectedExpense(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedAt = new Date();
    const { userId } = verifyToken(req);

    if (Object.keys(body).length === 0) {
     res.status(400).json({ error: "At least one field is required to update" });
     return;
    }

    let setClauses = Object.keys(body)
      .map((key) => `${key} = :${key}`)
      .join(", ");

    const query = `UPDATE Expenses SET ${setClauses}, updatedAt = :updatedAt WHERE id = :id AND userId = :userId`;

    const result = await db.sequelize.query(query, {
      replacements: { ...body, updatedAt, id, userId },
      type: QueryTypes.UPDATE,
    });

    if (!result) {
      res.status(404).json({ error: "Expense not found or no changes made" });
      return;
    }

    res.json({ message: "Successfully updated the expense details" });
  } catch (error) {
    next(error);
  }
}

// ✅ Export Controller
const expenseController = {
  addExpense,
  getAllExpense,
  deleteSelectedExpense,
  updateSelectedExpense,
  getSelectedExpense,
};

export default expenseController;
