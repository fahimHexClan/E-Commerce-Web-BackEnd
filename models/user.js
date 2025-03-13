import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email :{
        type : String,
        required : true,
        unique : true
    },
    firstName:{
        type : String,
        required : true
    },
    lastName :{
        type : String,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    isBlocked :{
        type : Boolean,
        default :false//user knk hedaddi defult value false danna ona
    },
    type:{
        type : String,
        default : "customer"     
    },
    profilePic:{
        type :String, 
        default : "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?t=st=1741812953~exp=1741816553~hmac=ea9d75f2e4333354fca425f8e9ed6d662683057f50a6f2dbb4437651a3a27c04&w=740"

    }


})
const User=mongoose.model("users",userSchema);

export default User