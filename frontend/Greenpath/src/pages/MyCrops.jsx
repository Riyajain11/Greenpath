import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const MyCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndexes, setCurrentIndexes] = useState({});
  const [refreshingId, setRefreshingId] = useState(null);
  const [aiModalCrop, setAiModalCrop] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchCrops = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/crops/mycrops/${user._id}`
      );
      setCrops(res.data);

      const init = {};
      res.data.forEach((c) => (init[c._id] = 0));
      setCurrentIndexes(init);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchCrops();
  }, [user]);

  const handlePrev = (id, total) => {
    setCurrentIndexes((p) => ({
      ...p,
      [id]: (p[id] - 1 + total) % total,
    }));
  };

  const handleNext = (id, total) => {
    setCurrentIndexes((p) => ({
      ...p,
      [id]: (p[id] + 1) % total,
    }));
  };

  const handleRefreshAI = async (cropId) => {
    try {
      setRefreshingId(cropId);
      const res = await axios.get(
        `http://localhost:5000/api/crops/${cropId}/ai-refresh`
      );
      setCrops((prev) =>
        prev.map((c) => (c._id === cropId ? res.data.crop : c))
      );
    } catch {
      alert("Failed to refresh AI");
    } finally {
      setRefreshingId(null);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        {crops.map((crop) => (
          <div
            key={crop._id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
          >
            {/* CLICKABLE CROP AREA */}
            <div
              className="cursor-pointer"
              onClick={() => navigate(`/crop/${crop._id}`)}
            >
              {crop.images?.length > 0 && (
                <div className="relative w-full h-48 mb-3">
                  <img
                   src={
                   crop.images[currentIndexes[crop._id]]?.startsWith("http")
      ? crop.images[currentIndexes[crop._id]]
      : `http://localhost:5000${crop.images[currentIndexes[crop._id]]}`
  }
  alt={crop.cropType}
  className="w-full h-48 object-cover rounded"
/>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev(crop._id, crop.images.length);
                    }}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext(crop._id, crop.images.length);
                    }}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full"
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              )}

              <h3 className="text-xl font-semibold">{crop.cropType}</h3>
              <p><strong>Quantity:</strong> {crop.quantityKg} kg</p>
              <p><strong>Price:</strong> ₹{crop.expectedPricePerKg}/kg</p>
              <p><strong>Location:</strong> {crop.city}, {crop.state}</p>
            </div>

            {/* 🌱 AI SMART PRICE */}
            {crop.aiSnapshot && (
              <div
                className="mt-4 relative group"
                onClick={(e) => {
                  e.stopPropagation();
                  setAiModalCrop(crop); // 📱 mobile tap → modal
                }}
              >
                {/* AI SUMMARY */}
                <div className="p-4 rounded-lg border-2 border-green-500 bg-green-100 flex justify-between items-center cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      🤖 AI: {crop.aiSnapshot.suggestion.split(":")[0]}
                    </p>
                    <p className="text-sm">
                      ₹{crop.aiSnapshot.predictedMarketPrice} / quintal
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefreshAI(crop._id);
                    }}
                    disabled={refreshingId === crop._id}
                    className="text-xs px-2 py-1 rounded border bg-white hover:bg-green-200"
                  >
                    {refreshingId === crop._id ? "..." : "🔄"}
                  </button>
                </div>
                </div>
             
            )}
          </div>
        ))}
      </div>

      {aiModalCrop && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-sm rounded-xl p-5 relative">
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setAiModalCrop(null)}
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-green-700 mb-2">
              🤖 Smart Price Analysis
            </h3>

            <p><strong>Crop:</strong> {aiModalCrop.cropType}</p>
            <p className="mt-2">
              <strong>Predicted:</strong> ₹{aiModalCrop.aiSnapshot.predictedMarketPrice} / quintal
            </p>
            <p>
              <strong>Your Price:</strong> ₹{aiModalCrop.expectedPricePerKg * 100} / quintal
            </p>
            <p>
              <strong>Trend:</strong> {aiModalCrop.aiSnapshot.changePercent}%
            </p>
            <p>
              <strong>Gap:</strong> {aiModalCrop.aiSnapshot.priceGapPercent}%
            </p>

            <span className="inline-block mt-3 px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
              {aiModalCrop.aiSnapshot.suggestion}
            </span>

            <button
              onClick={() => handleRefreshAI(aiModalCrop._id)}
              className="mt-4 w-full py-2 rounded bg-green-600 text-white"
            >
              🔄 Recheck Smart Price
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCrops;

