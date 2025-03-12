import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:String,
    price:Number,
    description:String
})

//student kiyana name database ekata model ekata create wenna
const product=mongoose.model("product",productSchema);

export default product // defult eka file ekta eka parak witharai use karranna puluwan