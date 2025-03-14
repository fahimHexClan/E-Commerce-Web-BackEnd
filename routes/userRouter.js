import express from "express";
import { createUser, login } from "../contrrollers/userControl.js";

const userRouter=express.Router();

userRouter.post("/signup",createUser) 

userRouter.post("/login",login)



export default userRouter
/*{
    "email": "Fahim@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "Admin222",
    "isBlocked": false,
    "type": "admin",
    "profilePic": "https://example.com/profile_pics/john_doe.jpg"
}
    {
    "email": "ssana@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "222",
    "isBlocked": false,
    "profilePic": "https://example.com/profile_pics/john_doe.jpg"
}
    */

