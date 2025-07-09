import Product from "../models/product.js";
import { isAdmin } from "./userController.js"; 

export function createProduct(req, res) {

   if (!isAdmin(req)) {
    return res.status(403).json({ message: "Please login as admin to add product" });
  }

  const newProduct = req.body;

  const product = new Product(newProduct);

  product
    .save()
    .then((savedProduct) => {
      res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
      });
    })
    .catch((error) => {
      console.error("Product save error:", error); // Log error for debugging
      if (error.code === 11000) {
        // Handle duplicate productId
        res.status(400).json({ message: "Product ID already exists" });
      } else {
        // Handle other errors (e.g., validation)
        res.status(500).json({
          message: "Product creation failed",
          error: error.message,
        });
      }
    });
}

export function getProducts(req, res) {
    Product.find().then((products) => {
        res.json({
            message: "products fetched successfully",
            products: products,
        });
    })
    .catch((error) => {
        res.json({
            message: "product fetching failed",
            error: error.message
        });
    });
}
export function deleteProduct(req, res) {
    // Check if the user is an admin
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Please login as admin to delete product" });
    }
  
    // Get the productId from request parameters
    const { productId } = req.params;
  
    // Find and delete the product by productId
    Product.findOneAndDelete({ productId })
      .then((deletedProduct) => {
        if (!deletedProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
      })
      .catch((error) => {
        res.status(500).json({ message: "Product deletion failed", error: error.message });
      });
  }
  export function updateProduct(req,res){
    if(!isAdmin(req)){
      res.status(403).json({
        message: "Please login as administrator to update products"
      })
      return
    }
  
    const productId = req.params.productId;
    console.log("Received ID:", productId); // ✅ Debugging

    const newProductData = req.body
  
    Product.updateOne(
      {productId : productId},
      newProductData
    ).then(()=>{
      res.json({
        message: "Product updated"
      })
    }).catch((error)=>{
      res.status(403).json({
        message: error
      })
    })
  }
  
  export async function getProductById(req,res){
  
    try{
      const productId = req.params.productId
  
      const product = await Product.findOne({productId : productId})
  
      res.json(product)
      
    }catch(e){
      res.status(500).json({
        e,
      });
    }
    
  }
  export async function searchProducts(req, res) {
    const query = req.params.query;
    try {
      const products = await Product.find({
        $or: [
          { productName: { $regex: query, $options: "i" } },
          { altNames: { $elemMatch: { $regex: query, $options: "i" } } },
        ],
      });
  
      res.json(products);
    } catch (e) {
      res.status(500).json({
        e,
      });
    }
  }