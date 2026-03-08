import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditCrop = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    dob: "",
    cropType: "",
    quantityKg: "",
    expectedPricePerKg: "",
    state: "",
    city: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch crop data
  useEffect(() => {
    const fetchCrop = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/crops/${id}`);
        setFormData({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          contact: res.data.contact,
          dob: res.data.dob,
          cropType: res.data.cropType,
          quantityKg: res.data.quantityKg,
          expectedPricePerKg: res.data.expectedPricePerKg,
          state: res.data.state,
          city: res.data.city,
        });
        setExistingImages(res.data.images || []);
      } catch (err) {
        console.error("Error fetching crop:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCrop();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setImages([...images, ...Array.from(files)]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemoveExistingImage = (img) => {
    setRemovedImages([...removedImages, img]);
    setExistingImages(existingImages.filter((i) => i !== img));
  };

  const handleRemoveNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      existingImages.forEach((img) => {
        data.append("existingImages", img);
      });

      images.forEach((file) => {
        data.append("images", file);
      });

      removedImages.forEach((img) => {
        data.append("removedImages", img);
      });

      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const res = await axios.put(`/api/crops/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Update success:", res.data);
      alert("Crop updated successfully!");
      navigate(`/crop/${id}`);
    } catch (err) {
      console.error("Error updating crop:", err);
      alert("Failed to update crop. Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-6 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6 h-44 sm:h-64">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('/farmers-hero.jpg')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 to-green-800/60"></div>
          </div>
          <div className="relative flex items-center justify-center h-full text-center px-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">
                Edit Crop Details
              </h1>
              <p className="text-sm sm:text-lg text-emerald-100 mt-2">
                Update your crop information to connect with buyers
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-10">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="p-4 sm:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Personal Info */}
              <div className="md:col-span-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">
                  Personal Information
                </h2>
              </div>

              {["firstName", "lastName", "contact"].map((field) => (
                <div key={field}>
                  <label className="text-sm text-gray-600 capitalize">
                    {field === "contact"
                      ? "Contact Number"
                      : field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    name={field}
                    type="text"
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm text-gray-600">Date of Birth</label>
                <input
                  name="dob"
                  type="date"
                  value={formData.dob ? formData.dob.substring(0, 10) : ""}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Crop Info */}
              <div className="md:col-span-2 mt-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b pb-2">
                  Crop Information
                </h2>
              </div>

              <input
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                required
                placeholder="Crop Type"
                className="md:col-span-2 mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />

              <input
                name="quantityKg"
                type="number"
                value={formData.quantityKg}
                onChange={handleChange}
                required
                placeholder="Quantity (KG)"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />

              <input
                name="expectedPricePerKg"
                type="number"
                value={formData.expectedPricePerKg}
                onChange={handleChange}
                required
                placeholder="Expected Price ₹"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />

              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="State"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="City"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Existing Images
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        alt="crop"
                        className="w-full h-36 sm:h-40 object-cover rounded-lg shadow"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
                        onClick={() => handleRemoveExistingImage(img)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Preview */}
            {images.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  New Images Preview
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-full h-36 sm:h-40 object-cover rounded-lg shadow"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
                        onClick={() => handleRemoveNewImage(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Add More Images
              </h2>
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <input
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow hover:shadow-lg transition"
              >
                {isLoading ? "Updating..." : "Update Crop Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCrop;
