const mongoose = require("mongoose");

const fertilizerSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  description: String,
  image: String,

  deliveryAvailable: {
    type: Boolean,
    default: true,
  },

  pickupAvailable: {
    type: Boolean,
    default: true,
  },

  stock: Number,

  location: String, 
});

module.exports = mongoose.model("Fertilizer", fertilizerSchema);
