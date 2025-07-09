import express from 'express';
 import { createOrder, getOrders, getQuote , updateOrder, getDashboardStats} from '../controllers/orderController.js';
 
 const orderRouter = express.Router();
 
 orderRouter.post("/", createOrder)
 orderRouter.get("/", getOrders) 
 orderRouter.post("/quote", getQuote)
 orderRouter.put("/:orderId",updateOrder)
orderRouter.get("/admin/stats", getDashboardStats);
 export default orderRouter;