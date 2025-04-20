import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../utils/leaflet-icons";
import { useMapContext } from '../context/MapContext';

interface MapProps {
  position?: [number, number];
  locationName?: string;
  address?: string;
  showHeading?: boolean;
  className?: string;
}

const CustomMap = ({
  position = [27.7172, 85.3240],
  locationName = "DO!T Headquarters",
  address = "123 Service Avenue, Tech City",
  showHeading = false,
  className = ""
}: MapProps) => {
  const { mapKey } = useMapContext();
  
  return (
    <section className={`bg-transparent ${className}`}>
      <div className="bg-white rounded-xl border-none h-full">
        {showHeading && <h2 className="text-2xl font-bold mb-6">Our Location</h2>}
        <div className="rounded-xl overflow-hidden h-full relative">
          <div className="absolute inset-0 z-0">
            <MapContainer
              key={mapKey}
              center={position}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={position}>
                <Popup>
                  <div className="text-center p-2">
                    <h3 className="font-semibold text-lg">{locationName}</h3>
                    <p className="text-gray-600">{address}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomMap;