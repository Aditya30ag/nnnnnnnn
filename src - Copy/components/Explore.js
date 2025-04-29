import React, { useState, useEffect } from 'react';
import StyledMapContainer from './Map';
import { FaCompass, FaSearch, FaFilter, FaMapMarkerAlt, FaStar, FaRegStar, FaDirections } from 'react-icons/fa';
import { MdCategory, MdAccessTime, MdPhone } from 'react-icons/md';

// Mock data for nearby places
const nearbyPlaces = [
  {
    id: 1,
    name: "Central Park Cafe",
    address: "123 Park Avenue, New York",
    distance: "0.5 miles",
    rating: 4.7,
    reviews: 128,
    category: "Cafe",
    openNow: true,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "Urban Art Gallery",
    address: "456 Downtown Street, New York",
    distance: "1.2 miles",
    rating: 4.5,
    reviews: 86,
    category: "Art Gallery",
    openNow: true,
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    name: "Riverside Restaurant",
    address: "789 River Road, New York",
    distance: "0.8 miles",
    rating: 4.2,
    reviews: 215,
    category: "Restaurant",
    openNow: false,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    name: "Mountain View Hotel",
    address: "101 Hilltop Lane, New York",
    distance: "2.3 miles",
    rating: 4.8,
    reviews: 342,
    category: "Hotel",
    openNow: true,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter places based on search and active filter
  const filteredPlaces = nearbyPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         place.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || 
                         (activeFilter === "open" && place.openNow);
    return matchesSearch && matchesFilter;
  });

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    // In a real app, you might want to center the map on this location
  };

  const handleGetDirections = () => {
    // In a real app, this would open directions in Google Maps or similar
    alert(`Getting directions to ${selectedPlace.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div className="flex items-center">
            <FaCompass className="text-indigo-600 text-2xl md:text-3xl mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Explore Nearby Locations</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search for places..."
            />
            <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 flex gap-1">
              <button 
                onClick={() => setActiveFilter(activeFilter === "open" ? "all" : "open")}
                className={`p-1.5 rounded-full transition-colors ${activeFilter === "open" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                <FaFilter className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeFilter === "all" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter("open")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeFilter === "open" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            Open Now
          </button>
          {["Cafe", "Restaurant", "Hotel", "Gallery"].map(category => (
            <button 
              key={category}
              onClick={() => setActiveFilter(category.toLowerCase())}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeFilter === category.toLowerCase() ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Container */}
          <div className="w-full lg:w-2/3 h-96 lg:h-[600px] rounded-xl overflow-hidden shadow-xl border-2 border-white bg-white">
            <StyledMapContainer 
              selectedPlace={selectedPlace}
              places={filteredPlaces}
            />
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaMapMarkerAlt className="text-indigo-600 mr-2" />
                {filteredPlaces.length} Nearby Places
              </h2>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {filteredPlaces.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No places found matching your search
                </div>
              ) : (
                filteredPlaces.map((place) => (
                  <div 
                    key={place.id} 
                    onClick={() => handlePlaceClick(place)}
                    className={`p-4 border-b border-gray-100 hover:bg-indigo-50 transition-colors cursor-pointer ${selectedPlace?.id === place.id ? "bg-indigo-50" : ""}`}
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <img 
                          src={place.image} 
                          alt={place.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100?text=Place";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">{place.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{place.address}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              i < Math.floor(place.rating) ? 
                                <FaStar key={i} className="w-3 h-3" /> : 
                                <FaRegStar key={i} className="w-3 h-3" />
                            ))}
                          </div>
                          <span className="text-gray-500 text-xs ml-1">
                            ({place.rating.toFixed(1)}, {place.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="flex items-center text-xs text-gray-600">
                            <MdCategory className="mr-1" /> {place.category}
                          </span>
                          <span className={`flex items-center text-xs ${place.openNow ? "text-green-600" : "text-red-600"}`}>
                            <MdAccessTime className="mr-1" /> {place.openNow ? "Open Now" : "Closed"}
                          </span>
                          <span className="flex items-center text-xs text-gray-600">
                            <FaMapMarkerAlt className="mr-1" /> {place.distance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {selectedPlace && (
              <div className="p-4 border-t border-gray-200 bg-indigo-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{selectedPlace.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPlace.address}</p>
                  </div>
                  <button 
                    onClick={handleGetDirections}
                    className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    <FaDirections />
                  </button>
                </div>
                <div className="flex justify-between text-sm">
                  <a
                    href={`tel:${selectedPlace.phone || '1234567890'}`}
                    className="flex items-center text-indigo-600 hover:underline"
                  >
                    <MdPhone className="mr-1" /> Call Now
                  </a>
                  <span className="text-gray-600">{selectedPlace.distance}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
}