import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

export default function MapView() {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: "AIzaSyAvUTmxJq59stO4zSDaB-6UOiGX9snjkm8" });
  const center = { lat: 28.6448, lng: 77.2167 };
  return (
    <div className="map-container">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={9}
          center={center}
        >
          <Marker position={center} />
        </GoogleMap>
      ) : (<div>Loading Map…</div>)}
    </div>
  );
}
