import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import studentRouter from "./routes/studentRouter.js";// .js aniwaren danna 
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRouter.js";

const app=express();
const mongoDb_url="mongodb+srv://admin:1234@cluster0.pxi6g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(mongoDb_url,{});

const connection=mongoose.connection;

connection.once("open",()=>{
    console.log("MongoDB connected successfully");
})


app.use(bodyParser.json());

app.use("/api/students",studentRouter);
app.use("/api/products",productRouter); 
app.use("/api/users",userRouter);

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})