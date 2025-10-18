import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div style={{display: "flex", alignItems: "center", gap: ".8rem"}} >
        <img
          src="/logo.png"
          alt="Logo"
          style={{ height: "40px" }}
        />
        <h1>Codexist Pinpoint App</h1>
      </div>
      <nav>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/saved-places">Saved Places</Link>
            <span style={{ color: "#ecf0f1", marginLeft: "1.5rem" }}>
              Welcome, {user.username}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
