import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, RefreshCw, Star, Bed, Home } from 'lucide-react';
import BookingModal from './BookingModal';

// Hotel Card Component
function HotelCard({ hotel, onBookNow }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-18">
        
        <div className="absolute top-4 right-4 px-2 py-1 bg-white rounded-full shadow-md">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{hotel.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{hotel.name}</h3>
        <div className="flex items-center text-gray-600 mt-1">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{hotel.location}</span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Home size={16} className="text-gray-400" />
              <span>{hotel.roomType || 'Standard Room'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bed size={16} className="text-gray-400" />
              <span>Sleeps {hotel.capacity || '2'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">per night</p>
              <p className="text-xl font-bold text-gray-800">₹{hotel.price}</p>
            </div>
            <button
              onClick={() => onBookNow(hotel)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelsContent() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    minPrice: '',
    maxPrice: '',
    searchTerm: '',
    rating: 'all'
  });

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/hotels');
      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }
      
      const data = await response.json();
      setHotels(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      // Fallback data for testing
      setHotels([
        {
          id: 1,
          name: "Grand Plaza Hotel",
          location: "New York City",
          price: 199,
          rating: 4.8,
          imageUrl: "https://source.unsplash.com/800x600/?hotel,luxury",
          roomType: "Deluxe Suite",
          capacity: 2,
          amenities: ["WiFi", "Pool", "Spa"]
        },
        {
          id: 2,
          name: "Seaside Resort",
          location: "Miami Beach",
          price: 299,
          rating: 4.5,
          imageUrl: "https://source.unsplash.com/800x600/?hotel,beach",
          roomType: "Ocean View Suite",
          capacity: 3,
          amenities: ["Beach Access", "Pool", "Restaurant"]
        },
        {
          id: 3,
          name: "Mountain Lodge",
          location: "Aspen",
          price: 399,
          rating: 4.9,
          imageUrl: "https://source.unsplash.com/800x600/?hotel,mountain",
          roomType: "Luxury Chalet",
          capacity: 4,
          amenities: ["Fireplace", "Ski Access", "Hot Tub"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Filter hotels based on current filters
  const filteredHotels = hotels.filter(hotel => {
    const matchesLocation = !filters.location || 
      hotel.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesMinPrice = !filters.minPrice || hotel.price >= parseInt(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || hotel.price <= parseInt(filters.maxPrice);
    const matchesRating = filters.rating === 'all' || hotel.rating >= parseFloat(filters.rating);
    const matchesSearch = !filters.searchTerm || 
      hotel.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesLocation && matchesMinPrice && matchesMaxPrice && 
           matchesRating && matchesSearch;
  });

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookNow = (hotel) => {
    setSelectedHotel(hotel);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = (bookingData) => {
    // Get existing bookings from localStorage
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Calculate number of nights
    const checkIn = new Date(filters.checkIn);
    const checkOut = new Date(filters.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 1;
    
    // Create enhanced booking data with hotel details
    const enhancedBookingData = {
      ...bookingData,
      itemDetails: {
        ...selectedHotel,
        checkIn: filters.checkIn || new Date().toISOString().split('T')[0],
        checkOut: filters.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        nights: nights,
        roomNumber: generateRoomNumber(),
        bookingRef: generateBookingRef()
      },
      bookingDetails: {
        bookingTime: new Date().toISOString(),
        paymentStatus: 'CONFIRMED',
      },
      type: 'Hotel',
      totalAmount: selectedHotel.price * nights
    };
    
    // Add new booking
    const updatedBookings = [...existingBookings, enhancedBookingData];
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    // Close modal and show success message
    setShowBookingModal(false);
    setSelectedHotel(null);
    alert('Hotel booking confirmed! Check your profile for booking details.');
  };

  // Generate room number
  const generateRoomNumber = () => {
    const floor = Math.floor(Math.random() * 9) + 1;
    const room = Math.floor(Math.random() * 20) + 1;
    return `${floor}${room.toString().padStart(2, '0')}`;
  };

  // Generate booking reference
  const generateBookingRef = () => {
    const prefix = 'HB';
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `${prefix}${randomNum}`;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Panel */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search Hotels</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by hotel name or location..."
                className="w-full bg-transparent focus:outline-none"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter location..."
                className="w-full bg-transparent focus:outline-none"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <Calendar size={18} className="text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full bg-transparent focus:outline-none"
                value={filters.checkIn}
                onChange={(e) => handleFilterChange('checkIn', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <Calendar size={18} className="text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full bg-transparent focus:outline-none"
                value={filters.checkOut}
                onChange={(e) => handleFilterChange('checkOut', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Price Range (per night)</label>
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

      {/* Hotels Listing Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Available Hotels</h3>
            <p className="text-sm text-gray-500">
              Showing {filteredHotels.length} hotels
            </p>
          </div>
          <div className="flex items-center">
            {lastUpdated && (
              <span className="mr-3 text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchHotels}
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHotels.map((hotel) => (
              <HotelCard 
                key={hotel.id} 
                hotel={hotel} 
                onBookNow={() => handleBookNow(hotel)}
              />
            ))}
            {filteredHotels.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No hotels found matching your criteria.
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
        item={selectedHotel}
        type="Hotel"
      />
    </div>
  );
}
