import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();// env file config pannikolla use panrrradhu

const app=express();
const mongoDb_url=process.env.Mongo_Db_Url // idula env file la ikira mongodb url a idhuku set pannradhu

mongoose.connect(mongoDb_url,{});

const connection=mongoose.connection;

connection.once("open",()=>{
    console.log("MongoDB connected successfully");
})


app.use(bodyParser.json());

app.use((req,res,next)=>{
    const token = req.header("Authorization")?.replace("Bearer ","")
    console.log(token)

    if(token != null){
      jwt.verify(token,process.env.SecretKey , (error,decoded)=>{

        if(!error){
          req.user = decoded        
        }

      })
    }

    next()

})

app.use("/api/products",productRouter); 
app.use("/api/users",userRouter);

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})

