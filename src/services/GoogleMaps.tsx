import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Marker as MarkerType } from "../types";

type InfraMapProps = {
  markers: MarkerType[];
};

const containerStyle = { width: "100%", height: "400px" };
const center = { lat: 28.6142, lng: 77.2092 };

const InfraMap: React.FC<InfraMapProps> = ({ markers }) => (
  <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!}>
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16}>
      {markers.map((m, idx) => (
        <Marker position={{ lat: m.lat, lng: m.lng }} key={idx} />
      ))}
    </GoogleMap>
  </LoadScript>
);

export default InfraMap;
