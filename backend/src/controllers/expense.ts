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

async function addexpense(req:Request, res:Response):Promise<void>{
    try{
        const { amount, category, description } = req.body;
    const createdAt=new Date();
    const updatedAt=new Date();
    if (!amount || !category) {
      res.status(400).json({ error: "amount and category is missing" });
    }
    const rtoken = req.header("Authorization");
    const token = rtoken!.replace("Bearer ", "");
    const decoded = jwt.verify(token, "your_secret_key") as payloadType;
    const userId=decoded.userId;

    const expense=await db.sequelize.query(`INSERT INTO Expenses(userId, amount, category, description, createdAt, updatedAt) VALUES(:userId, :amount, :category, :description, :createdAt, :updatedAt)`,{
        replacements:{userId:userId, amount:amount, category:category, description:description,  createdAt:createdAt, updatedAt:updatedAt},
        type:QueryTypes.INSERT
    })
    res.status(200).json({error:"Successfully added the expense details"});
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"});
    }
}

async function getselectedexpense(req:Request, res:Response):Promise<void>{
    try{
        const id=req.params.id;
        const rtoken = req.header("Authorization");
    const token = rtoken!.replace("Bearer ", "");
    const decoded = jwt.verify(token, "your_secret_key") as payloadType;
    const userId=decoded.userId;
        const expense=await db.sequelize.query(`SELECT * From Expenses where userId=:userId AND id=:id`,{
            replacements:{userId:userId, id:id},
            type:QueryTypes.SELECT
        });
    res.send(expense[0]);
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}


async function getAllexpense(req:Request, res:Response):Promise<void>{
    try{
        const rtoken = req.header("Authorization");
    const token = rtoken!.replace("Bearer ", "");
    const decoded = jwt.verify(token, "your_secret_key") as payloadType;
    const userId=decoded.userId;
        const expense=await db.sequelize.query(`SELECT * From Expenses where userId=:userId ORDER BY createdAt DESC LIMIT 5`,{
            replacements:{userId:userId},
            type:QueryTypes.SELECT
        });
    res.send(expense);
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}

async function deleteselectedexpense(req:Request, res:Response):Promise<void>{
    try{
        const id=req.params.id;
        const expense=await db.sequelize.query(`DELETE FROM Expenses WHERE id=:id`,{
            replacements:{id:id},
            type:QueryTypes.DELETE
        })
        res.status(200).json({message:"Successfully deleted the expense details"});
    }
    catch(error){
        res.status(500).json({error:"Internal Server Error"}); 
    }
}

async function updateselectedexpense(req:Request, res:Response):Promise<void>{
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

        const query=`UPDATE Expenses SET ` + col + `updatedAt=:updatedAt WHERE id=:id AND userId=:userId`;
            console.log(query);
        const expense=await db.sequelize.query(query,{
            replacements:{...body, updatedAt:updatedAt, id:id, userId:userId},
            type:QueryTypes.UPDATE
        })
        res.status(200).json({message:"Successfully updated the expense details"});
    }
    catch(error){
        res.status(500).json(error); 
    }
}


const expenseController={
    addexpense:addexpense,
    getAllexpense:getAllexpense,
    deleteselectedexpense:deleteselectedexpense,
    updateselectedexpense:updateselectedexpense,
    getselectedexpense:getselectedexpense
}

export default expenseController;