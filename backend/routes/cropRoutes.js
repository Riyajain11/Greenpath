const express = require("express");
const router = express.Router();
const Crop = require("../models/Crops");
const { upload } = require("../config/cloudinary");
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");

// CREATE A NEW CROP WITH IMAGES + AI SNAPSHOT

router.post("/", upload.array("images"), async (req, res) => {
  try {
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    } else if (req.body.images && Array.isArray(req.body.images)) {
      imageUrls = req.body.images;
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const crop = new Crop({
      user: req.body.user,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      contact: req.body.contact,
      dob: req.body.dob,
      cropType: req.body.cropType,
      quantityKg: req.body.quantityKg,
      expectedPricePerKg: req.body.expectedPricePerKg,
      state: req.body.state,
      city: req.body.city,
      images: imageUrls,
    });

    // 🌱 AI PRICE PREDICTION FROM ML SERVICE
    try {

      const aiRes = await axios.get(
        "https://greenpath-1.onrender.com/predict",
        {
          params: {
            cropType: crop.cropType,
            state: crop.state,
            expectedPricePerKg: crop.expectedPricePerKg
          }
        }
      );

      const aiResult = aiRes.data;

      if (aiResult.success) {

        crop.aiSnapshot = {
          predictedMarketPrice: aiResult.predictedMarketPrice,
          priceGapPercent: aiResult.priceGapPercent,
          suggestion: aiResult.suggestion,
          changePercent: aiResult.changePercent,
        };

        crop.aiLastUpdated = new Date();
      }

    } catch (aiError) {

      console.error("AI prediction failed:", aiError.message);

    }

    await crop.save();

    res.status(201).json(crop);

  } catch (err) {

    console.error("Error creating crop:", err);

    res.status(500).json({ message: "Server error creating crop" });

  }
});


// FETCH ALL CROPS

router.get("/", async (req, res) => {
  try {
    const crops = await Crop.find().sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching crops" });
  }
});


// FETCH CROPS BY USER ID

router.get("/mycrops/:userId", async (req, res) => {
  try {
    const crops = await Crop.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// FETCH SINGLE CROP

router.get("/:id", async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json(crop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching crop" });
  }
});


// REFRESH AI SNAPSHOT

router.get("/:id/ai-refresh", async (req, res) => {

  try {

    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    const aiRes = await axios.get(
      "https://greenpath-1.onrender.com/predict",
      {
        params: {
          cropType: crop.cropType,
          state: crop.state,
          expectedPricePerKg: crop.expectedPricePerKg
        }
      }
    );

    const aiResult = aiRes.data;

    if (aiResult.success) {

      crop.aiSnapshot = {
        predictedMarketPrice: aiResult.predictedMarketPrice,
        priceGapPercent: aiResult.priceGapPercent,
        suggestion: aiResult.suggestion,
        changePercent: aiResult.changePercent,
      };

      crop.aiLastUpdated = new Date();

      await crop.save();
    }

    res.json({
      message: "AI refreshed successfully",
      crop
    });

  } catch (err) {

    console.error("AI refresh failed:", err.message);

    res.status(500).json({ message: "AI refresh failed" });

  }

});


// UPDATE CROP

router.put("/:id", authMiddleware, upload.array("images"), async (req, res) => {

  try {

    const crop = await Crop.findById(req.params.id);

    if (!crop) return res.status(404).json({ message: "Crop not found" });

    if (crop.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.keys(req.body).forEach((key) => {
      if (!["existingImages", "removedImages"].includes(key)) {
        crop[key] = req.body[key] || crop[key];
      }
    });

    let existingImages = req.body.existingImages || [];
    if (typeof existingImages === "string") existingImages = [existingImages];

    let removedImages = req.body.removedImages || [];
    if (typeof removedImages === "string") removedImages = [removedImages];

    crop.images = crop.images.filter((img) => !removedImages.includes(img));
    crop.images = [...new Set([...crop.images, ...existingImages])];

    if (req.files && req.files.length > 0) {
      crop.images.push(...req.files.map((file) => file.path));
    }

    const updatedCrop = await crop.save();

    res.json(updatedCrop);

  } catch (err) {

    console.error("Error updating crop:", err.message);

    res.status(500).json({ message: "Server error updating crop" });

  }

});


// DELETE CROP

router.delete("/:id", authMiddleware, async (req, res) => {

  try {

    const crop = await Crop.findById(req.params.id);

    if (!crop) return res.status(404).json({ message: "Crop not found" });

    if (crop.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await crop.deleteOne();

    res.json({ message: "Crop deleted successfully" });

  } catch (err) {

    console.error(err);

    res.status(500).json({ message: "Server error deleting crop" });

  }

});

module.exports = router;