const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/smart-price", async (req, res) => {

  const { cropType, state, expectedPricePerKg } = req.query;

  try {

    const response = await axios.get(
      "https://greenpath-1.onrender.com/predict",
      {
        params: {
          cropType,
          state,
          expectedPricePerKg
        }
      }
    );

    res.json(response.data);

  } catch (error) {

    console.error("AI ERROR 👉", error.message);

    res.status(500).json({
      success: false,
      error: "AI prediction failed"
    });
  }

});

module.exports = router;