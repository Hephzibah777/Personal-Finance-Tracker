


import { Request, Response, NextFunction } from "express";
import db from "../config/db";
import { QueryTypes } from "sequelize";
import verifyToken from "../helper/verifyToken";
import dotenv from "dotenv";
import incomeRepo from "../repositary/income";
import expenseRepo from "../repositary/expense";

// Load environment variables
dotenv.config();

// Add Income
async function addIncome(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { amount, description } = req.body;
    const { userId } = verifyToken(req);
    incomeRepo.addIncome(amount, description, userId, next);
   
    res.status(201).json({ message: "Income added successfully" });
  } catch (error) {
    next(error);
  }
}

// Get All Income
async function getAllIncome(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = verifyToken(req);
   const income=await incomeRepo.getAllIncome(userId, next);

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

   const income=await incomeRepo.getSelectedIncome(id, userId, next);

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

    incomeRepo.deleteSelectedIncome(id, userId,next);

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
    

  incomeRepo.updateSelectedIncome(id,userId,body,next);

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
