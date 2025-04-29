import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const favoriteIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'favorite-marker' // For custom styling
});

const currentLocationIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'current-location-marker' // For custom styling
});

// Component to center map on a specific location
const CenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14);
    }
  }, [center, map]);
  return null;
};

const LocationExplorer = () => {
  const [position, setPosition] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [newFavoriteName, setNewFavoriteName] = useState('');
  const [notification, setNotification] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const popupRef = useRef(null);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteLocations')) || [];
    setFavorites(savedFavorites);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteLocations', JSON.stringify(favorites));
  }, [favorites]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToFavorites = () => {
    if (!position) return;
    setIsAddingFavorite(true);
    setNewFavoriteName(`Favorite ${favorites.length + 1}`);
  };

  const handleSaveFavorite = () => {
    const newFavorite = {
      id: Date.now(),
      lat: position.lat,
      lng: position.lng,
      name: newFavoriteName || `Favorite ${favorites.length + 1}`,
      timestamp: new Date().toISOString()
    };

    setFavorites([...favorites, newFavorite]);
    setIsAddingFavorite(false);
    setIsPopupOpen(false);
    showNotification(`"${newFavorite.name}" added to favorites!`);
  };

  const handleCancelAddFavorite = () => {
    setIsAddingFavorite(false);
  };

  const handleRemoveFavorite = (id) => {
    const favoriteToRemove = favorites.find(fav => fav.id === id);
    setFavorites(favorites.filter(fav => fav.id !== id));
    showNotification(`"${favoriteToRemove.name}" removed from favorites`, 'error');
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const location = { lat: latitude, lng: longitude };
          setCurrentLocation(location);
          setMapCenter([latitude, longitude]);
          showNotification('Successfully located your position!');
        },
        (err) => {
          console.error("Error getting current location:", err);
          showNotification('Could not get your location. Check permissions.', 'error');
        }
      );
    } else {
      showNotification('Geolocation is not supported by your browser.', 'error');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      showNotification('Searching...', 'info');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data);
      if (data.length === 0) {
        showNotification('No results found', 'error');
      } else {
        showNotification(`Found ${data.length} results`);
      }
    } catch (error) {
      console.error("Search error:", error);
      showNotification('Failed to perform search', 'error');
    }
  };

  const handleSelectSearchResult = (result) => {
    const newPosition = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    setPosition(newPosition);
    setMapCenter([newPosition.lat, newPosition.lng]);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSelectFavorite = (fav) => {
    setMapCenter([fav.lat, fav.lng]);
    setPosition({ lat: fav.lat, lng: fav.lng });
    showNotification(`Viewing "${fav.name}"`);
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setIsPopupOpen(true);
        showNotification('Location selected. Click "Add to Favorites" to save it.', 'info');
      },
    });

    return position ? (
      <Marker position={position}>
        <Popup ref={popupRef} onClose={() => setIsPopupOpen(false)} open={isPopupOpen}>
          <div className="p-2">
            {!isAddingFavorite ? (
              <>
                <p className="text-lg font-semibold mb-1">Selected Location</p>
                <p className="text-sm">Latitude: {position.lat.toFixed(6)}</p>
                <p className="text-sm">Longitude: {position.lng.toFixed(6)}</p>
                <button
                  onClick={handleAddToFavorites}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm w-full"
                >
                  Add to Favorites
                </button>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold mb-1">Save Location</p>
                <input
                  type="text"
                  value={newFavoriteName}
                  onChange={(e) => setNewFavoriteName(e.target.value)}
                  placeholder="Location name"
                  className="w-full border border-gray-300 rounded px-2 py-1 mb-2 text-sm"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveFavorite}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelAddFavorite}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </Popup>
      </Marker>
    ) : null;
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Notification System */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg ${
            notification.type === 'error' ? 'bg-red-500 text-white' : 
            notification.type === 'info' ? 'bg-blue-500 text-white' : 
            'bg-green-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}
      
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Location Explorer</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleGetCurrentLocation}
              className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              My Location
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 p-4 overflow-y-auto border-r border-gray-200">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Search Locations</h2>
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a place..."
                className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium text-sm bg-gray-50 text-gray-600 p-2 rounded-t-lg border-b">Search Results</h3>
                <ul className="divide-y divide-gray-100">
                  {searchResults.slice(0, 5).map((result) => (
                    <li key={result.place_id} className="p-2 hover:bg-blue-50">
                      <button
                        onClick={() => handleSelectSearchResult(result)}
                        className="text-sm text-left w-full text-blue-600 hover:text-blue-800"
                      >
                        {result.display_name.split(',').slice(0, 2).join(', ')}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {currentLocation && (
            <div className="mb-6 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center text-gray-700 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-lg font-semibold">Your Location</h2>
              </div>
              <div className="text-sm text-gray-600">
                <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
                <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
              </div>
              <button
                onClick={() => {
                  setMapCenter([currentLocation.lat, currentLocation.lng]);
                  setPosition(currentLocation);
                }}
                className="mt-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded border border-gray-300"
              >
                Center on Map
              </button>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700">Saved Locations</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {favorites.length}
              </span>
            </div>
            
            {favorites.length === 0 ? (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-sm text-gray-500 mt-2">No favorites yet.</p>
                <p className="text-xs text-gray-500">Click on the map to add locations to your favorites.</p>
              </div>
            ) : (
              <ul className="space-y-2 overflow-auto h-40">
                {favorites.map((fav) => (
                  <li key={fav.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-blue-600">{fav.name}</h3>
                        <div className="text-xs text-gray-500 mt-1">
                          <p>{fav.lat.toFixed(6)}, {fav.lng.toFixed(6)}</p>
                          <p>Saved on {new Date(fav.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(fav.id)}
                        className="text-red-500 hover:text-red-700 text-sm p-1"
                        title="Remove from favorites"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => handleSelectFavorite(fav)}
                      className="mt-2 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded"
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
        <div className="flex-1 relative">
          
          
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
            
            {/* Display favorite markers */}
            {favorites.map(fav => (
              <Marker 
                key={fav.id} 
                position={[fav.lat, fav.lng]}
                icon={favoriteIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium">{fav.name}</h3>
                    <p className="text-xs text-gray-600">
                      {fav.lat.toFixed(6)}, {fav.lng.toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Saved on {new Date(fav.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Current location marker */}
            {currentLocation && (
              <Marker 
                position={[currentLocation.lat, currentLocation.lng]}
                icon={currentLocationIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium">Your Current Location</h3>
                    <p className="text-xs text-gray-600">
                      {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Center map component */}
            <CenterMap center={mapCenter} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LocationExplorer;