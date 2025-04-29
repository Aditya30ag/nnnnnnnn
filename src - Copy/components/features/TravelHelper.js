import { useState } from 'react';

const EmergencySOS = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSOS = () => {
    // Simulate sending SOS
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
    }, 4000);
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-red-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">🚨 Emergency SOS 🚨</h1>
        <p className="text-gray-600 mb-6">This will send a distress signal with your basic details.</p>

        <input
          type="text"
          placeholder="Your Name (optional)"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Your Location (optional)"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={handleSOS}
          className="w-full py-3 bg-red-600 text-white font-bold text-xl rounded-lg hover:bg-red-700 transition"
        >
          🚨 SEND SOS
        </button>

        {messageSent && (
          <p className="mt-4 text-green-600 font-medium">
            ✅ SOS message sent! Help is on the way.
          </p>
        )}
      </div>
    </div>
  );
};

export default EmergencySOS;
