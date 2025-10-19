import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Calculate zoom level based on radius
const getZoomLevel = (radius) => {
  // Formula to convert radius (in meters) to approximate zoom level
  // This is a rough approximation for Google Maps
  if (radius >= 50000) return 9;
  if (radius >= 25000) return 10;
  if (radius >= 10000) return 11;
  if (radius >= 5000) return 12;
  if (radius >= 2500) return 13;
  if (radius >= 1000) return 14;
  if (radius >= 500) return 15;
  return 16;
};

const Map = ({ center, onMapClick, places, radius, savedPlaceIds = new Set() }) => {
  const [map, setMap] = useState(null);
  const [currentCenter, setCurrentCenter] = useState(center);
  const [isLoaded, setIsLoaded] = useState(false);
  const prevCenterRef = useRef(center);
  const animationFrameRef = useRef(null);

  const zoom = getZoomLevel(radius);

  // Smooth transition when center changes
  useEffect(() => {
    if (!map) return;

    const prevCenter = prevCenterRef.current;
    const newCenter = center;

    // Check if center actually changed
    if (prevCenter.lat === newCenter.lat && prevCenter.lng === newCenter.lng) {
      return;
    }

    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startTime = Date.now();
    const duration = 500; // 500ms transition

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-in-out)
      const easeInOutCubic =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const lat =
        prevCenter.lat + (newCenter.lat - prevCenter.lat) * easeInOutCubic;
      const lng =
        prevCenter.lng + (newCenter.lng - prevCenter.lng) * easeInOutCubic;

      setCurrentCenter({ lat, lng });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentCenter(newCenter);
        prevCenterRef.current = newCenter;
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [center, map]);

  // Update map center when currentCenter changes
  useEffect(() => {
    if (map && currentCenter) {
      map.panTo(currentCenter);
    }
  }, [currentCenter, map]);

  // Update zoom when radius changes
  useEffect(() => {
    if (map) {
      map.setZoom(zoom);
    }
  }, [zoom, map]);

  const onLoad = React.useCallback((mapInstance) => {
    setMap(mapInstance);
    setIsLoaded(true);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
    setIsLoaded(false);
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentCenter}
        zoom={zoom}
        onClick={onMapClick}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        }}
      >
        {/* Circle to show search radius - MUST be rendered BEFORE markers */}
        {/* Setting clickable to false makes the circle non-blocking */}
        <Circle
          center={currentCenter}
          radius={radius}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.5,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.15,
            clickable: false, // This is the KEY FIX - makes circle non-blocking
            zIndex: 1, // Lower z-index so markers appear above
          }}
        />

        {/* Main center marker with animation */}
        {isLoaded && (
          <Marker
            position={currentCenter}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize:
                isLoaded && window.google?.maps
                  ? new window.google.maps.Size(40, 40)
                  : undefined,
            }}
            zIndex={1000} // High z-index for center marker
          />
        )}

        {/* Place markers - Green for saved, Blue for unsaved */}
        {places &&
          places.map((place, index) => {
            const isSaved = savedPlaceIds.has(place.place_id);

            return (
              <Marker
                key={place.place_id || index}
                position={{
                  lat: place.geometry.location.lat,
                  lng: place.geometry.location.lng,
                }}
                title={place.name}
                icon={{
                  url: isSaved
                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" // Green for saved
                    : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Blue for unsaved
                }}
                zIndex={isSaved ? 100 : 50} // Saved places have higher z-index
              />
            );
          })}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;