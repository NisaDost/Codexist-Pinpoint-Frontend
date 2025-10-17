import React, { useState } from "react";
import Map from "../components/Map";
import SearchForm from "../components/SearchForm";
import PlacesList from "../components/PlacesList";
import { searchNearbyPlaces, savePlace } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [longitude, setLongitude] = useState("27.1428");
  const [latitude, setLatitude] = useState("38.4237");
  const [radius, setRadius] = useState("1500");
  const [type, setType] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const center = {
    lat: parseFloat(latitude) || 38.4237,
    lng: parseFloat(longitude) || 27.1428,
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
      const data = await searchNearbyPlaces(longitude, latitude, radius, type);
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

  const handleSavePlace = async (place) => {
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
        address: place.vicinity || place.formatted_address || "",
        customName: place.name, 
      };

      await savePlace(placeData);
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
        <PlacesList places={places} onSavePlace={handleSavePlace} />
      </div>
      <div className="map-container">
        <Map center={center} onMapClick={handleMapClick} places={places} />
      </div>
    </div>
  );
};

export default Home;
