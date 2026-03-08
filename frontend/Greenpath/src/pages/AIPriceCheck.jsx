import { useState } from "react";
import axios from "axios";
import AITrendChart from "../components/AITrendChart";

const AIPriceCheck = () => {
  //  STATE MANAGEMENT

  const [cropType, setCropType] = useState("");
  const [state, setState] = useState("");
  const [expectedPricePerKg, setExpectedPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  //    API CALL

  const handleCheck = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await axios.get("/api/ai/smart-price", {
        params: {
          cropType: cropType.trim().toLowerCase(),
          state: state.trim().toLowerCase(),
          expectedPricePerKg,
        },
      });

      console.log("AI RESPONSE 👉", res.data);

      setResult(res.data);
    } catch (err) {
      console.error("AI ERROR 👉", err);
      setError("AI prediction failed");
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <div className="min-h-screen pt-28 px-3 sm:px-4 md:px-6 bg-green-50 overflow-x-hidden">
      <div className="mb-8 bg-green-100/60 backdrop-blur-md p-6 rounded-xl">
        <p className="text-3xl md:text-3xl font-bold text-green-800 leading-tight text-center mb-10 ">
          Smart Crop Price Prediction
        </p>

        {/* MAIN GRID LAYOUT */}
        <div
          className={`grid gap-8 mt-6 transition-all duration-500

          ${result ? "md:grid-cols-2" : "md:grid-cols-1 justify-center"}`}
        >
          {/* LEFT SIDE – FORM */}
          <div
            className={`bg-white p-6 rounded-xl shadow-md transition-all duration-500
            ${result ? "" : "md:mx-auto md:max-w-xl"}`}
          >
            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="Crop Type (Wheat / Rice)"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
            />

            <input
              className="w-full p-2 border rounded mb-3"
              placeholder="State (Madhya Pradesh)"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />

            <input
              type="number"
              className="w-full p-2 border rounded mb-4"
              placeholder="Expected Price (₹/kg)"
              value={expectedPricePerKg}
              onChange={(e) => setExpectedPrice(e.target.value)}
            />

            <button
              onClick={handleCheck}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              {loading ? "Checking..." : "Check AI Price"}
            </button>

            {error && <p className="text-red-600 mt-3">{error}</p>}

            {/* RESULT SUMMARY */}
            {result?.success && (
              <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-300 animate-fadeIn ">
                <h2 className="text-lg font-bold text-green-700 mb-2">
                  {result.suggestion}
                </h2>

                <p>
                  <strong>Market Price:</strong> ₹{result.predictedMarketPrice}{" "}
                  / quintal
                </p>

                <p>
                  <strong>Trend:</strong> {result.changePercent}%
                </p>

                <p>
                  <strong>Price Gap:</strong> {result.priceGapPercent}%
                </p>
              </div>
            )}
          </div>

          {/* RIGHT SIDE – CHART */}
          {result?.success && (
            <div className="bg-white p-6 rounded-xl shadow-md animate-fadeIn">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                📈 Market Trend Analysis
              </h3>

              <AITrendChart data={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPriceCheck;
