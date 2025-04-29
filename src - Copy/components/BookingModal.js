import React, { useState } from 'react';

export default function BookingModal({ isOpen, onClose, onConfirm, item, type }) {
  const [formData, setFormData] = useState({
    passengerName: '',
    email: '',
    numberOfSeats: 1,
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.passengerName.trim()) {
      newErrors.passengerName = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (formData.numberOfSeats < 1) {
      newErrors.numberOfSeats = 'At least 1 seat is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const bookingData = {
        ...formData,
        itemDetails: item,
        type,
        bookingDate: new Date().toISOString(),
        status: 'CONFIRMED',
        bookingId: `BK${Date.now()}`,
        totalAmount: item.price * formData.numberOfSeats
      };
      onConfirm(bookingData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Book {type}</h2>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold">{item.trainName || item.busName}</h3>
            <div className="text-sm text-gray-600 mt-1">
              <p>From: {item.sourceStation || item.source}</p>
              <p>To: {item.destinationStation || item.destination}</p>
              <p>Price per seat: ₹{item.price}</p>
              <p>Available seats: {item.seatsAvailable}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Passenger Name</label>
              <input
                type="text"
                value={formData.passengerName}
                onChange={(e) => setFormData({...formData, passengerName: e.target.value})}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.passengerName ? 'border-red-500' : ''
                }`}
              />
              {errors.passengerName && (
                <p className="mt-1 text-sm text-red-600">{errors.passengerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.phoneNumber ? 'border-red-500' : ''
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Seats</label>
              <input
                type="number"
                min="1"
                max={item.seatsAvailable}
                value={formData.numberOfSeats}
                onChange={(e) => setFormData({...formData, numberOfSeats: parseInt(e.target.value)})}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.numberOfSeats ? 'border-red-500' : ''
                }`}
              />
              {errors.numberOfSeats && (
                <p className="mt-1 text-sm text-red-600">{errors.numberOfSeats}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}