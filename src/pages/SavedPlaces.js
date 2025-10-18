import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSavedPlaces, deletePlace } from "../services/api";

const SavedPlaces = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    fetchSavedPlaces();
  }, [user, authLoading, navigate]);

  const fetchSavedPlaces = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSavedPlaces();
      setSavedPlaces(data || []);
    } catch (error) {
      if (error.request) {
        setError(
          "Cannot connect to backend. Make sure your server is running on port 8070."
        );
      } else {
        setError("Error loading saved places.");
      }
      console.error("Error fetching saved places:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        await deletePlace(id);
        setSavedPlaces(savedPlaces.filter((place) => place.id !== id));
        alert("Place deleted successfully!");
      } catch (error) {
        if (error.request) {
          alert("Cannot connect to backend. Make sure your server is running.");
        } else {
          alert("Error deleting place. Please try again.");
        }
        console.error("Error deleting place:", error);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="saved-places-container">
        <h2>My Saved Places</h2>
        <div className="no-results">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="saved-places-container">
        <h2>My Saved Places</h2>
        <div className="no-results">Loading saved places...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-places-container">
        <h2>My Saved Places</h2>
        <div className="error-message">{error}</div>
      </div>
    );
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
            <div key={place.id} className="saved-place-card">
              <h3>{place.customName || place.placeName}</h3>
              {place.placeName && place.customName !== place.placeName && (
                <p>
                  <strong>Original Name:</strong> {place.placeName}
                </p>
              )}
              {place.type && place.type.trim() !== "" && (
                <p>
                  <strong>Type:</strong> {place.type}
                </p>
              )}
              <p>
                <strong>Address:</strong> {place.address || "N/A"}
              </p>
              <p>
                <strong>Location:</strong> {place.latitude?.toFixed(6)},{" "}
                {place.longitude?.toFixed(6)}
              </p>
              <p>
                <strong>Saved:</strong>{" "}
                {new Date(place.createdAt).toLocaleDateString()}
              </p>
              <button
                className="delete-button"
                onClick={() => handleDelete(place.id)}
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
