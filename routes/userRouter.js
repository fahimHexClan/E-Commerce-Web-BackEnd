import express from "express";
import { createUser, login , googleLogin} from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.post("/signup",createUser) 

userRouter.post("/login",login)

userRouter.post("/google", googleLogin)



export default userRouter;
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
      "email": "Sun@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "G123",
    "isBlocked": false,
    "profilePic": "https://example.com/profile_pics/john_doe.jpg"
}
    */

