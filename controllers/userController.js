import User from "../models/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();


export function createUser(req,res){

    const newUser=req.body
// 1 admin eken thama thawa admin wa hadanna puluwan 
    if(newUser.type=="admin"){
        if(req.user==null){
            res.json({
                message:"pls login as admin to create admin user"

            })
            return
        }
        if(req.user.type!="admin"){
            res.json({
                message:"pls login as admin to create admin account"
            })
            return
        }
    }


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
    //Find the User in the Database
    User.find({email : req.body.email}).then((users)=>{
        if(users.length==0){
            res.json({
                message:"user not found"
            })
        }else{

            const foundUser =users[0];  //compareSync eke wenne comparre wenna 
            const isPasswordCorrect=bcrypt.compareSync(req.body.password,foundUser.password)
            //bcrypt.compareSync() checks if the entered password (req.body.password) matches the hashed password (foundUser.password).
            //Returns true if the passwords match, otherwise returns false.

            if(isPasswordCorrect){
                const token=jwt.sign({
                   email:foundUser .email,
                   firstName:foundUser .firstName,
                   lastName:foundUser .lastName,
                   isBlocked:foundUser .isBlocked,
                   type:foundUser .type,
                   profilePic:foundUser .profilePic
                },process.env.SecretKey)
                //The token is signed using a secret key stored in process.env.SecretKey (which should be set in an .env file).
                //The token is sent to the user upon successful login.

                res.json({
                    message:"login successful",
                    token:token,
                    user :{
                        firstName:foundUser.firstName,
                        lastName:foundUser.lastName,
                        type:foundUser.type,
                        profilePic:foundUser.profilePic,
                        email:foundUser.email
                    }
                })
            }else{
                res.json({
                    message:"password incorrect"
                })
            }
        }

    })

}

export function isAdmin(req){

    if(req.user==null){
        return false
    }

    if(req.user.type!="admin"){
        return false
    }

    return true
}

export function isCustomer(req){

    if(req.user==null){
        return false
    }

    if(req.user.type!="customer"){  
        return false
    }

    return true 
}   