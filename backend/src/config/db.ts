import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();



const dbName='Finance';
const dbUser="root";
const dbPassword="root";

const sequelize=new Sequelize(dbName, dbUser, dbPassword,{
    host:'localhost',
    dialect:'mysql',
    logging:console.log
});

const dbConnect=()=>{
    sequelize
    .authenticate()
    .then(()=>console.log("Successfully connected to the database"))
    .catch((error)=>console.log('Failed to connect the database', error))
}

const db={
    sequelize:sequelize,
    dbConnect:dbConnect,
    user:{},
    income:{},
    expense:{},
    emi:{},
    loan:{},
    category:{},

}

export default db;