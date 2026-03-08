const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Token generator helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // token expiry
  });
};

// REGISTER

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, aadhar, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { aadhar }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user (password will be hashed in model pre-save hook)
    const user = await User.create({ name, email, phone, aadhar, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      aadhar: user.aadhar,
      token: generateToken(user._id), // return token
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // login with email OR phone
    const user = await User.findOne({
      $or: [{ email }, { phone: email }],
    });

    // check user + password
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        aadhar: user.aadhar,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
