import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [errorMsg, setErrorMsg]   = useState("");
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = axios.post("/api/users/login",
        {
        email: formData.emailOrPhone,
        password: formData.password,
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      alert(" Login successful!");
      navigate("/");          
    } catch (err) {
      const msg = err.response?.data?.message || "Server error";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white shadow-lg rounded-3xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Login</h2>

        {errorMsg && (
          <p className="text-red-600 text-center font-medium mb-4">{errorMsg}</p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email or Phone</label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-2xl px-4 py-2 focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-2xl font-semibold transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-700 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
