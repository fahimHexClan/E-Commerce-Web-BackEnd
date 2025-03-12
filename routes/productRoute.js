import express from "express";
import { getProducrts,createProduct,deleteProduct,updateProduct,getProductByName } from "../contrrollers/productController.js";  

const productRouter=express.Router();

productRouter.get("/",getProducrts)

productRouter.post("/",createProduct)

productRouter.delete("/name",deleteProduct)

productRouter.put("/:id",updateProduct)

productRouter.get("/byName",getProductByName)


export default productRouter