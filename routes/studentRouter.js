import express from "express";
import { getStudents,createStudent,deleteStudent,updateStudent } from "../contrrollers/studentController.js"; 
//import godak thiyanawanam {}meka danna ona 

const studentRouter=express.Router();

studentRouter.get("/",getStudents)                  

studentRouter.post("/",createStudent)

studentRouter.delete("/",deleteStudent)

studentRouter.put("/:id",updateStudent) 


export default studentRouter

