import Product from "../models/product.js";

async function  getProducrts (req,res){
    try{
    const productList=await Product.find();

    res.json({  
        list:productList
    })

    }catch(err){
        res.json({
            message:"Product not found"
        })
    }
   
}

function createProduct(req,res){    

    const product=new Product(req.body)
  
    product.save().then((product)=>{
  
      res.json({
          message:"product saved successfully",
    })
  
    }).catch((err)=>{
  
      res.json({
          message:"product not saved"
          })
    })
  }

function deleteProduct(req,res){
  
  Product.deleteOne({name : req.params.name}).then(()=>{
  
      res.json({
          message:"Product deleted successfully",
      })
  
  }).catch((err)=>{
  
      res.json({
          message:"Product not deleted"
      })
  })
  
  }


function updateProduct(req,res){
  
  const id=req.params.id;
  
  Product.findByIdAndUpdate(id,req.body).then((product)=>{
  
      res.json({
          message:"student updated successfully",
      })
  
  }).catch((err)=>{
  
      res.json({
          message:"student not updated"
      })
  })
  
  }

function getProductByName(req,res){
    const name =req.body.name;

    Product.find({name : name}).then((productList)=>{
        res.json({
            list:productList
        })
    }).catch((err)=>{
        res.json({
            message:"Product not found"
        })
    })
}


export {getProducrts,createProduct,deleteProduct,updateProduct,getProductByName} 