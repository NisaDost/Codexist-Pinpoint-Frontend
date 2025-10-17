import React from "react";
import { useAuth } from "../context/AuthContext";

const PlacesList = ({ places, selectedType, onSavePlace }) => {
  const { user } = useAuth();

  if (!places || places.length === 0) {
    return (
      <div className="no-results">
        No places found. Try adjusting your search.
      </div>
    );
  }

  return (
    <div className="places-list">
      <h3>Results ({places.length})</h3>
      {places.map((place, index) => (
        <div key={index} className="place-item">
          <h4>{place.name}</h4>
          <p>
            <strong>Address:</strong>{" "}
            {place.vicinity || place.formatted_address || "N/A"}
          </p>
          {place.rating && (
            <p>
              <strong>Rating:</strong> {place.rating} / 5
            </p>
          )}
          {place.types && place.types.length > 0 && (
            <p>
              <strong>Type:</strong> {selectedType}
            </p>
          )}
          <p>
            <strong>Location:</strong> {place.geometry.location.lat.toFixed(6)},{" "}
            {place.geometry.location.lng.toFixed(6)}
          </p>
          {user && (
            <button
              className="save-button"
              onClick={() => onSavePlace(place, selectedType)}
            >
              Save Place
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlacesList;
