const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const path = require("path");

router.get("/smart-price", (req, res) => {
  const { cropType, state, expectedPricePerKg } = req.query;

  if (!cropType || !state) {
    return res.status(400).json({
      success: false,
      error: "cropType and state are required",
    });
  }

  const pythonPath = path.join(
    __dirname,
    "..",
    "ai",
    "venv",
    "Scripts",
    "python.exe"
  );

  const pythonScriptPath = path.join(
    __dirname,
    "..",
    "ai",
    "ai_predict.py"
  );

  const daysAhead = 7;

  let command = `"${pythonPath}" "${pythonScriptPath}" "${cropType}" "${state}" ${daysAhead}`;

  if (expectedPricePerKg) {
    command += ` ${expectedPricePerKg}`;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Python execution error:", error);
      return res.status(500).json({
        success: false,
        error: "AI execution failed",
      });
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (err) {
      console.error("JSON parse error:", err);
      console.error("Python output:", stdout);
      res.status(500).json({
        success: false,
        error: "Invalid AI response",
      });
    }
  });
});

module.exports = router;
