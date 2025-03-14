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
           
        });
    })
    .catch((error) => {
        res.json({
            message: "product fetching failed",
        });
    });
}