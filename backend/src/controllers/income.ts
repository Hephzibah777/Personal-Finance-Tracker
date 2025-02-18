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
async function addincome(req: Request, res: Response): Promise<void> {
  try {
    const { amount, description } = req.body;
    const createdAt=new Date();
    const updatedAt=new Date();
    if (!amount || !description) {
      res.status(400).json({ error: "amount and description is missing" });
    }
    const rtoken = req.header("Authorization");
    const token = rtoken!.replace("Bearer ", "");
    const decoded = jwt.verify(token, "your_secret_key") as payloadType;
    const userId=decoded.userId;

    const income=await db.sequelize.query(`INSERT INTO Incomes(userId, amount, description, createdAt, updatedAt) VALUES(:userId, :amount, :description, :createdAt, :updatedAt)`,{
        replacements:{userId:userId, amount:amount, description:description, createdAt:createdAt, updatedAt:updatedAt},
        type:QueryTypes.INSERT
    })
    res.status(200).json({error:"Successfully added the income details"});

  } catch (error) {
    res.status(500).json({error:"Internal Server Error"});
  }
}

async function getAllincome(req:Request, res:Response):Promise<void>{
    try{
        const rtoken = req.header("Authorization");
    const token = rtoken!.replace("Bearer ", "");
    const decoded = jwt.verify(token, "your_secret_key") as payloadType;
    const userId=decoded.userId;
        const income=await db.sequelize.query(`SELECT * From Incomes where userId=:userId ORDER BY createdAt DESC LIMIT 5`,{
            replacements:{userId:userId},
            type:QueryTypes.SELECT
        });
    res.send(income);
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}

async function getselectedincome(req:Request, res:Response):Promise<void>{
    try{
        const id=req.params.id;
        const rtoken = req.header("Authorization");
    const token = rtoken!.replace("Bearer ", "");
    const decoded = jwt.verify(token, "your_secret_key") as payloadType;
    const userId=decoded.userId;
        const income=await db.sequelize.query(`SELECT * From Incomes where userId=:userId AND id=:id `,{
            replacements:{userId:userId, id:id},
            type:QueryTypes.SELECT
        });
    res.send(income[0]);
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}
async function deleteselectedincome(req:Request, res:Response):Promise<void>{
    try{
        const id=req.params.id;
        const rtoken = req.header("Authorization");
        const token = rtoken!.replace("Bearer ", "");
        const decoded = jwt.verify(token, "your_secret_key") as payloadType;
        const userId=decoded.userId;
        const income=await db.sequelize.query(`DELETE FROM Incomes WHERE id=:id AND userId=:userId `,{
            replacements:{id:id, userId:userId},
            type:QueryTypes.DELETE
        })
        res.status(200).json({message:"Successfully deleted the income details"});
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}

async function updateselectedincome(req:Request, res:Response):Promise<void>{
    try{
        const id=req.params.id;
        const body=req.body;
        const updatedAt=new Date();
        let col="";
        const rtoken = req.header("Authorization");
    const token = rtoken!.replace("Bearer ", "");
    const decoded = jwt.verify(token, "your_secret_key") as payloadType;
    const userId=decoded.userId;

        Object.keys(body).forEach(key=>{
            col=col+`${key}`+"="+":"+`${key}`+",";
        })
        const query=`UPDATE Incomes SET` +` `+ col + `updatedAt=:updatedAt where id=:id AND userId=:userId`;

        const income=await db.sequelize.query(query,{
            replacements:{...body, updatedAt:updatedAt, id:id, userId:userId},
            type:QueryTypes.UPDATE
        })
       
        res.status(200).json({message:"Successfully updated the income details"});
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}

const incomeController={
    getselectedincome:getselectedincome,
    addincome:addincome,
    getAllincome:getAllincome,
    deleteselectedincome:deleteselectedincome,
    updateselectedincome:updateselectedincome,
}

export default incomeController;
