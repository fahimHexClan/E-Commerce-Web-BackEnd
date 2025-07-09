import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin, isCustomer } from "./userController.js";
import User from "../models/user.js";

export async function createOrder(req, res) {
  if (!isCustomer(req)) {
    return res.json({ 
      message: "Please login as customer to create orders" 
    });
  }
  
  try {
    const latestOrder = await Order.find().sort({ orderId: -1 }).limit(1);
    let orderId;
    if (latestOrder.length === 0) {
      orderId = "CBC0001";
    } else {
      const currentOrderId = latestOrder[0].orderId;
      const numberString = currentOrderId.replace("CBC", "");
      const number = parseInt(numberString);
      const newNumber = (number + 1).toString().padStart(4, "0");
      orderId = "CBC" + newNumber;
    }
    const newOrderData = req.body;

    const newProductArray = [];
    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const product = await Product.findOne({
        productId: newOrderData.orderedItems[i].productId,
      });

      if (!product) {
        return res.json({
          message: `Product with id ${newOrderData.orderedItems[i].productId} not found`,
        });
      }

      newProductArray[i] = {
        name: product.productName,
        price: product.lastPrice,
        quantity: newOrderData.orderedItems[i].qty,
        image: product.image[0],
      };
    }
    newOrderData.orderedItems = newProductArray;
    newOrderData.orderId = orderId;
    newOrderData.email = req.user.email;
    newOrderData.total = newProductArray.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0); // Ensure valid calculation
    newOrderData.date = new Date(); // Updated to use 'date' as per schema

    const order = new Order(newOrderData);
    const savedOrder = await order.save();
    res.json({
      message: "Order created",
      order: savedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getOrders(req, res) {
  try {
    if (isCustomer(req)) {
      const orders = await Order.find({ email: req.user.email });
      return res.json(orders);
    } else if (isAdmin(req)) {
      const orders = await Order.find({});
      return res.json(orders);
    } else {
      return res.json({
        message: "Please login to view orders"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getQuote(req, res) {
  try {
    const newOrderData = req.body;

    const newProductArray = [];
    let total = 0;
    let labeledTotal = 0;

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const product = await Product.findOne({
        productId: newOrderData.orderedItems[i].productId,
      });

      if (!product) {
        return res.json({
          message: `Product with id ${newOrderData.orderedItems[i].productId} not found`,
        });
      }
      labeledTotal += product.price * newOrderData.orderedItems[i].qty;
      total += product.lastPrice * newOrderData.orderedItems[i].qty;
      newProductArray[i] = {
        name: product.productName,
        price: product.lastPrice,
        labeledPrice: product.price,
        quantity: newOrderData.orderedItems[i].qty,
        image: product.image[0],
      };
    }
    newOrderData.orderedItems = newProductArray;
    newOrderData.total = total;

    res.json({
      orderedItems: newProductArray,
      total: total,
      labeledTotal: labeledTotal,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function updateOrder(req, res) {
  if (!isAdmin(req)) {
    return res.json({
      message: "Please login as admin to update orders",
    });
  }
  
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const { notes, status } = req.body;
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { notes, status },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Order updated",
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getDashboardStats(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Please login as admin to view dashboard stats" });
    }

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ type: "customer" });

    const revenueData = await Order.aggregate([
      {
        $addFields: {
          calculatedTotal: {
            $ifNull: [
              "$total",
              {
                $reduce: {
                  input: "$orderedItems",
                  initialValue: 0,
                  in: { $add: ["$$value", { $multiply: ["$$this.price", "$$this.quantity"] }] }
                }
              }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$calculatedTotal" }
        }
      }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    console.log("Revenue Data:", revenueData);

    const recentOrders = await Order.find()
      .sort({ date: -1 })
      .limit(5)
      .select("orderId email status date");

    const orderTrends = await Order.aggregate([
      { $match: { date: { $exists: true, $type: "date" } } },
      { $group: { _id: { $month: "$date" }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log("Order Trends:", orderTrends);

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders,
      orderTrends,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
}