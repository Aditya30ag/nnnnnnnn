import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, RefreshCw, Plane } from 'lucide-react';
import BookingModal from './BookingModal';

// Flight Card Component
function FlightCard({ flight, onBookNow }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{flight.flightName}</h3>
          <p className="text-sm text-gray-600">Flight no: {flight.flightNumber}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
          {flight.airline}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex-1">
            <div className="text-gray-500">From</div>
            <div className="font-medium">{flight.sourceAirport}</div>
            <div className="text-xs text-gray-500">{flight.departureTime}</div>
          </div>
          
          <div className="px-4">
            <div className="w-20 h-0.5 bg-gray-300 relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Plane size={16} className="text-gray-400" />
              </div>
            </div>
            <div className="text-xs text-center mt-1 text-gray-500">
              {flight.duration}
            </div>
          </div>
          
          <div className="flex-1 text-right">
            <div className="text-gray-500">To</div>
            <div className="font-medium">{flight.destinationAirport}</div>
            <div className="text-xs text-gray-500">{flight.arrivalTime}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <div className="text-xs text-gray-500">Travel Date</div>
            <div className="text-sm font-medium">{flight.travelDate}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Price</div>
            <div className="text-sm font-medium text-green-600">₹{flight.price}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Available</div>
            <div className="text-sm font-medium">{flight.seatsAvailable} seats</div>
          </div>
        </div>

        <button 
          className={`w-full py-2 text-sm font-medium rounded-md ${
            flight.seatsAvailable > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={flight.seatsAvailable === 0}
          onClick={onBookNow}
        >
          {flight.seatsAvailable > 0 ? 'Book Now' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}

export default function FlightContent() {
  const [flightData, setFlightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filters, setFilters] = useState({
    source: '',
    destination: '',
    date: '',
    minPrice: '',
    maxPrice: '',
    searchTerm: '',
    airline: 'all'
  });

  const fetchFlightData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulated flight data since we don't have an actual API
      const sampleFlights = [
        {
          id: 1,
          flightName: "Air India Express",
          flightNumber: "AI505",
          airline: "Air India",
          sourceAirport: "DEL",
          destinationAirport: "BOM",
          departureTime: "06:00",
          arrivalTime: "08:30",
          duration: "2h 30m",
          travelDate: "2025-04-21",
          price: 5200,
          seatsAvailable: 45
        },
        {
          id: 2,
          flightName: "IndiGo Airways",
          flightNumber: "6E321",
          airline: "IndiGo",
          sourceAirport: "BLR",
          destinationAirport: "DEL",
          departureTime: "09:15",
          arrivalTime: "12:00",
          duration: "2h 45m",
          travelDate: "2025-04-21",
          price: 4800,
          seatsAvailable: 32
        }
      ];
      
      setFlightData(sampleFlights);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch flight data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightData();
  }, []);

  // Filter flights based on current filters
  const filteredFlights = flightData.filter(flight => {
    const matchesSource = !filters.source || 
      flight.sourceAirport.toLowerCase().includes(filters.source.toLowerCase());
    const matchesDestination = !filters.destination || 
      flight.destinationAirport.toLowerCase().includes(filters.destination.toLowerCase());
    const matchesDate = !filters.date || flight.travelDate === filters.date;
    const matchesMinPrice = !filters.minPrice || flight.price >= parseInt(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || flight.price <= parseInt(filters.maxPrice);
    const matchesAirline = filters.airline === 'all' || flight.airline === filters.airline;
    const matchesSearch = !filters.searchTerm || 
      flight.flightName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      flight.flightNumber.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesSource && matchesDestination && matchesDate && 
           matchesMinPrice && matchesMaxPrice && matchesAirline && matchesSearch;
  });

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookNow = (flight) => {
    setSelectedFlight(flight);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = (bookingData) => {
    // Get existing bookings from localStorage
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Create enhanced booking data with flight details
    const enhancedBookingData = {
      ...bookingData,
      itemDetails: {
        ...selectedFlight,
        journeyDate: selectedFlight.travelDate,
        flightNo: selectedFlight.flightNumber,
        from: selectedFlight.sourceAirport,
        to: selectedFlight.destinationAirport,
        departure: selectedFlight.departureTime,
        arrival: selectedFlight.arrivalTime,
        duration: selectedFlight.duration,
        class: 'Economy',  // You can make this dynamic if needed
        terminal: Math.floor(Math.random() * 3) + 1, // Random terminal number 1-3
        gate: String.fromCharCode(65 + Math.floor(Math.random() * 26)) // Random gate A-Z
      },
      bookingDetails: {
        pnr: generatePNR(),
        bookingTime: new Date().toISOString(),
        paymentStatus: 'CONFIRMED',
        seatNumbers: generateSeatNumbers(bookingData.numberOfSeats)
      },
      type: 'Flight'  // Specify booking type as Flight
    };
    
    // Add new booking
    const updatedBookings = [...existingBookings, enhancedBookingData];
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    // Update available seats
    const updatedFlights = flightData.map(flight => {
      if (flight.id === selectedFlight.id) {
        return {
          ...flight,
          seatsAvailable: flight.seatsAvailable - bookingData.numberOfSeats
        };
      }
      return flight;
    });
    setFlightData(updatedFlights);

    // Close modal and show success message
    setShowBookingModal(false);
    setSelectedFlight(null);
    alert('Flight booking confirmed! Check your profile for booking details.');
  };

  // Generate PNR number
  const generatePNR = () => {
    const prefix = 'FL';
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `${prefix}${randomNum}`;
  };

  // Generate seat numbers
  const generateSeatNumbers = (count) => {
    const seats = [];
    const rows = Array.from({ length: 30 }, (_, i) => i + 1);
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    for (let i = 0; i < count; i++) {
      const row = rows[Math.floor(Math.random() * rows.length)];
      const col = cols[Math.floor(Math.random() * cols.length)];
      seats.push(`${row}${col}`);
    }
    return seats.sort();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Panel */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search Flights</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by flight name or number..."
                className="w-full bg-transparent focus:outline-none"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">From</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Departure airport..."
                className="w-full bg-transparent focus:outline-none"
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">To</label>
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Arrival airport..."
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
            <label className="block text-sm font-medium text-gray-700">Airline</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              value={filters.airline}
              onChange={(e) => handleFilterChange('airline', e.target.value)}
            >
              <option value="all">All Airlines</option>
              <option value="Air India">Air India</option>
              <option value="IndiGo">IndiGo</option>
              <option value="SpiceJet">SpiceJet</option>
              <option value="Vistara">Vistara</option>
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
        </div>
      </div>

      {/* Flight Listing Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Available Flights</h3>
            <p className="text-sm text-gray-500">
              Showing {filteredFlights.length} flights
            </p>
          </div>
          <div className="flex items-center">
            {lastUpdated && (
              <span className="mr-3 text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchFlightData}
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
            {filteredFlights.map((flight) => (
              <FlightCard 
                key={flight.id} 
                flight={flight} 
                onBookNow={() => handleBookNow(flight)}
              />
            ))}
            {filteredFlights.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No flights found matching your criteria.
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
        item={selectedFlight}
        type="Flight"
      />
    </div>
  );
}