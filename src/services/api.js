import axios from "axios";
import { handleApiError, logError } from "../utils/errorHandler";

const API_BASE_URL = process.env.API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    logError(error, error.config?.url);
    return Promise.reject(error);
  }
);

export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/api/auth/login", { username, password });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Login failed");
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
    throw handleApiError(error, "Registration failed");
  }
};

export const searchNearbyPlaces = async (
  latitude,
  longitude,
  radius,
  type = ""
) => {
  try {
    const params = {
      latitude: parseFloat(latitude.toString().replace(",", ".")),
      longitude: parseFloat(longitude.toString().replace(",", ".")),
      radius,
      type,
    };

    const response = await api.get("/api/places/nearby", { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch nearby places");
  }
};

export const getSavedPlaces = async () => {
  try {
    const response = await api.get("/api/saved-places");
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch saved places");
  }
};

export const savePlace = async (place) => {
  try {
    const response = await api.post("/api/saved-places", place);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to save place");
  }
};

export const deletePlace = async (id) => {
  try {
    const response = await api.delete(`/api/saved-places/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to delete place");
  }
};
