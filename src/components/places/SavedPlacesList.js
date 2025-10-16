import React, { useState, useEffect } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { savedPlacesAPI } from "../../services/api/savedPlaces.api";
import SavedPlaceCard from "./SavedPlaceCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { toast } from "react-toastify";

const SavedPlacesList = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await savedPlacesAPI.getSavedPlaces();
      setPlaces(data);
    } catch (err) {
      setError(err.message || "Failed to load saved places");
      toast.error("Failed to load saved places");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this place?")) {
      return;
    }

    try {
      await savedPlacesAPI.deleteSavedPlace(id);
      setPlaces(places.filter((place) => place.id !== id));
      toast.success("Place deleted successfully");
    } catch (err) {
      toast.error("Failed to delete place");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading saved places..." />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (places.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>No saved places yet</Alert.Heading>
        <p>
          Search for places on the map and save your favorites to see them here!
        </p>
      </Alert>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h4>
          📍 {places.length} Saved Place{places.length !== 1 ? "s" : ""}
        </h4>
      </div>

      <Row>
        {places.map((place) => (
          <Col key={place.id} md={6} lg={4} className="mb-4">
            <SavedPlaceCard place={place} onDelete={handleDelete} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SavedPlacesList;
