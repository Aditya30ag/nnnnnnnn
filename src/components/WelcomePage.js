import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StyledMapContainer from './Map';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFeature, setActiveFeature] = useState(0);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Feature rotation effect
  useEffect(() => {
    if (isLoaded) {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoaded]);

  // Simulated loading state
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  // Features with icons
  const features = [
    {
      icon: "fas fa-globe-americas",
      title: "Discover Destinations",
      description: "Explore handpicked destinations from around the world",
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: "fas fa-map-marked-alt",
      title: "Trip Planner",
      description: "Plan your perfect journey with our AI-powered itinerary builder",
      color: "bg-green-100 text-green-700"
    },
    {
      icon: "fas fa-hotel",
      title: "Accommodation Finder",
      description: "Find the best places to stay that match your budget and style",
      color: "bg-yellow-100 text-yellow-700"
    },
    {
      icon: "fas fa-camera",
      title: "Immersive Experiences",
      description: "Discover unique activities and authentic local experiences",
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: "fas fa-utensils",
      title: "Culinary Adventures",
      description: "Explore local cuisines and must-try dishes at each destination",
      color: "bg-red-100 text-red-700"
    },
    {
      icon: "fas fa-suitcase",
      title: "Travel Guides",
      description: "Comprehensive guides and tips from experienced travelers",
      color: "bg-teal-100 text-teal-700"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 overflow-hidden relative">
      {/* Dynamic background elements - Travel-themed animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated world map lines */}
        <div className="absolute w-full h-full opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path 
              d="M0,10 L10,8 L20,12 L30,9 L40,11 L50,8 L60,12 L70,7 L80,13 L90,10 L100,9" 
              stroke="rgba(59, 130, 246, 0.8)"
              strokeWidth="0.5"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <animate 
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur="10s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
        
        {/* Floating travel icons */}
        {[...Array(15)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute text-blue-600"
            style={{
              fontSize: `${Math.random() * 25 + 10}px`,
              top: `${Math.random() * 90 + 5}%`,
              left: `${Math.random() * 90 + 5}%`,
              opacity: Math.random() * 0.2 + 0.1,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          >
            <i className={`fas fa-${['plane', 'mountain', 'map-marker-alt', 'compass', 'ship'][Math.floor(Math.random() * 5)]}`}></i>
          </motion.div>
        ))}
        
        {/* Wave animation for travel theme */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-64 h-64 rounded-full bg-blue-500 opacity-5"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
      <div className='w-20 h-100' style={{backgroundImage:"url(./image.png)", backgroundSize:"cover", backgroundPosition:"center", backgroundRepeat:"no-repeat"}}></div>
      {/* Header with time and date */}
      <div className="absolute top-4 right-4 flex items-center text-sm text-gray-700 font-medium z-20 border-b border-gray-300 pb-2 px-4 space-x-4">
        <nav className="flex space-x-6">
          <a href="/" className="hover:text-black">Home</a>
          <a href="/login" className="hover:text-black">Login</a>
          <a href="#" className="hover:text-black">Settings</a>
        </nav>
        <span className="border-l border-gray-400 h-4"></span>
        <div>
          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          <span className="mx-2">•</span>
          {currentTime.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
        </div>
      </div>

      <div className="flex flex-col min-h-screen justify-center items-center p-4 relative z-10">
        <motion.div 
          className="w-full max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Hero section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="text-center mb-12"
          >
            <motion.div variants={itemVariants}>
              {/* Logo and Title */}
              <div className="flex justify-center items-center mb-4">
                <img src="/logo (1).png" alt="Logo" className="w-16 h-16 mr-4" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 text-transparent bg-clip-text">
            Ghumi Ghumi
          </h1>
              </div>
              <p className="text-xl text-gray-800 font-medium mb-8">Discover the World, One Adventure at a Time</p>
              
            </motion.div>
          </motion.div>

          {/* Main content layout */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16">
            {/* Left side: Dynamic feature highlight */}
            <motion.div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              <div className="h-64 flex items-center justify-center">
                {features.map((feature, index) => (
                  index === activeFeature && (
                    <motion.div
                      key={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={featureVariants}
                      transition={{ duration: 0.5 }}
                      className={`p-6 rounded-2xl shadow-lg ${feature.color} w-full max-w-md mx-auto text-center`}
                    >
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 mx-auto shadow-sm">
                        <i className={`${feature.icon} text-2xl ${feature.color.replace('bg-', 'text-').split(' ')[0]}`}></i>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-800 font-medium">{feature.description}</p>
                    </motion.div>
                  )
                ))}
              </div>
              <motion.div 
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
              <i className="fas fa-play-circle mr-2"></i>
              <button onClick={() => navigate('/virtual-tour')} className="hover:underline">
                Take a virtual tour
              </button>
            </div>
          </motion.div>
            </motion.div>

            {/* Right side: Features grid */}
            <motion.div 
              variants={containerVariants}
              className="w-full lg:w-1/2 grid grid-cols-2 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}
                  className={`feature-card bg-white border border-gray-200 rounded-xl p-4 shadow-md transition-all duration-300 h-full flex flex-col`}
                >
                  <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-3 mx-auto shadow-inner`}>
                    <i className={`${feature.icon} text-lg`}></i>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 text-center">{feature.title}</h3>
                  <p className="text-sm text-gray-800 text-center mt-auto">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Call to action */}
          <motion.div 
            variants={containerVariants}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-4"
          >
            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/explore')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
            >
              Explore Destinations
              <i className="fas fa-globe ml-2"></i>
            </motion.button>
            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-white border border-gray-300 text-gray-800 font-bold rounded-lg shadow-md hover:shadow-lg hover:border-green-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
            >
              Plan Your Trip
              <i className="fas fa-map-marked-alt ml-2"></i>
            </motion.button>
            
          </motion.div>
          
          {/* Demo section */}
          
        </motion.div>
      </div>

      {/* Mountain range visualization at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-206 flex justify-center items-end pointer-events-none opacity-40">
        <svg className="h-full w-full" viewBox="0 0 500 50" preserveAspectRatio="none">
          <path 
            d="M0,50 L0,35 L50,25 L70,40 L100,20 L130,30 L160,15 L190,35 L220,25 L250,5 L280,25 L310,15 L340,30 L370,20 L400,40 L430,25 L460,35 L490,15 L500,35 L500,50 Z" 
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgba(59, 130, 246, 0.8)"
            strokeWidth="1"
          >
          </path>
        </svg>
      </div>

    </div>
  );
};

export default WelcomePage;