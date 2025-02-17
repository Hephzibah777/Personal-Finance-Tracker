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

async function addemi(req: Request, res: Response): Promise<void> {
    try {
      const { amount, loanId, category, start_date, end_date } = req.body;
      if (!amount || !category || !start_date || !end_date || !loanId) {
        res.status(400).json({ error: "Content cannot be empty" });
      }
  
      const income=await db.sequelize.query(`INSERT INTO Incomes(amount, loanId, category, start_date, end_date) VALUES(:userId, :amount, :loanId, :catgory, :start_date, :end_date)`,{
          replacements:{amount:amount, loanId:loanId, category:category, start_date:start_date, end_date:end_date},
          type:QueryTypes.INSERT
      })
      res.status(200).json({error:"Successfully added the EMI details"});
  
    } catch (error) {
      res.status(500).json({error:"Internal Server Error"});
    }
  }

  async function getAllemi(req:Request, res:Response):Promise<void>{
    try{
        const emi=await db.sequelize.query(`SELECT * From Emis`);
    res.send(emi);
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}

async function deleteselectedemi(req:Request, res:Response):Promise<void>{
    try{
        const id=req.params.emiId;
        const income=await db.sequelize.query(`DELETE FROM Emis WHERE id=:id`,{
            replacements:{id:id},
            type:QueryTypes.DELETE
        })
        res.status(200).json({message:"Successfully deleted the emi details"});
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}

async function updateselectedemi(req:Request, res:Response):Promise<void>{
    try{
        const id=req.params.emiId;
        const body=req.body;
        let col="";
        Object.keys(body).forEach(key=>{
            col=col+`${key}`+"="+":"+`${key}`;
        })
        const query="UPDATE `Emis` SET " + col + "where id=:id";

        const emi=await db.sequelize.query(query,{
            replacements:{uid:id},
            type:QueryTypes.UPDATE
        })
        res.status(200).json({message:"Successfully updated the emi details"});
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}

const emiController={
    addemi:addemi,
    getAllemi:getAllemi,
    deleteselectedemi:deleteselectedemi,
    updateselectedemi:updateselectedemi
}

export default emiController;