import React from "react";
import { Alert } from "react-bootstrap";

const ErrorAlert = ({ message, onClose, variant = "danger" }) => {
  if (!message) return null;

  return (
    <Alert variant={variant} dismissible onClose={onClose} className="mb-3">
      <Alert.Heading>
        {variant === "danger" ? "❌ Error" : "ℹ️ Information"}
      </Alert.Heading>
      <p className="mb-0">{message}</p>
    </Alert>
  );
};

export default ErrorAlert;
