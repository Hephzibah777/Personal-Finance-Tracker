import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import db from "../config/db";
import { QueryTypes, Sequelize } from "sequelize";
interface PayloadType {
  userId: number;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

const SECRET_KEY = "your_secret_key";

// Helper function to extract and verify JWT token
const verifyToken = (req: Request): PayloadType => {
  const rtoken = req.header("Authorization");
  if (!rtoken) {
    throw { status: 401, message: "Authorization token is required" };
  }

  const token = rtoken.replace("Bearer ", "");
  return jwt.verify(token, SECRET_KEY) as PayloadType;
};


async function totalIncome(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      const { userId } = verifyToken(req);
    
      const response=await db.sequelize.query('SELECT SUM(amount) income FROM `Incomes` where userId=:userId',{
        replacements:{userId:userId},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      next(error);
    }
  }

  async function totalExpense(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      const { userId } = verifyToken(req);
    
      const response=await db.sequelize.query('SELECT SUM(amount) expense FROM `Expenses` where userId=:userId',{
        replacements:{userId:userId},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      next(error);
    }
  }

  async function getByMonth(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
        const year=req.params.year;
        const { userId } = verifyToken(req);
    
      const response=await db.sequelize.query(`select sum(a.amount) incomes, sum(b.amount) expenses, monthname(a.createdAt) month  from Incomes a JOIN Expenses b where  year(a.createdAt)=:year AND a.userId=:userId group by month`,{
        replacements:{userId:userId, year:year},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      next(error);
    }
  }

  async function getByCategory(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
        console.log("hello00000");
        const currentMonth=new Date().getMonth()+1;
        const { userId } = verifyToken(req);
    
      const response=await db.sequelize.query(`select SUM(amount)/(select SUM(amount) from Incomes)*100 percentage, category FROM Expenses where userId=:userId AND month(createdAt)=:month group by category ORDER BY percentage DESC LIMIT 3;`,{
        replacements:{userId:userId, month:currentMonth},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      next(error);
    }
  }

  async function getDescIncomes(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
        
      const { userId } = verifyToken(req);
      const month=new Date().getMonth()+1;
    
      const response=await db.sequelize.query(`select description, amount from Incomes where userId=:userId AND month(createdAt)=:month order by amount DESC LIMIT 3;`,{
        replacements:{userId:userId, month:month},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      next(error);
    }
  }

  async function getDescExpenses(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
        
      const { userId } = verifyToken(req);
      const month=new Date().getMonth()+1;
    
      const response=await db.sequelize.query(`select category, amount from Expenses where userId=:userId AND month(createdAt)=:month order by amount DESC LIMIT 3;`,{
        replacements:{userId:userId, month:month},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      next(error);
    }
  }

  async function getCategoryPercentage(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
        
      const { userId } = verifyToken(req);
      const month=new Date().getMonth()+1;
    
      const response=await db.sequelize.query(`Select SUM(amount)/(Select SUM(amount) FROM Incomes where userId=:userId and month(createdAt)=:month)*100 percentage FROM Expenses where userId=:userId and month(createdAt)=:month`,{
        replacements:{userId:userId, month:month},
        type:QueryTypes.SELECT
      })

     res.send(response);
     
  
    } catch (error) {
      next(error);
    }
  }


  const queryController={
    totalIncome:totalIncome,
    totalExpense:totalExpense,
    getByMonth:getByMonth,
    getByCategory:getByCategory,
    getDescIncomes,
    getDescExpenses,
    getCategoryPercentage
  }

  export default queryController;