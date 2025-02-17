import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import db from "../config/db";
import { QueryTypes, Sequelize } from "sequelize";
interface payloadType {
    userId: number;
    username:string,
    email: string;
    iat: number;
    exp: number;
  }

async function totalincome(req: Request, res: Response): Promise<void> {
    try {
      const rtoken = req.header("Authorization");
      const token = rtoken!.replace("Bearer ", "");
      const decoded = jwt.verify(token, "your_secret_key") as payloadType;
      const userId=decoded.userId;
    
      const response=await db.sequelize.query('SELECT SUM(amount) income FROM `Incomes` where userId=:userId',{
        replacements:{userId:userId},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      res.status(500).json({error:"Internal Server Error"});
    }
  }

  async function totalexpense(req: Request, res: Response): Promise<void> {
    try {
      const rtoken = req.header("Authorization");
      const token = rtoken!.replace("Bearer ", "");
      const decoded = jwt.verify(token, "your_secret_key") as payloadType;
      const userId=decoded.userId;
    
      const response=await db.sequelize.query('SELECT SUM(amount) expense FROM `Expenses` where userId=:userId',{
        replacements:{userId:userId},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      res.status(500).json({error:"Internal Server Error"});
    }
  }

  async function getByMonth(req: Request, res: Response): Promise<void> {
    try {
        const year=req.params.year;
      const rtoken = req.header("Authorization");
      const token = rtoken!.replace("Bearer ", "");
      const decoded = jwt.verify(token, "your_secret_key") as payloadType;
      const userId=decoded.userId;
    
      const response=await db.sequelize.query(`select sum(a.amount) incomes, sum(b.amount) expenses, monthname(a.createdAt) month  from Incomes a JOIN Expenses b where  year(a.createdAt)=:year AND a.userId=:userId group by month`,{
        replacements:{userId:userId, year:year},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      res.status(500).json({error:"Internal Server Error"});
    }
  }

  async function getByCategory(req: Request, res: Response): Promise<void> {
    try {
        console.log("hello00000");
        const currentMonth=new Date().getMonth()+1;
        console.log(currentMonth + "month");
      const rtoken = req.header("Authorization");
      const token = rtoken!.replace("Bearer ", "");
      const decoded = jwt.verify(token, "your_secret_key") as payloadType;
      const userId=decoded.userId;
    
      const response=await db.sequelize.query(`select SUM(amount)/(select SUM(amount) from Incomes)*100 percentage, category FROM Expenses where userId=:userId AND month(createdAt)=:month group by category ORDER BY percentage DESC LIMIT 3;`,{
        replacements:{userId:userId, month:currentMonth},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      res.status(500).json({error:"Internal Server Error"});
    }
  }

  async function getdescincomes(req: Request, res: Response): Promise<void> {
    try {
        
      const rtoken = req.header("Authorization");
      const token = rtoken!.replace("Bearer ", "");
      const decoded = jwt.verify(token, "your_secret_key") as payloadType;
      const userId=decoded.userId;
    
      const response=await db.sequelize.query(`select description, amount from Incomes where userId=:userId order by amount DESC LIMIT 3;`,{
        replacements:{userId:userId},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      res.status(500).json({error:"Internal Server Error"});
    }
  }

  const queryController={
    totalincome:totalincome,
    totalexpense:totalexpense,
    getByMonth:getByMonth,
    getByCategory:getByCategory,
    getdescincomes:getdescincomes
  }

  export default queryController;