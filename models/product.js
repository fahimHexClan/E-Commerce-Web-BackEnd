import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    productId :{
        type : String,
        required : true,
        unique : true
    },
    productName :{
        type : String,
        required : true
    },
    altNames:[{
        type : String //arrray ekek string values add wenne 
    }],

    image :{
        type : String,
    },

    price :{
        type : Number,
        required : true
    },
    lastPrice :{
        type : Number
    },
    
    stock :{
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
    
})

const Product=mongoose.model("Product",productSchema);

export default Product