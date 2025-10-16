import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const PlaceDetails = ({ place }) => {
  if (!place) {
    return <div>No place selected</div>;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>{place.name || place.customName}</Card.Title>

        <ListGroup variant="flush">
          {place.address && (
            <ListGroup.Item>
              <strong>Address:</strong> {place.address}
            </ListGroup.Item>
          )}

          {place.latitude && place.longitude && (
            <ListGroup.Item>
              <strong>Coordinates:</strong>
              <br />
              Lat: {place.latitude.toFixed(6)}
              <br />
              Lng: {place.longitude.toFixed(6)}
            </ListGroup.Item>
          )}

          {place.rating && (
            <ListGroup.Item>
              <strong>Rating:</strong> ⭐ {place.rating}
            </ListGroup.Item>
          )}

          {place.types && place.types.length > 0 && (
            <ListGroup.Item>
              <strong>Type:</strong> {place.types.join(", ")}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default PlaceDetails;
