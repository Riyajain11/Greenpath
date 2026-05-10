// const express = require("express");
// const router = express.Router();
// const axios = require("axios");

// router.get("/smart-price", async (req, res) => {
//   try {
//     const { cropType, state, expectedPricePerKg } = req.query;

//     if (!cropType || !state) {
//       return res.status(400).json({
//         success: false,
//         error: "cropType and state required",
//       });
//     }

//     const res = await axios.get("/api/ai/smart-price", {
//   timeout: 60000,
//   params: {
//     cropType: cropType.trim().toLowerCase(),
//     state: state.trim().toLowerCase(),
//     expectedPricePerKg,
//   },
// });
//     res.json(response.data);
//   } catch (error) {
//     console.error("AI ERROR 👉", error.response?.data || error.message);

//     res.status(500).json({
//       success: false,
//       error: "AI prediction failed",
//     });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/smart-price", async (req, res) => {
  try {
    const { cropType, state, expectedPricePerKg } = req.query;

    if (!cropType || !state) {
      return res.status(400).json({
        success: false,
        error: "cropType and state required",
      });
    }

    const response = await axios.get(
      "https://greenpath-1.onrender.com/predict",
      {
        timeout: 60000,
        params: {
          cropType,
          state,
          expectedPricePerKg,
        },
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("AI ERROR 👉", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "AI prediction failed",
    });
  }
});

module.exports = router;