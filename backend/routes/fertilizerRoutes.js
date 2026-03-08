const express = require("express");
const router = express.Router();
const Fertilizer = require("../models/Fertilizer");

// get all fertilizers
router.get("/", async (req, res) => {
  const items = await Fertilizer.find();
  res.json(items);
});

// add fertilizer (admin/dev use)
router.post("/", async (req, res) => {
  const item = new Fertilizer(req.body);
  await item.save();
  res.json(item);
});

module.exports = router;
