import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationExplorer = () => {
  const [position, setPosition] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteLocations')) || [];
    setFavorites(savedFavorites);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteLocations', JSON.stringify(favorites));
  }, [favorites]);

  const handleAddToFavorites = () => {
    if (!position) return;
    
    const newFavorite = {
      id: Date.now(),
      lat: position.lat,
      lng: position.lng,
      name: `Favorite ${favorites.length + 1}`,
      timestamp: new Date().toISOString()
    };

    setFavorites([...favorites, newFavorite]);
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Error getting current location:", err);
          alert("Could not get your current location. Please ensure location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to perform search. Please try again.");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });

    return position ? (
      <Marker position={position}>
        <Popup>
          <div className="p-2">
            <p>Lat: {position.lat.toFixed(4)}</p>
            <p>Lng: {position.lng.toFixed(4)}</p>
            <button
              onClick={handleAddToFavorites}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Add to Favorites
            </button>
          </div>
        </Popup>
      </Marker>
    ) : null;
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Location Explorer</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Search Locations</h2>
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a place..."
                className="flex-1 border border-gray-300 rounded-l px-2 py-1"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-r"
              >
                Search
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2">
                <h3 className="font-medium">Results:</h3>
                <ul className="mt-1 space-y-1">
                  {searchResults.slice(0, 5).map((result) => (
                    <li key={result.place_id} className="text-sm">
                      <button
                        onClick={() => {
                          setPosition({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
                          setSearchResults([]);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        {result.display_name.split(',')[0]}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Your Location</h2>
            <button
              onClick={handleGetCurrentLocation}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded w-full"
            >
              Get Current Location
            </button>
            {currentLocation && (
              <div className="mt-2 text-sm">
                <p>Lat: {currentLocation.lat.toFixed(4)}</p>
                <p>Lng: {currentLocation.lng.toFixed(4)}</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Favorites ({favorites.length})</h2>
            {favorites.length === 0 ? (
              <p className="text-sm text-gray-500">No favorites yet. Click on the map to add some.</p>
            ) : (
              <ul className="space-y-2">
                {favorites.map((fav) => (
                  <li key={fav.id} className="bg-white p-2 rounded shadow-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{fav.name}</span>
                      <button
                        onClick={() => handleRemoveFavorite(fav.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>{fav.lat.toFixed(4)}, {fav.lng.toFixed(4)}</p>
                      <p>{new Date(fav.timestamp).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => setPosition({ lat: fav.lat, lng: fav.lng })}
                      className="mt-1 text-xs text-blue-600 hover:underline"
                    >
                      View on Map
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
            {currentLocation && (
              <Marker position={currentLocation}>
                <Popup>Your current location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LocationExplorer;