import React, { useState } from "react";
import axios from "axios";
import "../styles/CropForm.css";
import { useNavigate } from "react-router-dom";

const CropForm = () => {
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
    user: JSON.parse(localStorage.getItem("user"))?._id || "",
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

  const [images, setImages] = useState([]); //multiple images

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      setImages([...images, ...Array.from(files)]); // add instead of replace
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      images.forEach((file) => {
        data.append("images", file);
      });

      const res = await axios.post(
        "http://localhost:5000/api/crops",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Upload success:", res.data);
      alert("Crop submitted successfully!");
      navigate("/crops-info");
    }

    catch (err) {
      console.error("Error submitting crop:", err);
      if (err.response) {
        console.error("Server responded with:", err.response.data);
      }
      alert("Failed to submit. Please check the console for details.");
    }
  };

  return (
    <div className="crop-form-container bg-gradient-to-br from-green-50 to-green-75">
      <div
        className="crop-form-hero"
        style={{ backgroundImage: `url('/farmers-hero.jpg')` }}
      >
        <div className="form-wrapper">
          <h1 className="crop-form-title">Submit Your Crops</h1>
        </div>
      </div>

      <div className="crop-form-card">
        <form
          className="form-grid"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="form-group">
            <label>First Name</label>
            <input name="firstName" type="text" placeholder="First Name" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input name="lastName" type="text" placeholder="Last Name" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input name="contact" type="text" placeholder="e.g., 9876543210" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input name="dob" type="date" onChange={handleChange} required />
          </div>

          <div className="form-group full-width">
            <label>Crop Type</label>
            <input name="cropType" type="text" placeholder="e.g., Wheat, Rice" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Quantity (in KG)</label>
            <input name="quantityKg" type="number" placeholder="e.g., 500" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Expected Price per KG (₹)</label>
            <input name="expectedPricePerKg" type="number" placeholder="e.g., 20" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>State</label>
            <input name="state" type="text" placeholder="e.g., Maharashtra" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>City</label>
            <input name="city" type="text" placeholder="e.g., Nagpur" onChange={handleChange} required />
          </div>

          <div className="form-group full-width">
            <label>Upload Crop Images</label>
            <input
              name="images"
              type="file"
              accept="image/*"
              multiple // allow multiple uploads
              onChange={handleChange}
              required
            />
          </div>

          {/* Optional: preview selected images */}
          {images.length > 0 && (
            <div className="form-group full-width">
              <label>Selected Images:</label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="form-group full-width">
            <button type="submit">Submit Crop Details</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CropForm;
