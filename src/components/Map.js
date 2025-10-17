import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const Map = ({ center, onMapClick, places }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onClick={onMapClick}
      >
        <Marker position={center} />

        {places &&
          places.map((place, index) => (
            <Marker
              key={index}
              position={{
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              }}
              title={place.name}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
