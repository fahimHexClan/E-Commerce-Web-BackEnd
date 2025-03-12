import express from "express";
import { createUser } from "../contrrollers/userControl.js";

const userRouter=express.Router();

userRouter.post("/",createUser) 

export default userRouter