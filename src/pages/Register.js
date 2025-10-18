import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/api";
import { formatValidationErrors } from "../utils/errorHandler";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(username, email, password);

      const userData = response.user || { username, email };
      const token = response.token || response.accessToken;

      register(userData, token);
      navigate("/");
    } catch (errorInfo) {
      if (errorInfo.status === 409) {
        setError(errorInfo.message);
      } else if (errorInfo.status === 400 && errorInfo.validationErrors) {

        const validationMsg = formatValidationErrors(
          errorInfo.validationErrors
        );
        setError(validationMsg);
      } else if (errorInfo.status === 0) {
        setError(
          "Cannot connect to server. Make sure backend is running on port 8070."
        );
      } else {
        setError(errorInfo.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && (
        <div className="error-message" style={{ whiteSpace: "pre-line" }}>
          {error}
        </div>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            disabled={loading}
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="auth-link">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default Register;
