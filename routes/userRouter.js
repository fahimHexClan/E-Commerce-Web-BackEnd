import express from "express";
import { createUser, login ,isAdmin,isCustomer, googleLogin,getCustomers,updateCustomer,exportCustomers} from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.post("/signup",createUser) 

userRouter.post("/login",login)

userRouter.post("/google", googleLogin)

userRouter.get("/customers", getCustomers);

userRouter.put("/customers/:customerId", updateCustomer);

userRouter.get("/customers/export", exportCustomers);



export default userRouter;
/*{
    "email": "Fahim@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password"c: "Admin222",
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

