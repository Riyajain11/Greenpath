const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    cropType: {
      type: String,
      required: true,
    },
    quantityKg: {
      type: Number,
      required: true,
    },
    expectedPricePerKg: {
      type: Number,
      required: true,
    },

    /*  AI SNAPSHOT */
    aiSnapshot: {
      predictedMarketPrice: {
        type: Number,
      },
      priceGapPercent: {
        type: Number,
      },
      suggestion: {
        type: String,
      },
      changePercent: {
        type: Number,
      },
    },

    aiLastUpdated: {
    type: Date,
    default: null,
   },

    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crops", cropSchema);
