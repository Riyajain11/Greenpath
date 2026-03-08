import React, { useState, useEffect } from "react";
import axios from "axios";

const Fertilizers = () => {
  const [fertilizers, setFertilizers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==============================
     STATES
  ============================== */

  const [search, setSearch] = useState("");
  const [showAdvisor, setShowAdvisor] = useState(false);

  const [cropType, setCropType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [growthStage, setGrowthStage] = useState("");
  const [advisorResult, setAdvisorResult] = useState(null);
  const [selectedFertilizer, setSelectedFertilizer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  useEffect(() => {
    const fetchFertilizers = async () => {
      try {
        const res = await axios.get("/api/fertilizers");
        setFertilizers(res.data);
      } catch (err) {
        console.error("Error fetching fertilizers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFertilizers();
  }, []);

  /* ==============================
     FILTER
  ============================== */

  const filtered = fertilizers.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase()),
  );

  /* ==============================
     SMART ADVISOR LOGIC
  ============================== */

  const getAdvice = () => {
    let recommendation = "NPK Mix";

    if (cropType.toLowerCase().includes("wheat"))
      recommendation = "Urea Fertilizer";

    if (cropType.toLowerCase().includes("rice"))
      recommendation = "DAP Fertilizer";

    setAdvisorResult({
      fertilizer: recommendation,
      reason: "Based on crop nutrient requirement analysis",
      timing: `Best during ${growthStage} stage`,
    });
  };

  const clearAdvisor = () => {
    setCropType("");
    setSoilType("");
    setGrowthStage("");
    setAdvisorResult(null);
  };
  const handleBuy = async (fertilizer) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Please login first");
        return;
      }

      const res = await axios.post("/api/orders/create", {
        fertilizerId: fertilizer._id,
        userId: user._id,
      });

      setSelectedFertilizer(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create order");
    }
  };

  const confirmPayment = async () => {
    try {
      const res = await axios.post("/api/orders/confirm", {
        orderId: selectedFertilizer._id,
        paymentMethod,
      });

      if (res.data.success) {
        alert("Payment Successful!");
        setSelectedFertilizer(null);
      }
    } catch (err) {
      alert("Payment failed");
    }
  };
  /* ==============================
     UI
  ============================== */

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-3">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 md:p-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* LEFT TEXT */}
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-green-800">
              🌱 Fertilizers
            </h1>

            <p className="text-green-700 text-sm hidden md:block">
              Buy fertilizers or use smart advisor for recommendations
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setShowAdvisor(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 self-start md:self-auto"
          >
            ⭐ Advisor
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white border border-green-200 rounded-xl px-4 py-4 mb-6 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search fertilizers..."
          className="w-full px-4 py-2 rounded-lg
    border border-green-300
    bg-green-50
    focus:outline-none
    focus:ring-2
    focus:ring-green-500
    transition-all"
        />
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center p-4">
              <img
                src={`${item.image}`}
                alt={item.name}
                className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>

              <p className="text-sm text-gray-600">NPK: {item.npk}</p>

              <p className="text-sm text-gray-600">📍 {item.location}</p>

              <p className="text-xl font-bold mt-2">₹{item.price}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleBuy(item)}
                  className="flex-1 bg-green-600 text-white py-2 rounded"
                >
                  💳 Buy Now
                </button>
                <button className="flex-1 border border-green-600 text-green-700 py-2 rounded">
                  📍 Pickup
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SMART ADVISOR MODAL */}

      {showAdvisor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              🤖 Smart Fertilizer Advisor
            </h2>

            <input
              placeholder="Crop type"
              className="w-full border p-2 mb-3"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
            />

            <input
              placeholder="Soil type"
              className="w-full border p-2 mb-3"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
            />

            <input
              placeholder="Growth stage"
              className="w-full border p-2 mb-3"
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
            />

            <button
              onClick={getAdvice}
              className="w-full bg-green-600 text-white py-2 rounded mb-3"
            >
              Get Recommendation
            </button>

            {advisorResult && (
              <div className="bg-green-50 border border-green-400 p-3 rounded mb-3">
                ⭐ Recommended: {advisorResult.fertilizer}
                <br />
                🧪 {advisorResult.reason}
                <br />⏱ {advisorResult.timing}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowAdvisor(false)}
                className="flex-1 border py-2 rounded"
              >
                Close
              </button>

              <button
                onClick={clearAdvisor}
                className="flex-1 border border-red-400 text-red-600 py-2 rounded"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedFertilizer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="bg-green-700 text-white p-4 flex justify-between items-center">
              <h2 className="font-semibold text-lg">🔒 Secure Checkout</h2>
              <button
                onClick={() => setSelectedFertilizer(null)}
                className="text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-6">
              {/* ORDER SUMMARY */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-5">
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-semibold">
                  {selectedFertilizer.fertilizer?.name || "Fertilizer"}
                </p>

                <p className="mt-3 text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-green-700">
                  ₹{selectedFertilizer.amount}
                </p>
              </div>

              {/* PAYMENT METHOD TABS */}
              <div className="flex gap-2 mb-4">
                {["UPI", "CARD", "COD"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex-1 py-2 rounded-lg border ${
                      paymentMethod === method
                        ? "bg-green-700 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {/* UPI INPUT */}
              {paymentMethod === "UPI" && (
                <input
                  placeholder="Enter UPI ID (example@upi)"
                  className="border w-full p-3 rounded-lg mb-4 focus:ring-2 focus:ring-green-500"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              )}

              {/* CARD INPUT */}
              {paymentMethod === "CARD" && (
                <input
                  placeholder="Card Number (xxxx xxxx xxxx xxxx)"
                  className="border w-full p-3 rounded-lg mb-4 focus:ring-2 focus:ring-green-500"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              )}

              {/* COD MESSAGE */}
              {paymentMethod === "COD" && (
                <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg mb-4 text-sm">
                  You will pay at the time of delivery.
                </div>
              )}

              {/* PAY BUTTON */}
              <button
                onClick={confirmPayment}
                className="bg-green-700 hover:bg-green-800 transition text-white w-full py-3 rounded-lg font-semibold"
              >
                Pay ₹{selectedFertilizer.amount}
              </button>

              {/* FOOTER SECURITY TEXT */}
              <p className="text-xs text-gray-500 text-center mt-4">
                🔐 Your payment information is securely processed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fertilizers;
