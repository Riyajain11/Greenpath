require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");

const User = require("./models/User");
const Crops = require("./models/Crops");

const MONGO_URI = process.env.MONGO_URI;

/* ===============================
   HELPER FUNCTIONS
=================================*/

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/* ===============================
   GRAIN-HEAVY DISTRIBUTION
=================================*/

const grainCrops = [
  "Rice",
  "Wheat",
  "Maize",
  "Barley",
  "Bajra",
  "Jowar",
  "Mustard",
  "Soybean",
  "Groundnut",
];

const vegFruit = ["Tomato", "Onion", "Mango"];

function getRandomCrop() {
  if (Math.random() < 0.8) {
    return randomFrom(grainCrops);
  }
  return randomFrom(vegFruit);
}

/* ===============================
   STATES & CITIES
=================================*/

const statesWithCities = {
  "Madhya Pradesh": ["Bhopal", "Indore"],
  Punjab: ["Ludhiana", "Chandigarh"],
  Maharashtra: ["Pune", "Nagpur"],
  Rajasthan: ["Jaipur", "Kota"],
  "Uttar Pradesh": ["Lucknow", "Kanpur"],
  Haryana: ["Gurgaon", "Hisar"],
  Gujarat: ["Ahmedabad", "Surat"],
  Bihar: ["Patna", "Gaya"],
};

/* ===============================
   LOCAL IMAGE POOL
=================================*/

const cropImages = {
  Bajra: ["/uploads/ai-crops/Bajra.jpg", "/uploads/ai-crops/Bajra2.jpeg"],
  Barley: ["/uploads/ai-crops/Barley.jpg", "/uploads/ai-crops/Barley2.jpg"],
  Groundnut: [
    "/uploads/ai-crops/Groundnut1.jpg",
    "/uploads/ai-crops/Groundnut2.jpg",
  ],
  Jowar: ["/uploads/ai-crops/Jowar1.jpg", "/uploads/ai-crops/Jowar2.jpg"],
  Maize: ["/uploads/ai-crops/Maize.png", "/uploads/ai-crops/Maize2.png"],
  Mango: ["/uploads/ai-crops/Mango.jpg", "/uploads/ai-crops/Mango2.jpg"],
  Mustard: ["/uploads/ai-crops/Mustard1.jpg", "/uploads/ai-crops/Mustard2.jpg"],
  Onion: ["/uploads/ai-crops/Onion.jpg", "/uploads/ai-crops/Onion2.jpg"],
  Soybean: [
    "/uploads/ai-crops/SoyaBean1.jpg",
    "/uploads/ai-crops/SoyaBean2.jpg",
  ],
  Tomato: ["/uploads/ai-crops/Tomato.jpg", "/uploads/ai-crops/Tomato2.jpg"],
  Rice: ["/uploads/ai-crops/Rice1.jpg", "/uploads/ai-crops/Rice2.jpg"],
  Wheat: ["/uploads/ai-crops/Wheat1.jpg", "/uploads/ai-crops/Wheat2.jpg"],
};

/* ===============================
   MAIN SEED FUNCTION
=================================*/

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Seeding database...");

    await User.deleteMany();
    await Crops.deleteMany();

    /* ===============================
       CREATE USERS
    =================================*/

    const users = [];

    for (let i = 1; i <= 8; i++) {
      const user = await User.create({
        name: `Farmer ${i}`,
        email: `farmer${i}@gmail.com`,
        password: "123456",
        phone: `98765432${10 + i}`,
        aadhar: `1234123412${10 + i}`,
      });

      users.push(user);
    }

    /* ===============================
       CREATE 30 CROPS
    =================================*/

    for (let i = 0; i < 30; i++) {
      const cropType = getRandomCrop();
      const state = randomFrom(Object.keys(statesWithCities));
      const city = randomFrom(statesWithCities[state]);
      const user = randomFrom(users);

      const quantityKg = Math.floor(Math.random() * 800) + 100;
      const expectedPricePerKg = Math.floor(Math.random() * 50) + 20;

      /* ===============================
         RANDOM 2–3 IMAGES
      =================================*/
      let images = [];

      if (cropImages[cropType]) {
        const availableImages = [...cropImages[cropType]]; // copy array

        // shuffle images
        availableImages.sort(() => 0.5 - Math.random());

        // pick 2 or 3 but not more than available
        const imageCount = Math.min(
          Math.random() < 0.5 ? 2 : 3,
          availableImages.length,
        );

        images = availableImages.slice(0, imageCount);
      }

      /* ===============================
         CALL AI API
      =================================*/

      let aiSnapshot = null;

      try {
        const aiRes = await axios.get("/api/ai/smart-price", {
          params: {
            cropType: cropType.toLowerCase(),
            state: state.toLowerCase(),
            expectedPricePerKg,
          },
        });

        if (aiRes.data?.success) {
          aiSnapshot = {
            predictedMarketPrice: aiRes.data.predictedMarketPrice,
            priceGapPercent: aiRes.data.priceGapPercent,
            suggestion: aiRes.data.suggestion,
            changePercent: aiRes.data.changePercent,
          };
        }
      } catch (err) {
        console.log("AI ERROR:", err.message);
      }

      await Crops.create({
        user: user._id,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ")[1] || "Singh",
        contact: user.phone,
        dob: new Date("1995-05-15"),

        cropType,
        quantityKg,
        expectedPricePerKg,

        state,
        city,

        images,
        aiSnapshot,
        aiLastUpdated: new Date(),
      });
    }

    console.log("Database seeded successfully 🚀");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
