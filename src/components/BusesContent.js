import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, RefreshCw, Filter } from 'lucide-react';
import BookingModal from './BookingModal';

// Bus Card Component
function BusCard({ bus, onBookNow }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg text-gray-800">{bus.busName}</h3>
        <span className={`px-3 py-1 rounded-full text-xs ${
          bus.busType === 'AC' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {bus.busType}
        </span>
      </div>
      <div className="space-y-2">
        <div className="text-sm text-gray-600">Route: {bus.route}</div>
        <div className="text-sm text-gray-600">Capacity: {bus.capacity} seats</div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-xs text-gray-500">Bus ID: {bus.id}</span>
            <div className="text-sm font-medium text-green-600 mt-1">
              Price: ₹{bus.price}
            </div>
          </div>
          <button 
            onClick={onBookNow}
            className={`px-4 py-1 text-sm text-white rounded-md ${
              bus.seatsAvailable > 0
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={bus.seatsAvailable === 0}
          >
            {bus.seatsAvailable > 0 ? 'Book Now' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BusContent() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filters, setFilters] = useState({
    busType: 'all',
    minCapacity: '',
    maxCapacity: '',
    searchTerm: '',
    minPrice: '',
    maxPrice: ''
  });

  // Fetch bus data from backend or use fallback data
  const fetchBuses = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:8080/api/buses/');
      if (!response.ok) {
        throw new Error('Failed to fetch bus data');
      }
  
      const data = await response.json();
      const enhancedData = data.map(bus => ({
        ...bus,
        price: Math.floor(Math.random() * (2000 - 500) + 500), // Random price between 500-2000
        seatsAvailable: Math.floor(Math.random() * bus.capacity) // Random available seats
      }));
      setBuses(enhancedData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      // Fallback data
      setBuses([
        {
          id: 1,
          busName: "City Express 101",
          route: "Route 101",
          busType: "AC",
          capacity: 50,
          price: 1200,
          seatsAvailable: 25,
          departureTime: "10:00",
          arrivalTime: "16:00",
          source: "New Delhi",
          destination: "Jaipur"
        },
        {
          id: 2,
          busName: "Metro Link 205",
          route: "Route 102",
          busType: "Non-AC",
          capacity: 40,
          price: 800,
          seatsAvailable: 0,
          departureTime: "08:00",
          arrivalTime: "14:00",
          source: "Mumbai",
          destination: "Pune"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filter buses based on current filters
  const filteredBuses = buses.filter(bus => {
    const matchesType = filters.busType === 'all' || bus.busType === filters.busType;
    const matchesCapacityMin = !filters.minCapacity || bus.capacity >= parseInt(filters.minCapacity);
    const matchesCapacityMax = !filters.maxCapacity || bus.capacity <= parseInt(filters.maxCapacity);
    const matchesPriceMin = !filters.minPrice || bus.price >= parseInt(filters.minPrice);
    const matchesPriceMax = !filters.maxPrice || bus.price <= parseInt(filters.maxPrice);
    const matchesSearch = !filters.searchTerm || 
      bus.busName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      bus.route.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesType && matchesCapacityMin && matchesCapacityMax && 
           matchesPriceMin && matchesPriceMax && matchesSearch;
  });

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle booking
  const handleBookNow = (bus) => {
    setSelectedBus(bus);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = (bookingData) => {
    // Get existing bookings from localStorage
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Add new booking
    const updatedBookings = [...existingBookings, bookingData];
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    // Update available seats
    const updatedBuses = buses.map(bus => {
      if (bus.id === selectedBus.id) {
        return {
          ...bus,
          seatsAvailable: bus.seatsAvailable - bookingData.numberOfSeats
        };
      }
      return bus;
    });
    setBuses(updatedBuses);

    // Close modal and show success message
    setShowBookingModal(false);
    setSelectedBus(null);
    alert('Booking confirmed! Check your profile for booking details.');
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchBuses();
  }, []);

  return (
    <div className="space-y-6">
      {/* Search and Filter Panel */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <input
                type="text"
                placeholder="Search buses..."
                className="w-full bg-transparent focus:outline-none"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bus Type</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              value={filters.busType}
              onChange={(e) => handleFilterChange('busType', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Capacity Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min seats"
                className="px-4 py-2 border border-gray-300 rounded-lg"
                value={filters.minCapacity}
                onChange={(e) => handleFilterChange('minCapacity', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max seats"
                className="px-4 py-2 border border-gray-300 rounded-lg"
                value={filters.maxCapacity}
                onChange={(e) => handleFilterChange('maxCapacity', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bus Listing Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Available Buses</h3>
            <p className="text-sm text-gray-500">Found {filteredBuses.length} buses</p>
          </div>
          <div className="flex items-center">
            {lastUpdated && (
              <span className="mr-3 text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchBuses}
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
            {filteredBuses.map((bus) => (
              <BusCard
                key={bus.id}
                bus={bus}
                onBookNow={() => handleBookNow(bus)}
              />
            ))}
            {filteredBuses.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No buses found matching your criteria.
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
        item={selectedBus}
        type="Bus"
      />
    </div>
  );
}
