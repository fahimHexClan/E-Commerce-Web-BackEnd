import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


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
    User.find({email : req.body.email}).then((user)=>{
        if(user.length==0){
            res.json({
                message:"user not found"
            })
        }else{

            const user=user[0];  //compareSync eke wenne comparre wenna 
            const isPasswordCorrect=bcrypt.compareSync(req.body.password,user.password)

            if(isPasswordCorrect){
                const token=jwt.sign({
                   email:user.email,
                   firstName:user.firstName,
                   lastName:user.lastName,
                   isBlocked:user.isBlocked,
                   type:user.type,
                   profilePic:user.profilePic
                },"secret")

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