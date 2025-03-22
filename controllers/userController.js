import User from "../models/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import axios from "axios";

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
export async function googleLogin(req,res){
    console.log(req.body)
    const token = req.body.token
    //'https://www.googleapis.com/oauth2/v3/userinfo'
    try{
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const email = response.data.email
      //check if user exists
      const usersList = await User.find({email: email})
      if(usersList.length >0){
        const user = usersList[0]
        const token = jwt.sign({
          email : user.email,
          firstName : user.firstName,
          lastName : user.lastName,
          isBlocked : user.isBlocked,
          type : user.type,
          profilePicture : user.profilePic
        } , process.env.SECRET)
        
        res.json({
          message: "User logged in",
          token: token,
          user : {
            firstName : user.firstName,
            lastName : user.lastName,
            type : user.type|| "customer",
            profilePicture : user.profilePic,
            email : user.email
          }
        })
      }else{
        //create new user
        const newUserData = {
          email: email,
          firstName: response.data.given_name,
          lastName: response.data.family_name,
          type: "customer",
          password: "ffffff",
          profilePicture: response.data.picture
        }
        const user = new User(newUserData)
        user.save().then(()=>{
          res.json({
            message: "User created"
          })
        }).catch((error)=>{
          res.json({      
            message: "User not created"
          })
        })
  
      }
  
    }catch(e){
      res.json({
        message: "Google login failed"
      })
    }
  
  
  }