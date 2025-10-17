import React, { useState } from "react";

const PLACE_TYPES = [
  { value: "", label: "All Types" },
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Cafe" },
  { value: "bar", label: "Bar" },
  { value: "store", label: "Store" },
  { value: "hospital", label: "Hospital" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "gas_station", label: "Gas Station" },
  { value: "bank", label: "Bank" },
  { value: "atm", label: "ATM" },
  { value: "gym", label: "Gym" },
  { value: "park", label: "Park" },
  { value: "museum", label: "Museum" },
  { value: "movie_theater", label: "Movie Theater" },
  { value: "shopping_mall", label: "Shopping Mall" },
  { value: "school", label: "School" },
  { value: "library", label: "Library" },
];

const SearchForm = ({
  longitude,
  latitude,
  radius,
  type,
  onInputChange,
  onSearch,
  loading,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <h2>Search Nearby Places</h2>

      <div className="form-group">
        <label>Longitude</label>
        <input
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => onInputChange("longitude", e.target.value)}
          placeholder="e.g., 27.1428"
          required
        />
      </div>

      <div className="form-group">
        <label>Latitude</label>
        <input
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => onInputChange("latitude", e.target.value)}
          placeholder="e.g., 38.4237"
          required
        />
      </div>

      <div className="form-group">
        <label>Radius (meters)</label>
        <input
          type="number"
          value={radius}
          onChange={(e) => onInputChange("radius", e.target.value)}
          placeholder="e.g., 1500"
          required
          min="1"
        />
      </div>

      <div className="form-group">
        <label>Place Type</label>
        <select
          value={type}
          onChange={(e) => onInputChange("type", e.target.value)}
        >
          {PLACE_TYPES.map((placeType) => (
            <option key={placeType.value} value={placeType.value}>
              {placeType.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="search-button" disabled={loading}>
        {loading ? "Searching..." : "Search Places"}
      </button>
    </form>
  );
};

export default SearchForm;
