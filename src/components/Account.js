import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Clock, CreditCard, Train, Bus, Plane, Home, Bed } from 'lucide-react';

function BookingCard({ booking }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {/* Header section */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            booking.type === 'Train' ? 'bg-blue-100 text-blue-700' : 
            booking.type === 'Bus' ? 'bg-green-100 text-green-700' :
            booking.type === 'Flight' ? 'bg-purple-100 text-purple-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {booking.type}
          </span>
          <h3 className="font-bold text-lg mt-2">
            {booking.itemDetails.trainName || booking.itemDetails.busName || 
             booking.itemDetails.flightName || booking.itemDetails.name}
          </h3>
          {booking.type === 'Train' && (
            <p className="text-sm text-gray-600">Train no: {booking.itemDetails.trainNo}</p>
          )}
          {booking.type === 'Flight' && (
            <p className="text-sm text-gray-600">Flight no: {booking.itemDetails.flightNo}</p>
          )}
          {booking.type === 'Hotel' && (
            <p className="text-sm text-gray-600">
              {booking.itemDetails.roomType || 'Standard Room'} • Room {booking.itemDetails.roomNumber}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">
            Booking ID: {booking.bookingId || booking.itemDetails.bookingRef}
          </span>
          {booking.bookingDetails?.pnr && (
            <p className="text-sm font-medium text-blue-600">PNR: {booking.bookingDetails.pnr}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {/* Date information */}
        {booking.type === 'Hotel' ? (
          <div className="flex items-center justify-between text-gray-600">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              Check-in: {booking.itemDetails.checkIn}
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              Check-out: {booking.itemDetails.checkOut}
            </div>
          </div>
        ) : (
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2" />
            Journey Date: {booking.itemDetails.journeyDate || booking.itemDetails.travelDate}
          </div>
        )}

        {/* Location information */}
        {booking.type === 'Hotel' ? (
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2" />
            {booking.itemDetails.location}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2" />
              From: {booking.itemDetails.from || booking.itemDetails.sourceStation || booking.itemDetails.sourceAirport}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-2" />
              To: {booking.itemDetails.to || booking.itemDetails.destinationStation || booking.itemDetails.destinationAirport}
            </div>
          </div>
        )}

        {/* Time information for travel bookings */}
        {booking.type !== 'Hotel' && (
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2" />
            {booking.itemDetails.departure} - {booking.itemDetails.arrival}
            {booking.itemDetails.duration && (
              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                Duration: {booking.itemDetails.duration}
              </span>
            )}
          </div>
        )}

        {/* Hotel specific details */}
        {booking.type === 'Hotel' && (
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <Bed size={16} className="mr-2" />
              {booking.itemDetails.nights} {booking.itemDetails.nights === 1 ? 'Night' : 'Nights'}
              {booking.itemDetails.capacity && (
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  Sleeps {booking.itemDetails.capacity}
                </span>
              )}
            </div>
            {booking.itemDetails.amenities && (
              <div className="flex items-center text-gray-600">
                <Home size={16} className="mr-2" />
                {booking.itemDetails.amenities.join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Common guest information */}
        <div className="flex items-center text-gray-600">
          <User size={16} className="mr-2" />
          {booking.passengerName} ({booking.email})
        </div>

        {/* Travel specific details */}
        {booking.type === 'Train' && booking.bookingDetails?.seatNumbers && (
          <div className="flex items-center text-gray-600">
            <Train size={16} className="mr-2" />
            Seats: {booking.bookingDetails.seatNumbers.join(', ')}
            {booking.itemDetails.platform && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Platform: {booking.itemDetails.platform}
              </span>
            )}
          </div>
        )}

        {booking.type === 'Flight' && booking.bookingDetails?.seatNumbers && (
          <div className="space-y-1">
            <div className="flex items-center text-gray-600">
              <Plane size={16} className="mr-2" />
              Seats: {booking.bookingDetails.seatNumbers.join(', ')}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Terminal: {booking.itemDetails.terminal}
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Gate: {booking.itemDetails.gate}
              </span>
            </div>
          </div>
        )}

        {booking.type === 'Bus' && (
          <div className="flex items-center text-gray-600">
            <Bus size={16} className="mr-2" />
            {booking.itemDetails.busType} Bus
          </div>
        )}

        {/* Footer section */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              {booking.type === 'Hotel' ? (
                <span className="text-sm">Room: {booking.itemDetails.roomNumber}</span>
              ) : (
                <span className="text-sm">Seats: {booking.numberOfSeats}</span>
              )}
              {booking.itemDetails.class && (
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  {booking.itemDetails.class}
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">
                Total Amount: ₹{booking.totalAmount}
                {booking.type === 'Hotel' && booking.itemDetails.nights > 1 && (
                  <span className="text-xs text-gray-500 ml-1">
                    (₹{Math.round(booking.totalAmount / booking.itemDetails.nights)} per night)
                  </span>
                )}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                booking.bookingDetails?.paymentStatus === 'CONFIRMED'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {booking.bookingDetails?.paymentStatus || booking.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    // Sort bookings by date, most recent first
    const sortedBookings = savedBookings.sort((a, b) => 
      new Date(b.bookingDetails?.bookingTime || b.bookingDate) - 
      new Date(a.bookingDetails?.bookingTime || a.bookingDate)
    );
    setBookings(sortedBookings);
  }, []);

  const filteredBookings = activeTab === 'all' 
    ? bookings
    : bookings.filter(booking => booking.type.toLowerCase() === activeTab);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Bookings
        </button>
        <button
          onClick={() => setActiveTab('hotel')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            activeTab === 'hotel'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Hotel Bookings
        </button>
        <button
          onClick={() => setActiveTab('train')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            activeTab === 'train'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Train Bookings
        </button>
        <button
          onClick={() => setActiveTab('bus')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            activeTab === 'bus'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Bus Bookings
        </button>
        <button
          onClick={() => setActiveTab('flight')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            activeTab === 'flight'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Flight Bookings
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600">Total Bookings</div>
          <div className="text-2xl font-bold text-blue-700">{bookings.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600">Amount Spent</div>
          <div className="text-2xl font-bold text-green-700">
            ₹{bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600">Upcoming Trips</div>
          <div className="text-2xl font-bold text-purple-700">
            {bookings.filter(booking => 
              new Date(booking.itemDetails.journeyDate || booking.itemDetails.travelDate) > new Date()
            ).length}
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking, index) => (
            <BookingCard key={index} booking={booking} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <Calendar size={64} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'all'
                ? "You haven't made any bookings yet."
                : `You haven't made any ${activeTab} bookings yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
