import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, LogIn } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ECG line effect */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
        >
          <path
            d="M0,10 Q5,5 10,10 T20,10 T30,5 T40,15 T50,10 T60,12 T70,8 T80,15 T90,5 T100,10"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="0.3"
            fill="none"
            strokeDasharray="2 2"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;10"
              dur="10s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        className="text-center mr-12"
      >
        <motion.div>
          {/* Logo and Title */}
          <div className="flex justify-center items-center mb-4">
            <img src="/logo (1).png" alt="Logo" className="w-16 h-16 mr-4" />
            <h1 className="text-5xl font-bold text-blue-600">Ghumi Ghumi</h1>
          </div>
          <p className="text-xl text-gray-800 font-medium mb-8">
            Discover the World, One Adventure at a Time
          </p>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 relative z-10"
      >
        {/* Header with gradient */}
        <div className="text-center mb-2 mt-4 p-4">
          <h2 className="text-3xl font-bold text-blue-600 mb-2">
            Welcome Back
          </h2>
          <p className="mt-2 opacity-90">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-70"
          >
            <div>{loading ? "Signing in..." : "Sign In"}</div>
          </motion.button>
        </form>

        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-1/3 flex justify-center items-end pointer-events-none opacity-40">
        <svg
          className="h-full w-full"
          viewBox="0 0 500 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 L0,35 L50,25 L70,40 L100,20 L130,30 L160,15 L190,35 L220,25 L250,5 L280,25 L310,15 L340,30 L370,20 L400,40 L430,25 L460,35 L490,15 L500,35 L500,50 Z"
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgba(59, 130, 246, 0.8)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
};

export default Login;
