import mongoose from "mongoose";

const studentSchema=new mongoose.Schema({
    name:String,
    age:Number,
    gender:String
})

//student kiyana name database ekata model ekata create wenna
const Student=mongoose.model("students",studentSchema);

export default Student // defult eka file ekta eka parak witharai use karranna puluwan