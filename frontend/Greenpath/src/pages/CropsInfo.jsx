import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faArrowLeft,
  faArrowRight,
  faUser,
  faPhone,
  faSeedling,
  faSearch,
  faFilter,
  faEye,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function CropsInfo() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const API_BASE = "/api/crops";

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_BASE);
        setCrops(res.data || []);
      } catch (err) {
        console.error("Error fetching crops:", err);
        setCrops([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  const handleNext = (cropId, total) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [cropId]: prev[cropId] === undefined ? 1 : (prev[cropId] + 1) % total,
    }));
  };

  const handlePrev = (cropId, total) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [cropId]:
        prev[cropId] === undefined
          ? total - 1
          : (prev[cropId] - 1 + total) % total,
    }));
  };

  // Filter crops based on search term and state
  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.cropType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.state?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState =
      !filterState || crop.state?.toLowerCase() === filterState.toLowerCase();
    return matchesSearch && matchesState;
  });

  // Sort crops
  const sortedCrops = [...filteredCrops].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "price-low") {
      return (a.expectedPricePerKg || 0) - (b.expectedPricePerKg || 0);
    } else if (sortBy === "price-high") {
      return (b.expectedPricePerKg || 0) - (a.expectedPricePerKg || 0);
    }
    return 0;
  });

  // Get unique states for filter dropdown
  const states = [...new Set(crops.map((crop) => crop.state).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5b8c5a] mx-auto"></div>
          <p className="mt-4 text-[#5b8c5a]">Loading fresh crops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf7] pt-28 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-3xl font-semibold text-[#2d5a4f]">
            🌾 Explore Available Crops
          </h1>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl p-4 mb-8 shadow-sm border border-[#e0ebe0]">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-[#88aa85]" />
              </div>
              <input
                type="text"
                placeholder="Search crops, locations, farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#c8d9c7] rounded-lg focus:ring-2 focus:ring-[#5b8c5a] focus:border-[#5b8c5a] text-[#2d5a4f]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faFilter} className="text-[#88aa85]" />
                </div>
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#c8d9c7] rounded-lg focus:ring-2 focus:ring-[#5b8c5a] focus:border-[#5b8c5a] text-[#2d5a4f] appearance-none"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 border border-[#c8d9c7] rounded-lg focus:ring-2 focus:ring-[#5b8c5a] focus:border-[#5b8c5a] text-[#2d5a4f] appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {sortedCrops.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-[#e0ebe0]">
            <div className="w-20 h-20 bg-[#e9f3e8] rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faSeedling}
                className="text-[#5b8c5a] text-2xl"
              />
            </div>
            <h3 className="text-xl font-medium text-[#2d5a4f] mb-2">
              No crops found
            </h3>
            <p className="text-[#5b8c5a] max-w-md mx-auto">
              {searchTerm || filterState
                ? "Try adjusting your search or filter criteria"
                : "No crops are currently available. Check back later for fresh produce!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCrops.map((crop) => {
              const title = crop.cropType || crop.cropName || "Unknown Crop";
              const city = crop.city ?? "";
              const state = crop.state ?? "";
              const farmer =
                crop.firstName || crop.lastName
                  ? `${crop.firstName ?? ""} ${crop.lastName ?? ""}`
                  : (crop.farmerName ?? crop.user?.name ?? "Farmer");
              const contact = crop.contact ?? "";

              const imageUrls = (crop.images || [])
                .map((img) => {
                  if (!img) return null;

                  // If already full URL
                  if (img.startsWith("http")) return img;

                  // For local uploads
                  return `${img}`;
                })
                .filter(Boolean);

              const currentIndex = currentImageIndex[crop._id] || 0;

              return (
                <div
                  key={crop._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#e0ebe0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image section */}
                  <div className="relative h-56 bg-[#f0f7ef] overflow-hidden">
                    {imageUrls.length > 0 ? (
                      <img
                        src={imageUrls[currentIndex]}
                        alt={`${title} ${currentIndex + 1}`}
                        className="w-full h-56 object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faSeedling}
                          className="text-[#c8d9c7] text-4xl"
                        />
                      </div>
                    )}

                    {/* Navigation arrows */}
                    {imageUrls.length > 1 && (
                      <>
                        <button
                          onClick={() => handlePrev(crop._id, imageUrls.length)}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 text-[#5b8c5a] rounded-full p-2 hover:bg-white transition-colors"
                        >
                          <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <button
                          onClick={() => handleNext(crop._id, imageUrls.length)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 text-[#5b8c5a] rounded-full p-2 hover:bg-white transition-colors"
                        >
                          <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                      </>
                    )}

                    {/* Image indicators */}
                    {imageUrls.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {imageUrls.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-white" : "bg-white/50"}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Price badge */}
                    {crop.expectedPricePerKg && (
                      <div className="absolute top-3 left-3 bg-[#5b8c5a] text-white text-sm font-medium px-2 py-1 rounded">
                        ₹{crop.expectedPricePerKg}/kg
                      </div>
                    )}

                    {/* New badge */}
                    {new Date(crop.createdAt) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                      <div className="absolute top-3 right-3 bg-[#e9f3e8] text-[#5b8c5a] text-xs font-medium px-2 py-1 rounded">
                        New
                      </div>
                    )}
                  </div>

                  {/* Crop details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-[#2d5a4f]">
                        {title}
                      </h3>
                      {crop.quantityKg && (
                        <span className="bg-[#e9f3e8] text-[#5b8c5a] text-xs font-medium px-2 py-1 rounded-full">
                          {crop.quantityKg} kg
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-[#5b8c5a] text-sm">
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        <span>{farmer}</span>
                      </div>

                      <div className="flex items-center text-[#5b8c5a] text-sm">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="mr-2"
                        />
                        <span>
                          {city}
                          {city && state ? ", " : ""}
                          {state}
                        </span>
                      </div>

                      {contact && (
                        <div className="flex items-center text-[#5b8c5a] text-sm">
                          <FontAwesomeIcon icon={faPhone} className="mr-2" />
                          <span>{contact}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-[#e0ebe0]">
                      {crop.createdAt && (
                        <span className="text-xs text-[#88aa85]">
                          Listed {new Date(crop.createdAt).toLocaleDateString()}
                        </span>
                      )}
                      <button
                        onClick={() =>
                          navigate(`/crop/${crop._id}?public=true`)
                        }
                        className="text-[#5b8c5a] hover:text-[#2d5a4f] text-sm font-medium flex items-center"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        {sortedCrops.length > 0 && (
          <div className="mt-8 text-center text-[#5b8c5a]">
            Showing {sortedCrops.length} of {crops.length} crops
          </div>
        )}
      </div>
    </div>
  );
}
