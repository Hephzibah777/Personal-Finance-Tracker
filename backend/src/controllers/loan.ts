import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import db from "../config/db";
import { QueryTypes } from "sequelize";

interface payloadType {
    userId: number;
    username:string,
    email: string;
    iat: number;
    exp: number;
  }

  async function addloan(req:Request, res:Response):Promise<void>{
    try{
        const { amount, category, start_date, end_date } = req.body;
    if (!amount || !category || !start_date || !end_date) {
      res.status(400).json({ error: "amount and category is missing" });
    }
    const rtoken = req.header("Authorization");
    const token = rtoken!.replace("Bearer ", "");
    const decoded = jwt.verify(token, "your_secret_key") as payloadType;
    const userId=decoded.userId;

    const expense=await db.sequelize.query(`INSERT INTO Expenses(userId, amount, category, start_date, end_date) VALUES(:userId, :amount, :category, :start_date, :end_date)`,{
        replacements:{userId:userId, amount:amount, category:category, start_date:start_date, end_date:end_date},
        type:QueryTypes.INSERT
    })
    res.status(200).json({error:"Successfully added the loan details"});
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"});
    }
}

async function deleteselectedloan(req:Request, res:Response):Promise<void>{
    try{
        const id=req.params.loanId;
        const loan=await db.sequelize.query(`DELETE FROM Loan WHERE id=:id`,{
            replacements:{id:id},
            type:QueryTypes.DELETE
        })
        res.status(200).json({message:"Successfully deleted the loan details"});
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}

async function getAllloan(req:Request, res:Response):Promise<void>{
    try{
        const rtoken = req.header("Authorization");
    const token = rtoken!.replace("Bearer ", "");
    const decoded = jwt.verify(token, "your_secret_key") as payloadType;
    const userId=decoded.userId;
        const loan=await db.sequelize.query(`SELECT * From Loans where userId=:userId`,{
            replacements:{userId:userId},
            type:QueryTypes.SELECT
        });
    res.send(loan);
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}
const loanController={
    addloan:addloan,
    deleteselectedloan:deleteselectedloan,
    getAllloan:getAllloan
}

export default loanController;