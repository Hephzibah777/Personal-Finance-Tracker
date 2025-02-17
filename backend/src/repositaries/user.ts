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

