const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/smart-price", async (req, res) => {

  try {

    const { cropType, state, expectedPricePerKg } = req.query;

    if (!cropType || !state) {
      return res.status(400).json({
        success: false,
        error: "cropType and state required"
      });
    }

    const response = await axios.get(
      "https://greenpath-1.onrender.com/predict",
      {
        params: {
          cropType,
          state,
          expectedPricePerKg: expectedPricePerKg || 0
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    console.error("AI ERROR 👉", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "AI prediction failed"
    });
  }

});

module.exports = router;