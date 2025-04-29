import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    purpose: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/users', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setMessage(response.data.message);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem("purpose", formData.purpose);
      navigate('/dashboard');
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* ECG Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path 
            d="M0,10 Q5,5 10,10 T20,10 T30,5 T40,15 T50,10 T60,12 T70,8 T80,15 T90,5 T100,10" 
            stroke="rgba(59, 130, 246, 0.5)" 
            strokeWidth="0.3"
            fill="none"
            strokeDasharray="2 2"
          >
            <animate attributeName="stroke-dashoffset" values="0;10" dur="10s" repeatCount="indefinite" />
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
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 text-transparent bg-clip-text">
            Ghumi Ghumi
          </h1>
                </div>
                <p className="text-xl text-gray-800 font-medium mb-8">
                  Discover the World, One Adventure at a Time
                </p>
                <motion.div 
        className="mt-12 flex justify-center space-x-8"
        variants={itemVariants}
      >
        <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
        <div className="w-8 h-1 bg-purple-600 rounded-full"></div>
        <div className="w-4 h-1 bg-pink-600 rounded-full"></div>
      </motion.div>
              </motion.div>
            </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 relative z-10"
      >
        <div className="text-center mb-2 mt-4 p-4">
          <h2 className="text-3xl font-bold text-blue-600 mb-2">Create Your Account</h2>
          <p className="mt-2 opacity-90">Join CardioScan AI for advanced ECG analysis</p>
        </div>

        <form onSubmit={handleSignup} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-600 mb-1">Purpose of Use</label>
            <select
              id="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
              required
            >
              <option value="" disabled>Select your purpose</option>
              <option value="personal">Personal Health Tracking</option>
              <option value="professional">Medical Professional</option>
              <option value="research">Research/Academic</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-md"
          >
            Get Started
          </motion.button>
        </form>

        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">Sign in</Link>
          </p>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mx-6 mb-6 p-3 rounded-md text-center ${
              isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full h-1/3 flex justify-center items-end pointer-events-none opacity-40">
        <svg className="h-full w-full" viewBox="0 0 500 50" preserveAspectRatio="none">
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

export default Signup;
