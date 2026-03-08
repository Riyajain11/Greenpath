const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fertilizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fertilizer",
    },
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "paid", "cod", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "CARD", "COD"],
    },
    transactionId: String,
    paidAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);