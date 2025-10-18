export const handleApiError = (error, defaultMessage = "An error occurred") => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    // Check if we have a structured error response
    if (data && data.message) {
      return {
        status,
        message: data.message,
        error: data.error || "Error",
        validationErrors: data.validationErrors || null,
        timestamp: data.timestamp,
        path: data.path,
      };
    }

    // Fallback for non-structured errors
    return {
      status,
      message: data || defaultMessage,
      error: getErrorTitle(status),
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      status: 0,
      message:
        "Cannot connect to server. Please check if the backend is running on port 8070.",
      error: "Connection Error",
    };
  } else {
    // Something else happened
    return {
      status: 0,
      message: error.message || defaultMessage,
      error: "Error",
    };
  }
};

/**
 * Get user-friendly error title based on status code
 */
const getErrorTitle = (status) => {
  const titles = {
    400: "Invalid Request",
    401: "Authentication Failed",
    403: "Access Denied",
    404: "Not Found",
    409: "Conflict",
    429: "Rate Limit Exceeded",
    500: "Server Error",
    502: "Service Unavailable",
    503: "Service Unavailable",
  };
  return titles[status] || "Error";
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (validationErrors) => {
  if (!validationErrors) return null;

  return Object.entries(validationErrors)
    .map(([field, message]) => `${field}: ${message}`)
    .join("\n");
};

/**
 * Show error to user (can be customized for toast notifications, etc.)
 */
export const showError = (errorInfo) => {
  if (errorInfo.validationErrors) {
    const validationMsg = formatValidationErrors(errorInfo.validationErrors);
    alert(`${errorInfo.error}\n\n${validationMsg}`);
  } else {
    alert(`${errorInfo.error}\n${errorInfo.message}`);
  }
};

/**
 * Log error for debugging
 */
export const logError = (error, context = "") => {
  console.error(`Error${context ? ` in ${context}` : ""}:`, error);
  if (error.response) {
    console.error("Response data:", error.response.data);
    console.error("Status:", error.response.status);
  }
};
