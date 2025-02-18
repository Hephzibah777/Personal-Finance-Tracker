


import { Request, Response, NextFunction } from "express";
import db from "../config/db";
import { QueryTypes } from "sequelize";
import verifyToken from "../helper/verifyToken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const l= process.env.JWT
// Add Income
async function addIncome(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { amount, description } = req.body;
    if (!amount || !description) {
      res.status(400).json({ error: "Amount and description are required" });
      return;
    }

    const { userId } = verifyToken(req);
    const timestamp = new Date();

    await db.sequelize.query(
      `INSERT INTO Incomes (userId, amount, description, createdAt, updatedAt) 
       VALUES (:userId, :amount, :description, :createdAt, :updatedAt)`,
      {
        replacements: { userId, amount, description, createdAt: timestamp, updatedAt: timestamp },
        type: QueryTypes.INSERT,
      }
    );

    res.status(201).json({ message: "Income added successfully" });
  } catch (error) {
    next(error);
  }
}

// Get All Income
async function getAllIncome(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    console.log(l);
    const { userId } = verifyToken(req);
    const income = await db.sequelize.query(
      `SELECT * FROM Incomes WHERE userId = :userId ORDER BY createdAt DESC LIMIT 5`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json(income);
  } catch (error) {
    next(error);
  }
}

// Get Selected Income
async function getSelectedIncome(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = verifyToken(req);

    const income = await db.sequelize.query(
      `SELECT * FROM Incomes WHERE userId = :userId AND id = :id`,
      {
        replacements: { userId, id },
        type: QueryTypes.SELECT,
      }
    );

    if (!income.length) {
      res.status(404).json({ error: "Income not found" });
      return;
    }

    res.status(200).json(income[0]);
  } catch (error) {
    next(error);
  }
}

// Delete Selected Income
async function deleteSelectedIncome(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = verifyToken(req);

    const result = await db.sequelize.query(
      `DELETE FROM Incomes WHERE id = :id AND userId = :userId`,
      {
        replacements: { id, userId },
        type: QueryTypes.DELETE,
      }
    );

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    next(error);
  }
}

// Update Selected Income
async function updateSelectedIncome(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = verifyToken(req);
    const body = req.body;
    const updatedAt = new Date();

    if (Object.keys(body).length === 0) {
      res.status(400).json({ error: "No fields provided for update" });
      return;
    }

    const updateFields = Object.keys(body)
      .map((key) => `${key} = :${key}`)
      .join(", ");

    const query = `UPDATE Incomes SET ${updateFields}, updatedAt = :updatedAt WHERE id = :id AND userId = :userId`;

    await db.sequelize.query(query, {
      replacements: { ...body, updatedAt, id, userId },
      type: QueryTypes.UPDATE,
    });

    res.status(201).json({ message: "Income updated successfully" });
  } catch (error) {
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

export default incomeController;
