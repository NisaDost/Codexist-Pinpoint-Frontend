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

  // Fetch saved places when user logs in
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
    } catch (error) {
      console.error("Error fetching saved places:", error);
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
    } catch (error) {
      if (error.request) {
        alert(
          "Cannot connect to backend. Make sure your server is running on port 8070."
        );
      } else {
        alert("Error searching places. Please try again.");
      }
      console.error(error);
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
      alert("Please create an account to save places.");
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

      // Update saved places set
      setSavedPlaceIds((prev) => new Set([...prev, place.place_id]));

      alert(`${place.name} saved successfully!`);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Error saving place.");
      } else if (error.request) {
        alert("Cannot connect to backend. Make sure your server is running.");
      } else {
        alert("Error saving place. Please try again.");
      }
      console.error(error);
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
      // First, we need to find the saved place ID from our saved places
      const savedPlaces = await getSavedPlaces();
      const savedPlace = savedPlaces.find(
        (sp) => sp.placeId === place.place_id
      );

      if (savedPlace) {
        await deletePlace(savedPlace.id);

        // Update saved places set
        setSavedPlaceIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(place.place_id);
          return newSet;
        });

        alert(`${place.name} removed from saved places!`);
      }
    } catch (error) {
      if (error.request) {
        alert("Cannot connect to backend. Make sure your server is running.");
      } else {
        alert("Error deleting place. Please try again.");
      }
      console.error(error);
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
