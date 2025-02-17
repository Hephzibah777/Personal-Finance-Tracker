import {Request, Response} from "express";
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
async function adduser(req:Request, res:Response):Promise<void>{
    try{
        const {username, firstname, lastname, email, password}=req.body;
        const hashedpassword=await bcrypt.hash(password,10);
        const createdAt=new Date();
        const updatedAt=new Date();

    if(!username){
        res.status(400).json({error:"Username is required"});
        return;
    }
    if(!email){
        res.status(400).json({error:"Email is required"});
        return;
    }
    if(!password){
        res.status(400).json({error:"Password is required"});
        return;
    }

    const isValid=validator.validate(email);

    if(!isValid){
        res.status(400).json({error:"Email is not valid"});
        return;
    }

    const checkuser:usertype[]=await db.sequelize.query(`SELECT * from Users where email=:email`,{
        replacements:{email:email},
        type:QueryTypes.SELECT
    })

    if(checkuser.length!=0){
        res.status(409).json({error:"User already exists"});
        return;
    }

    const user=db.sequelize.query(`INSERT INTO Users(username, firstname, lastname, email, password, createdAt, updatedAt) VALUES(:username, :firstname, :lastname, :email, :password, :createdAt, :updatedAt)`,{
        replacements:{username:username, firstname:firstname, lastname:lastname, email:email, password:hashedpassword, createdAt:createdAt, updatedAt:updatedAt},
        type:QueryTypes.INSERT
    })
    
    res.status(200).json({message:"Users Successfully Added"});

    }
    catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
}

async function login(req:Request, res:Response):Promise<void>{
try{
    const {email, password}=req.body;
    if(!email || !password){
        res.status(400).json({error:"Email and password cannot be empty"});
        return;
    }
    const user:usertype[]=await db.sequelize.query(`SELECT * from Users where email=:email`,{
        replacements:{email:email},
        type:QueryTypes.SELECT
    })
    if(user.length==0){
        res.status(400).json({error:"User does not exist"});
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      res.status(400).send("Invalid credentials.");
      return;
    }
    const token = jwt.sign({ userId: user[0].id, username:user[0].username, email:user[0].email }, secretKey, {
      expiresIn: "1h",
    });

    res.send({token:token});
}
catch(error){
    res.status(500).json({message:"Internal Server Error"});
}
}

async function getAllusers(req:Request, res:Response):Promise<void>{
    try{
        const users=db.sequelize.query('SELECT * FROM Users');
        res.send(users);
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
}

async function getselecteduser(req:Request, res:Response):Promise<void>{
    try{
        const id=req.params.userId;
        const user=db.sequelize.query('SELECT * FROM Users where id=:id',{
            replacements:{id:id},
            type:QueryTypes.SELECT
        })
        res.send(user);
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
}

async function updateselecteduser(req:Request, res:Response):Promise<void>{
   try{
    const id=req.params.userId;
    const body=req.body;
    const updatedAt=new Date();
    let col="";
    Object.keys(body).forEach(key=>{
        col=col+`${key}`+"="+":"+`${key}`+",";
    })
    const query="UPDATE `Users` SET "+ col+"updatedAt=:updatedAt";

    const result=await db.sequelize.query(query,{
        replacements:{updatedAt:updatedAt},
        type: QueryTypes.UPDATE
    })
    res.status(200).json({message:"Successfully Updated the user details"});
   }
   catch(error){
    res.status(500).json({message:"Internal Server Error"});
   }
}

async function logout(req:Request, res:Response):Promise<void>{
    console.log(req.cookies.authToken);
    res.clearCookie("authToken",{
        path:"/",
        secure:true,
        sameSite:"strict"
    })
    console.log("hello");
    res.status(200).json({message:"Logged out successfully"});
}

const userController={
    adduser:adduser,
    login:login,
    getAllusers:getAllusers,
    getselecteduser:getselecteduser,
    updateselecteduser:updateselecteduser,
    logout:logout
}

export default userController;