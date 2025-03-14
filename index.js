import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();// env file config pannakolla use panrrradhu

const app=express();
const mongoDb_url=process.env.Mongo_Db_Url // idula env file la ikira mongodb url a idhuku set pannradhu

mongoose.connect(mongoDb_url,{});

const connection=mongoose.connection;

connection.once("open",()=>{
    console.log("MongoDB connected successfully");
})


app.use(bodyParser.json());

//This is a middleware function.It runs for every request before reaching the actual route.
//req → Contains the request data (headers, body, params, etc.).res → Used to send a response to the client.
//next() → Moves the request to the next middleware or route.

app.use((req,res,next)=>{
    //It gets the Authorization header from the request.
    //.replace("Bearer ", ""):.If the token is in the format "Bearer <token>", this removes "Bearer " to extract the actual token.
    //?. (Optional Chaining) prevents errors if header() returns null or undefined.
    const token = req.header("Authorization")?.replace("Bearer ","")
    console.log(token)

    //Verifying the Token

    if(token != null){
      jwt.verify(token,process.env.SecretKey , (error,decoded)=>{

        if(!error){
          req.user = decoded    
          //When you verify a JWT (JSON Web Token), the jwt.verify() function decodes the token and checks if it's valid. If the token is valid, the decoded object will contain the user's data that was originally used to generate the token.   
          console.log(decoded) 
        }

      })
    }

    next()

})

app.use("/api/users",userRouter);
app.use("/api/products",productRouter);
app.use("/api/orders",orderRouter);


app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})

