import { Request, Response, NextFunction } from "express";
import db from "../config/db";
import { QueryTypes } from "sequelize";

async function addCategory(req: Request, res: Response, next:NextFunction): Promise<void> {
  try {
    const {name}= req.body;
    if (!name) {
      res.status(400).json({ error: "category is missing" });
    }
    const category = await db.sequelize.query(
      `INSERT INTO Categories(name) VALUES(:name)`,{
        replacements: { name: name },
        type: QueryTypes.INSERT,
      });
      res.status(200).json({message:"Successfully added"})
  } catch (error) {
    next(error);
  }
}

async function getAllCategory(req: Request, res: Response, next:NextFunction): Promise<void> {
  try {
   
    const categories = await db.sequelize.query(`SELECT * From Categories`, {
      type: QueryTypes.SELECT,
    });
    res.send(categories);
  } catch (error) {
    next(error);
  }
}

const categoryController = {
  addCategory: addCategory,
  getAllCategory: getAllCategory,
};

export default categoryController;
