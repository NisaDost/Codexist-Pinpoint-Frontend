import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSavedPlaces, deletePlace } from "../services/api";

const SavedPlaces = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedPlaces, setSavedPlaces] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const places = getSavedPlaces(user.id);
    setSavedPlaces(places);
  }, [user, navigate]);

  const handleDelete = (placeId) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      const updatedPlaces = deletePlace(user.id, placeId);
      setSavedPlaces(updatedPlaces);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="saved-places-container">
      <h2>My Saved Places</h2>
      {savedPlaces.length === 0 ? (
        <div className="no-results">
          You haven't saved any places yet. Go to the home page to search and
          save places.
        </div>
      ) : (
        <div className="saved-places-grid">
          {savedPlaces.map((place) => (
            <div key={place.place_id} className="saved-place-card">
              <h3>{place.name}</h3>
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
                  <strong>Type:</strong> {place.types[0].replace(/_/g, " ")}
                </p>
              )}
              <p>
                <strong>Location:</strong>{" "}
                {place.geometry.location.lat.toFixed(6)},{" "}
                {place.geometry.location.lng.toFixed(6)}
              </p>
              <button
                className="delete-button"
                onClick={() => handleDelete(place.place_id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPlaces;
