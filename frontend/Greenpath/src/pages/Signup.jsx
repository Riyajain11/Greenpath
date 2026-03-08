import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [flash, setFlash] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill all fields.");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("/api/users/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        aadhar: form.aadhar,
        password: form.password,
      });

      alert("✅ Signup successful!");
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      console.error("❌ Signup error:", err);
      alert(
        "Signup failed: " + (err.response?.data?.message || "Check console"),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-10 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 35 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-xl"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Sign Up
        </h2>

        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 text-center font-medium mb-4"
          >
            {flash}
          </motion.div>
        )}

        <form onSubmit={step === 1 ? handleNext : handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="9876543210"
                  required
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-2xl font-semibold transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 mb-1">
                  Aadhar Number
                </label>
                <input
                  name="aadhar"
                  type="text"
                  value={form.aadhar}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="1234-5678-9012"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 py-2 px-6 rounded-2xl font-semibold transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-2xl font-semibold transition"
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-700 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
