import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const StyledMapContainer = ({ pickup, destination }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-yellow-200/50 blur-3xl rounded-full"></div>
      <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
        <div className="w-full h-[450px] bg-yellow-50 relative">
          {/* Leaflet Map */}
          <div className="absolute inset-0">
            <MapContainer
              center={[28.4744, 77.5030]} // Centering the map on Greater Noida, India
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {pickup && (
                <Marker position={[28.4744, 77.5021]}> {/* Adjusted for pickup location */}
                  <Popup>Pickup Location</Popup>
                </Marker>
              )}
              {destination && (
                <Marker position={[28.4698, 77.5075]}> {/* Adjusted for destination */}
                  <Popup>Destination</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Grid Overlay */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-yellow-100/50" />
            ))}
          </div>

          {/* Animated Markers */}
          {pickup && (
            <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 z-[1000]">
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-ping" />
              <div className="w-4 h-4 bg-yellow-500 rounded-full absolute top-0" />
            </div>
          )}
          {destination && (
            <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2 z-[1000]">
              <div className="w-4 h-4 bg-yellow-600 rounded-full animate-ping" />
              <div className="w-4 h-4 bg-yellow-600 rounded-full absolute top-0" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyledMapContainer;
