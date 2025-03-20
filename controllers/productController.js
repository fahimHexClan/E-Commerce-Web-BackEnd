import Product from "../models/product.js";
import { isAdmin } from "./userController.js"; 

export function createProduct(req, res) {

    if (!isAdmin(req)) {
        res.json({
            message: "pls login as admin to add product",
        });
        return;
    }

    const newProduct = req.body;

    const product = new Product(newProduct);

    product.save().then((product) => {
        res.json({
            message: "product created successfully",
        })    
    }).catch((error) => {
        res.json({
            message: "product creation failed",
        });
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
  