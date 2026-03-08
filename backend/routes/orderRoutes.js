const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Fertilizer = require("../models/Fertilizer");
const mongoose = require("mongoose");
const crypto = require("crypto");
// CREATE ORDER
router.post("/create", async (req, res) => {
  try {
    const { fertilizerId, userId } = req.body;

    const fertilizer = await Fertilizer.findById(fertilizerId);
    if (!fertilizer) {
      return res.status(404).json({ message: "Fertilizer not found" });
    }

    const order = await Order.create({
      user: userId,
      fertilizer: fertilizerId,
      amount: fertilizer.price,
      status: "pending",
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order" });
  }
});

  //  CONFIRM PAYMENT


router.post("/confirm", async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const transactionId = "TXN" + Date.now();

    const hmac = crypto.createHmac("sha256", "greenpath_secret");
    hmac.update(orderId + transactionId);
    const signature = hmac.digest("hex");

    order.status = paymentMethod === "COD" ? "cod" : "paid";
    order.paymentMethod = paymentMethod;
    order.transactionId = transactionId;
    order.invoiceNumber = "INV-" + Date.now();
    order.paidAt = new Date();

    await order.save();

    res.json({
      success: true,
      order,
      signature,
    });
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
});

//  GET MY ORDERS

router.get("/my-orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.userId
    })
      .populate("fertilizer")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("MY ORDERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// CANCEL ORDER

router.put("/cancel/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "failed";
    await order.save();

    res.json({ success: true, message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Cancel failed" });
  }
});

//DELETE ORDER

router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});
module.exports = router;