import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();


export function createUser(req,res){

    const newUser=req.body

    // 10 podradhu route solra 10 times hash add aahum idhunala more securre 
    newUser.password=bcrypt.hashSync(newUser.password,10)//hashsyns use laranne hashadd karanna

    //new userr knk hedana ganen bc
    const user=new User(newUser)

    user.save().then((user)=>{          
        res.json({
            message:"user Created Successfully",
        })
    }).catch((err)=>{

        res.json({  
            message:"user not created"
            })
    })
}

export function login(req,res){
    User.find({email : req.body.email}).then((users)=>{
        if(users.length==0){
            res.json({
                message:"user not found"
            })
        }else{

            const foundUser =users[0];  //compareSync eke wenne comparre wenna 
            const isPasswordCorrect=bcrypt.compareSync(req.body.password,foundUser.password)

            if(isPasswordCorrect){
                const token=jwt.sign({
                   email:foundUser .email,
                   firstName:foundUser .firstName,
                   lastName:foundUser .lastName,
                   isBlocked:foundUser .isBlocked,
                   type:foundUser .type,
                   profilePic:foundUser .profilePic
                },process.env.SecretKey)

                res.json({
                    message:"login successful",
                    token:token
                })
            }else{
                res.json({
                    message:"password incorrect"
                })
            }
        }

    })

}