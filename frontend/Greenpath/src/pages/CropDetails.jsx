import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEdit,
  faTrash,
  faPhone,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";

const CropDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isPublicView = searchParams.get("public") === "true";

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await axios.get(`/api/crops/${id}`);
        setCrop(res.data);
      } catch (err) {
        console.error("Error fetching crop details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [id]);

  const handlePrev = () => {
    if (!crop?.images?.length) return;
    setCurrentIndex((prev) => (prev === 0 ? crop.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!crop?.images?.length) return;
    setCurrentIndex((prev) => (prev === crop.images.length - 1 ? 0 : prev + 1));
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this crop listing?")) {
      try {
        setDeleting(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        await axios.delete(`/api/crops/${crop._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("Crop deleted successfully!");
        navigate("/mycrops");
      } catch (err) {
        console.error("Error deleting crop:", err);
        alert("Failed to delete crop.");
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1f8f4] to-[#e5f0ea] pt-24 p-4 sm:p-6 lg:p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2d6a4f]"></div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-xl font-bold">Crop Not Found</h2>
          <button
            onClick={() => navigate("/mycrops")}
            className="mt-4 px-5 py-2 bg-[#2d6a4f] text-white rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f8f4] to-[#e5f0ea]">
      {/* TOP SPACE BELOW NAVBAR */}
      <div className="h-20"></div>

      <div className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pt-10">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="relative h-64 sm:h-80 md:h-96 bg-[#212529]">
              {crop.images && crop.images.length > 0 ? (
                <>
                  <img
                    src={
                      crop.images[currentIndex].startsWith("http")
                        ? crop.images[currentIndex]
                        : `${crop.images[currentIndex]}`
                    }
                    alt="crop"
                    className="w-full h-full object-cover"
                  />
                  {crop.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 w-9 h-9 rounded-full shadow"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </button>

                      <button
                        onClick={handleNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 w-9 h-9 rounded-full shadow"
                      >
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <FontAwesomeIcon icon={faLeaf} className="text-4xl" />
                </div>
              )}
            </div>

            <div className="p-5">
              <h1 className="text-2xl font-bold">{crop.cropType}</h1>
              <p className="text-sm text-gray-500">
                Listed {new Date(crop.createdAt).toLocaleDateString()}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-semibold">{crop.quantityKg} Kg</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold">₹{crop.expectedPricePerKg}/Kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-5 lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-semibold mb-3 text-green-700">
                Farmer Information
              </h3>
              <p>
                {crop.firstName} {crop.lastName}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                {crop.contact}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {crop.city}, {crop.state}
              </p>
            </div>

            {isPublicView && crop.aiSnapshot && (
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-semibold mb-3 text-green-700">
                  Market Price Analysis
                </h3>

                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      Predicted Market Price
                    </p>
                    <p className="text-lg font-semibold text-green-700">
                      ₹{crop.aiSnapshot.predictedMarketPrice} / quintal
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Farmer Listed Price</p>
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{crop.expectedPricePerKg * 100} / quintal
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isPublicView && (
              <div className="bg-white rounded-xl shadow-md p-5 space-y-3">
                <button
                  onClick={() => navigate(`/edit-crop/${crop._id}`)}
                  className="w-full py-3 border border-[#2d6a4f] rounded-lg text-[#2d6a4f]"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit Listing
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full py-3 bg-red-500 text-white rounded-lg"
                >
                  {deleting ? (
                    "Deleting..."
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Delete Listing
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetails;
