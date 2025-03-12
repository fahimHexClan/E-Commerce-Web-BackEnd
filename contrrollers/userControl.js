import User from "../models/user.js";

export function createUser(req,res){
    const user=new User(req.body)

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