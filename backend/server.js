const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const cropRoutes = require("./routes/cropRoutes");
const aiRoutes = require("./routes/aiRoutes");
const fertilizerRoutes = require("./routes/fertilizerRoutes");
const orderRoutes = require("./routes/orderRoutes");


const app = express();

const path = require("path");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/fertilizers", fertilizerRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("🌱 GreenPath API is running...");
});

app.use(express.static(path.join(__dirname, "../frontend/Greenpath/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/Greenpath/dist/index.html"));
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(" MongoDB connection error:", err));
