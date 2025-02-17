import { Request, Response } from "express";
import db from "../config/db";
import { QueryTypes } from "sequelize";

async function addcategory(req: Request, res: Response): Promise<void> {
  try {
    const {name}= req.body;
    console.log(name);
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
    res.status(500).json(error);
  }
}

async function getAllcategory(req: Request, res: Response): Promise<void> {
  try {
   
    const categories = await db.sequelize.query(`SELECT * From Categories`, {
      type: QueryTypes.SELECT,
    });
    res.send(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const categoryController = {
  addcategory: addcategory,
  getAllcategory: getAllcategory,
};

export default categoryController;
