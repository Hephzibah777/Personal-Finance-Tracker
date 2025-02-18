import { Request, Response, NextFunction } from "express";
import db from "../config/db";
import { QueryTypes } from "sequelize";
import incomeModalType from "../type/incomeModalType";
import incomeType from "../type/incomeType";
import CustomError from "../middleware/CustomError";


async function addIncome(amount:string, description:string, userId:number, next: NextFunction): Promise<void> {
    try {
        if (!amount || !description) {
            return next(new Error('Amount and Description are required'));
        }
      const timestamp = new Date();
      await db.sequelize.query(
        `INSERT INTO Incomes (userId, amount, description, createdAt, updatedAt) 
         VALUES (:userId, :amount, :description, :createdAt, :updatedAt)`,
        {
          replacements: { userId, amount, description, createdAt: timestamp, updatedAt: timestamp },
          type: QueryTypes.INSERT,
        }
      );
  
    } catch (error) {
      next(error);
    }
  }

  // Get All Income
async function getAllIncome(userId:number, next: NextFunction): Promise<incomeModalType[]> {
    try {
      const income = await db.sequelize.query(
        `SELECT * FROM Incomes WHERE userId = :userId ORDER BY createdAt DESC LIMIT 5`,
        {
          replacements: { userId },
          type: QueryTypes.SELECT,
        }
      );
      return income as incomeModalType[];
    } catch (error) {
      next(error);
      return [];
    }
  }

  // Get Selected Income
async function getSelectedIncome(id:string, userId:number, next: NextFunction): Promise<incomeModalType[]> {
    try {
  
      const income = await db.sequelize.query(
        `SELECT * FROM Incomes WHERE userId = :userId AND id = :id`,
        {
          replacements: { userId, id },
          type: QueryTypes.SELECT,
        }
      );
  
     return income as incomeModalType[];
    } catch (error) {
      next(error);
      return [];
    }
  }

  // Delete Selected Income
async function deleteSelectedIncome(id:string, userId:number, next: NextFunction): Promise<void> {
    try {
  
      const result = await db.sequelize.query(
        `DELETE FROM Incomes WHERE id = :id AND userId = :userId`,
        {
          replacements: { id, userId },
          type: QueryTypes.DELETE,
        }
      );
    } catch (error) {
      next(error);
    }
  }

// Update Selected Income
async function updateSelectedIncome(id:string, userId:number, body:incomeType, next: NextFunction): Promise<void> {
    try {
      const updatedAt = new Date();
      if (Object.keys(body).length === 0) {
        return next(new CustomError('No fields provided for update', 400));
      }
  
      const updateFields = Object.keys(body)
        .map((key) => `${key} = :${key}`)
        .join(", ");
  
      const query = `UPDATE Incomes SET ${updateFields}, updatedAt = :updatedAt WHERE id = :id AND userId = :userId`;
  
      await db.sequelize.query(query, {
        replacements: { ...body, updatedAt, id, userId },
        type: QueryTypes.UPDATE,
      });
  
      
    } catch (error) {
      next(error);
    }
  }
  

  const incomeRepo={
    addIncome:addIncome,
    getAllIncome:getAllIncome,
    getSelectedIncome:getSelectedIncome,
    deleteSelectedIncome:deleteSelectedIncome,
    updateSelectedIncome:updateSelectedIncome
  }

  export default incomeRepo;