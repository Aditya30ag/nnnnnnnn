import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, RefreshCw, Filter, Clock } from 'lucide-react';
import BookingModal from './BookingModal';

// Train Card Component
function TrainCard({ train, onBookNow }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg text-gray-800">{train.trainName}</h3>
        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
          #{train.trainNumber}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex-1">
            <div className="text-gray-500">From</div>
            <div className="font-medium">{train.sourceStation}</div>
            <div className="text-xs text-gray-500">{train.departureTime}</div>
          </div>
          
          <div className="px-4">
            <div className="w-20 h-0.5 bg-gray-300 relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Clock size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 text-right">
            <div className="text-gray-500">To</div>
            <div className="font-medium">{train.destinationStation}</div>
            <div className="text-xs text-gray-500">{train.arrivalTime}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <div className="text-xs text-gray-500">Travel Date</div>
            <div className="text-sm font-medium">{train.travelDate}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Price</div>
            <div className="text-sm font-medium text-green-600">₹{train.price}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Available</div>
            <div className="text-sm font-medium">{train.seatsAvailable} seats</div>
          </div>
        </div>

        <button 
          className={`w-full py-2 text-sm font-medium rounded-md ${
            train.seatsAvailable > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={train.seatsAvailable === 0}
          onClick={onBookNow}
        >
          {train.seatsAvailable > 0 ? 'Book Now' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}

export default function TrainContent() {
  const [trainData, setTrainData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    source: '',
    destination: '',
    date: '',
    minPrice: '',
    maxPrice: '',
    searchTerm: ''
  });
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fetchTrainData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = 'http://localhost:8080/api/trains';
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTrainData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      // Fallback data for development
      setTrainData([
        {
          id: 1,
          trainName: "Rajdhani Express",
          trainNumber: "12301",
          sourceStation: "New Delhi",
          destinationStation: "Mumbai",
          departureTime: "16:55",
          arrivalTime: "08:15",
          travelDate: "2025-04-21",
          price: 2100,
          seatsAvailable: 42
        },
        {
          id: 2,
          trainName: "Shatabdi Express",
          trainNumber: "12002",
          sourceStation: "New Delhi",
          destinationStation: "Bhopal",
          departureTime: "06:15",
          arrivalTime: "13:30",
          travelDate: "2025-04-21",
          price: 1500,
          seatsAvailable: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainData();
  }, []);

  // Filter trains based on current filters
  const filteredTrains = trainData.filter(train => {
    const matchesSource = !filters.source || 
      train.sourceStation.toLowerCase().includes(filters.source.toLowerCase());
    const matchesDestination = !filters.destination || 
      train.destinationStation.toLowerCase().includes(filters.destination.toLowerCase());
    const matchesDate = !filters.date || train.travelDate === filters.date;
    const matchesMinPrice = !filters.minPrice || train.price >= parseInt(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || train.price <= parseInt(filters.maxPrice);
    const matchesSearch = !filters.searchTerm || 
      train.trainName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      train.trainNumber.includes(filters.searchTerm);
    
    return matchesSource && matchesDestination && matchesDate && 
           matchesMinPrice && matchesMaxPrice && matchesSearch;
  });

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookNow = (train) => {
    setSelectedTrain(train);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = (bookingData) => {
    // Get existing bookings from localStorage
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Create enhanced booking data with all train details
    const enhancedBookingData = {
      ...bookingData,
      itemDetails: {
        ...selectedTrain,
        journeyDate: selectedTrain.travelDate,
        trainNo: selectedTrain.trainNumber,
        from: selectedTrain.sourceStation,
        to: selectedTrain.destinationStation,
        departure: selectedTrain.departureTime,
        arrival: selectedTrain.arrivalTime,
        duration: calculateDuration(selectedTrain.departureTime, selectedTrain.arrivalTime),
        class: 'Standard',  // You can make this dynamic if needed
        platform: Math.floor(Math.random() * 10) + 1 // Random platform number 1-10
      },
      bookingDetails: {
        pnr: generatePNR(),
        bookingTime: new Date().toISOString(),
        paymentStatus: 'CONFIRMED',
        seatNumbers: generateSeatNumbers(bookingData.numberOfSeats)
      }
    };
    
    // Add new booking
    const updatedBookings = [...existingBookings, enhancedBookingData];
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    // Update available seats
    const updatedTrains = trainData.map(train => {
      if (train.id === selectedTrain.id) {
        return {
          ...train,
          seatsAvailable: train.seatsAvailable - bookingData.numberOfSeats
        };
      }
      return train;
    });
    setTrainData(updatedTrains);

    // Close modal and show success message
    setShowBookingModal(false);
    setSelectedTrain(null);
    alert('Booking confirmed! Check your profile for booking details.');
  };

  // Helper function to calculate duration between two times
  const calculateDuration = (departure, arrival) => {
    const [depHour, depMin] = departure.split(':').map(Number);
    const [arrHour, arrMin] = arrival.split(':').map(Number);
    
    let hourDiff = arrHour - depHour;
    let minDiff = arrMin - depMin;
    
    if (minDiff < 0) {
      hourDiff--;
      minDiff += 60;
    }
    if (hourDiff < 0) {
      hourDiff += 24;
    }
    
    return `${hourDiff}h ${minDiff}m`;
  };

  // Generate PNR number
  const generatePNR = () => {
    const prefix = 'PNR';
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `${prefix}${randomNum}`;
  };

  // Generate seat numbers
  const generateSeatNumbers = (count) => {
    const seats = [];
    const coaches = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < count; i++) {
      const coach = coaches[Math.floor(Math.random() * coaches.length)];
      const seatNum = Math.floor(Math.random() * 72) + 1;
      seats.push(`${coach}${seatNum}`);
    }
    return seats;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Panel */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search Trains</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by train name or number..."
                className="w-full bg-transparent focus:outline-none"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Source Station</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="From station..."
                className="w-full bg-transparent focus:outline-none"
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Destination Station</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="To station..."
                className="w-full bg-transparent focus:outline-none"
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Travel Date</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <Calendar size={18} className="text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full bg-transparent focus:outline-none"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min price"
                className="px-4 py-2 border border-gray-300 rounded-lg"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max price"
                className="px-4 py-2 border border-gray-300 rounded-lg"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Train Listing Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Available Trains</h3>
            <p className="text-sm text-gray-500">
              Showing {filteredTrains.length} trains
            </p>
          </div>
          <div className="flex items-center">
            {lastUpdated && (
              <span className="mr-3 text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchTrainData}
              disabled={loading}
              className="flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <RefreshCw size={14} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrains.map((train) => (
              <TrainCard 
                key={train.id} 
                train={train} 
                onBookNow={() => handleBookNow(train)}
              />
            ))}
            {filteredTrains.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No trains found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleBookingConfirm}
        item={selectedTrain}
        type="Train"
      />

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 w-full h-40 flex justify-center items-end pointer-events-none z-20 opacity-50">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,100 C360,180 1080,20 1440,100 L1440,150 L0,150 Z"
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgba(59, 130, 246, 0.8)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
