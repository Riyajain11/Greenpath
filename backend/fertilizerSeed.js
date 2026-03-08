require("dotenv").config();
const mongoose = require("mongoose");
const Fertilizer = require("./models/Fertilizer");

const MONGO_URI = process.env.MONGO_URI;

const fertilizers = [
  {
    name: "Urea 46%",
    brand: "IFFCO",
    price: 266,
    description: "High nitrogen fertilizer ideal for wheat and rice crops.",
    image: "/uploads/ai-crops/urea.jpg",
    stock: 120,
    location: "Ludhiana, Punjab"
  },
  {
    name: "DAP 18-46-0",
    brand: "Coromandel",
    price: 1350,
    description: "Best for strong root development and early growth.",
    image: "/uploads/ai-crops/dap.jpg",
    stock: 80,
    location: "Indore, Madhya Pradesh"
  },
  {
    name: "MOP Potash",
    brand: "Tata Chemicals",
    price: 1700,
    description: "Improves crop resistance and yield quality.",
    image: "/uploads/ai-crops/mop.jpg",
    stock: 60,
    location: "Nagpur, Maharashtra"
  },
  {
    name: "Organic Compost",
    brand: "GreenGrow",
    price: 450,
    description: "Eco-friendly organic fertilizer for sustainable farming.",
    image: "/uploads/ai-crops/compost.jpg",
    stock: 150,
    location: "Jaipur, Rajasthan"
  },
  {
    name: "Bio NPK Mix",
    brand: "BioFarm",
    price: 900,
    description: "Balanced nutrient mix for overall crop health.",
    image: "/uploads/ai-crops/bionpk.jpg",
    stock: 75,
    location: "Lucknow, Uttar Pradesh"
  }
];

async function seedFertilizers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Fertilizer.deleteMany({});
    await Fertilizer.insertMany(fertilizers);

    console.log("Fertilizers seeded successfully 🌱");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedFertilizers();