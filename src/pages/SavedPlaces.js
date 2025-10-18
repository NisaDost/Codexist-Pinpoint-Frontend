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
    } catch (errorInfo) {
      if (errorInfo.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (errorInfo.status === 0) {
        setError(
          "Cannot connect to backend. Make sure your server is running on port 8070."
        );
      } else {
        setError(errorInfo.message || "Failed to load saved places.");
      }
      console.error("Fetch saved places error:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, placeName) => {
    if (window.confirm(`Are you sure you want to delete ${placeName}?`)) {
      try {
        await deletePlace(id);
        setSavedPlaces(savedPlaces.filter((place) => place.id !== id));
        alert(`Success!\n\n${placeName} has been deleted.`);
      } catch (errorInfo) {
        if (errorInfo.status === 404) {
          alert(`Not Found\n\n${errorInfo.message}`);
          // Refresh the list in case it was already deleted
          fetchSavedPlaces();
        } else if (errorInfo.status === 401) {
          alert(
            "Authentication Required\n\nYour session has expired. Please log in again."
          );
          navigate("/login");
        } else if (errorInfo.status === 0) {
          alert(
            "Connection Error\n\nCannot connect to backend. Make sure your server is running."
          );
        } else {
          alert(
            `Error\n\n${
              errorInfo.message || "Failed to delete place. Please try again."
            }`
          );
        }
        console.error("Delete error:", errorInfo);
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
        <button
          className="search-button"
          onClick={fetchSavedPlaces}
          style={{ marginTop: "1rem" }}
        >
          Retry
        </button>
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
                onClick={() =>
                  handleDelete(place.id, place.customName || place.placeName)
                }
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
