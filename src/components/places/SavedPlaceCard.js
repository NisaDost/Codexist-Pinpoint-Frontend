import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

const SavedPlaceCard = ({ place, onDelete }) => {
  const handleViewOnMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    window.open(url, "_blank");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="h-100 shadow-sm hover-shadow">
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <Card.Title className="mb-2">{place.customName}</Card.Title>
          <Card.Subtitle className="text-muted small">
            {place.placeName}
          </Card.Subtitle>
        </div>

        {place.address && (
          <p className="text-muted small mb-2">📍 {place.address}</p>
        )}

        <div className="mb-3">
          <Badge bg="secondary" className="me-2">
            Lat: {place.latitude.toFixed(4)}
          </Badge>
          <Badge bg="secondary">Lng: {place.longitude.toFixed(4)}</Badge>
        </div>

        <p className="text-muted small mb-3">
          Saved on {formatDate(place.createdAt)}
        </p>

        <div className="mt-auto d-flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleViewOnMap}
            className="flex-grow-1"
          >
            🗺️ View on Map
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(place.id)}
          >
            🗑️ Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SavedPlaceCard;
