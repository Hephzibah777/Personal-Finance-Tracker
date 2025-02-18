import {Request, Response, NextFunction} from "express";
import validator from "email-validator";
import bcrypt from "bcrypt";
import db from "../config/db";
import { QueryTypes } from "sequelize";
import { emit } from "process";
import { error } from "console";
import jwt from "jsonwebtoken";

interface usertype{
    id:number,
    username:string,
    firstname:string,
    lastname:string,
    email:string,
    password:string
}
const secretKey = "your_secret_key";
async function adduser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, firstname, lastname, email, password } = req.body;
  
      // Validate required fields
      if (!username) {
        return next(new Error('Username is required'));
      }
      if (!email) {
        return next(new Error('Email is required'));
      }
      if (!password) {
        return next(new Error('Password is required'));
      }
  
      // Validate email format
      const isValid = validator.validate(email);
      if (!isValid) {
        return next(new Error('Email is not valid'));
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdAt = new Date();
      const updatedAt = new Date();
  
      // Check if user already exists
      const checkUser = await db.sequelize.query(`SELECT * FROM Users WHERE email=:email`, {
        replacements: { email },
        type: QueryTypes.SELECT,
      });
  
      if (checkUser.length !== 0) {
        return next(new Error('User already exists'));
      }
  
      // Insert the new user into the database
      await db.sequelize.query(
        `INSERT INTO Users (username, firstname, lastname, email, password, createdAt, updatedAt) 
        VALUES (:username, :firstname, :lastname, :email, :password, :createdAt, :updatedAt)`,
        {
          replacements: { username, firstname, lastname, email, password: hashedPassword, createdAt, updatedAt },
          type: QueryTypes.INSERT,
        }
      );
  
      // Return success response
      res.status(200).json({ message: 'User successfully added' });
    } catch (error) {
      // Pass any error to the global error handler middleware
      next(error);
    }
  }
  
 

  async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return next(new Error('Email and password cannot be empty'));
      }
  
      const user: usertype[] = await db.sequelize.query(`SELECT * FROM Users WHERE email=:email`, {
        replacements: { email },
        type: QueryTypes.SELECT,
      });
  
      if (user.length === 0) {
        return next(new Error('User does not exist'));
      }
  
      const isPasswordValid = await bcrypt.compare(password, user[0].password);
      if (!isPasswordValid) {
        return next(new Error('Invalid credentials'));
      }
  
      const token = jwt.sign(
        { userId: user[0].id, username: user[0].username, email: user[0].email },
        secretKey,
        { expiresIn: '1h' }
      );
  
      res.json({ token });
    } catch (error) {
      next(error); // Pass to global error handler
    }
  }
  
  async function getAllusers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await db.sequelize.query('SELECT * FROM Users');
      res.json(users);
    } catch (error) {
      next(error); // Pass to global error handler
    }
  }
  
  async function getselecteduser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.userId;
      const user = await db.sequelize.query('SELECT * FROM Users WHERE id=:id', {
        replacements: { id },
        type: QueryTypes.SELECT,
      });
  
      res.json(user);
    } catch (error) {
      next(error); // Pass to global error handler
    }
  }
  
  async function updateselecteduser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.userId;
      const body = req.body;
      const updatedAt = new Date();
  
      let col = '';
      Object.keys(body).forEach((key) => {
        col += `${key}=:${key},`;
      });
  
      const query = `UPDATE Users SET ${col} updatedAt=:updatedAt`;
  
      await db.sequelize.query(query, {
        replacements: { updatedAt, ...body },
        type: QueryTypes.UPDATE,
      });
  
      res.status(200).json({ message: 'Successfully updated the user details' });
    } catch (error) {
      next(error); // Pass to global error handler
    }
  }
  
  async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('authToken', {
        path: '/',
        secure: true,
        sameSite: 'strict',
      });
  
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error); // Pass to global error handler
    }
  }
  
  const userController = {
    adduser: adduser,
    login: login,
    getAllusers: getAllusers,
    getselecteduser: getselecteduser,
    updateselecteduser: updateselecteduser,
    logout: logout,
  };
  
  export default userController;