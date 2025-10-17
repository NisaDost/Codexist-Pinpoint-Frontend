import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8070";

export const searchNearbyPlaces = async (
  longitude,
  latitude,
  radius,
  type = ""
) => {
  try {
    const params = {
      longitude,
      latitude,
      radius,
    };

    if (type) {
      params.type = type;
    }

    const response = await axios.get(`${API_BASE_URL}/api/places/nearby`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    throw error;
  }
};

export const getSavedPlaces = (userId) => {
  const savedPlaces = localStorage.getItem("savedPlaces");
  if (!savedPlaces) return [];

  const allPlaces = JSON.parse(savedPlaces);
  return allPlaces[userId] || [];
};

export const savePlace = (userId, place) => {
  const savedPlaces = localStorage.getItem("savedPlaces");
  let allPlaces = savedPlaces ? JSON.parse(savedPlaces) : {};

  if (!allPlaces[userId]) {
    allPlaces[userId] = [];
  }

  const exists = allPlaces[userId].some((p) => p.place_id === place.place_id);
  if (!exists) {
    allPlaces[userId].push(place);
    localStorage.setItem("savedPlaces", JSON.stringify(allPlaces));
  }

  return allPlaces[userId];
};

export const deletePlace = (userId, placeId) => {
  const savedPlaces = localStorage.getItem("savedPlaces");
  if (!savedPlaces) return [];

  let allPlaces = JSON.parse(savedPlaces);
  if (allPlaces[userId]) {
    allPlaces[userId] = allPlaces[userId].filter((p) => p.place_id !== placeId);
    localStorage.setItem("savedPlaces", JSON.stringify(allPlaces));
  }

  return allPlaces[userId] || [];
};
