import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/db"; // Import the database connection
import User from "./models/user";
import Income from "./models/income";
import Expense from "./models/expense";
import Emi from "./models/emi";
import userRoutes from "./routes/userRoutes";
import Loan from "./models/loan";
import cookieParser from "cookie-parser";
import Category from "./models/category";
import incomeRoutes from "./routes/incomeRoutes"
import expenseRoutes from "./routes/expenseRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import queryRoutes from "./routes/queryRoutes"
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import errorHandler from "./middleware/errorHandler";



// Load environment variables
dotenv.config();


const app = express();

// Swagger Configuration
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "MERN Stack API Documentation",
    version: "1.0.0",
    description: "This is a REST API built with Express and TypeScript.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "API Support",
      url: "https://example.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development Server",
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./dist/routes/*.js"], // Ensure this points to your TypeScript route files
};



const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use(cookieParser());

// Register Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cors({
  origin:"http://localhost:5174",
  credentials:true
}));
app.use(express.json());


db.dbConnect();

app.use("/", userRoutes);
app.use("/", incomeRoutes);
app.use("/", expenseRoutes);
app.use("/", categoryRoutes);
app.use("/", queryRoutes);
db.user=User;
db.income=Income;
db.expense=Expense;
db.emi=Emi;
db.loan=Loan;
db.category=Category;

app.use(errorHandler);

// Sync Models with Database
db.sequelize
  .sync()
  .then(() => {
    console.log("Tables created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create tables:", error);
  });

 

  // Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

