import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/api/auth/login", { username, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

// Places APIs
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

    const response = await api.get("/api/places/nearby", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    throw error;
  }
};

// Saved Places APIs
export const getSavedPlaces = async () => {
  try {
    const response = await api.get("/api/saved-places");
    return response.data;
  } catch (error) {
    console.error("Error fetching saved places:", error);
    throw error;
  }
};

export const savePlace = async (place) => {
  try {
    const response = await api.post("/api/saved-places", place);
    return response.data;
  } catch (error) {
    console.error("Error saving place:", error);
    throw error;
  }
};

export const deletePlace = async (id) => {
  try {
    const response = await api.delete(`/api/saved-places/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting place:", error);
    throw error;
  }
};
