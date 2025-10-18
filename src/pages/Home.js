import React, { useState, useEffect } from "react";
import Map from "../components/Map";
import SearchForm from "../components/SearchForm";
import PlacesList from "../components/PlacesList";
import {
  searchNearbyPlaces,
  savePlace,
  getSavedPlaces,
  deletePlace,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [longitude, setLongitude] = useState("27.1428");
  const [latitude, setLatitude] = useState("38.4237");
  const [radius, setRadius] = useState("1500");
  const [type, setType] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedPlaceIds, setSavedPlaceIds] = useState(new Set());

  const center = {
    lat: parseFloat(latitude) || 38.4237,
    lng: parseFloat(longitude) || 27.1428,
  };

  useEffect(() => {
    if (user) {
      fetchSavedPlaces();
    } else {
      setSavedPlaceIds(new Set());
    }
  }, [user]);

  const fetchSavedPlaces = async () => {
    try {
      const savedPlaces = await getSavedPlaces();
      const placeIds = new Set(savedPlaces.map((place) => place.placeId));
      setSavedPlaceIds(placeIds);
    } catch (errorInfo) {
      console.error("Error fetching saved places:", errorInfo);
    }
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case "longitude":
        setLongitude(value);
        break;
      case "latitude":
        setLatitude(value);
        break;
      case "radius":
        setRadius(value);
        break;
      case "type":
        setType(value);
        break;
      default:
        break;
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchNearbyPlaces(latitude, longitude, radius, type);
      setPlaces(data.results || data || []);
    } catch (errorInfo) {
      if (errorInfo.status === 429) {
        alert(
          "Rate Limit Exceeded\n\nYou've made too many requests. Please wait a moment and try again."
        );
      } else if (errorInfo.status === 400) {
        alert(`Invalid Parameters\n\n${errorInfo.message}`);
      } else if (errorInfo.status === 502) {
        alert(
          "External Service Error\n\nGoogle Places API is temporarily unavailable. Please try again later."
        );
      } else if (errorInfo.status === 0) {
        alert(
          "Connection Error\n\nCannot connect to backend. Make sure your server is running on port 8070."
        );
      } else {
        alert(
          `Error\n\n${
            errorInfo.message || "Failed to search places. Please try again."
          }`
        );
      }
      console.error("Search error:", errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e) => {
    setLatitude(e.latLng.lat().toString());
    setLongitude(e.latLng.lng().toString());
  };

  const handleSavePlace = async (place, selectedType) => {
    if (!user) {
      alert(
        "Authentication Required\n\nPlease create an account to save places."
      );
      return;
    }

    try {
      const placeData = {
        placeId: place.place_id,
        placeName: place.name,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        type: selectedType,
        address: place.vicinity || place.formatted_address || "",
        customName: place.name,
      };

      await savePlace(placeData);

      setSavedPlaceIds((prev) => new Set([...prev, place.place_id]));

      alert(`Success!\n\n${place.name} has been saved to your places.`);
    } catch (errorInfo) {
      if (errorInfo.status === 409) {
        alert(`Already Saved\n\n${errorInfo.message}`);
      } else if (errorInfo.status === 400 && errorInfo.validationErrors) {
        alert(
          `Validation Error\n\n${Object.values(errorInfo.validationErrors).join(
            "\n"
          )}`
        );
      } else if (errorInfo.status === 401) {
        alert(
          "Authentication Required\n\nYour session has expired. Please log in again."
        );
      } else if (errorInfo.status === 0) {
        alert(
          "Connection Error\n\nCannot connect to backend. Make sure your server is running."
        );
      } else {
        alert(
          `Error\n\n${
            errorInfo.message || "Failed to save place. Please try again."
          }`
        );
      }
      console.error("Save error:", errorInfo);
    }
  };

  const handleDeletePlace = async (place) => {
    if (!user) {
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to remove ${place.name} from saved places?`
      )
    ) {
      return;
    }

    try {
      const savedPlaces = await getSavedPlaces();
      const savedPlace = savedPlaces.find(
        (sp) => sp.placeId === place.place_id
      );

      if (savedPlace) {
        await deletePlace(savedPlace.id);

        setSavedPlaceIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(place.place_id);
          return newSet;
        });

        alert(`Success!\n\n${place.name} has been removed from saved places.`);
      }
    } catch (errorInfo) {
      if (errorInfo.status === 404) {
        alert(`Not Found\n\n${errorInfo.message}`);
      } else if (errorInfo.status === 401) {
        alert(
          "Authentication Required\n\nYour session has expired. Please log in again."
        );
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
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <SearchForm
          longitude={longitude}
          latitude={latitude}
          radius={radius}
          type={type}
          onInputChange={handleInputChange}
          onSearch={handleSearch}
          loading={loading}
        />
        <PlacesList
          places={places}
          selectedType={type}
          onSavePlace={handleSavePlace}
          onDeletePlace={handleDeletePlace}
          savedPlaceIds={savedPlaceIds}
        />
      </div>
      <div className="map-container">
        <Map
          center={center}
          onMapClick={handleMapClick}
          places={places}
          radius={parseInt(radius) || 1500}
          savedPlaceIds={savedPlaceIds}
        />
      </div>
    </div>
  );
};

export default Home;
