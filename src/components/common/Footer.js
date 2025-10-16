import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <div className="text-center">
          <p className="mb-2">
            <strong>PinPoint</strong> - Find and Save Your Favorite Places
          </p>
          <p className="mb-0 text-muted">
            &copy; {new Date().getFullYear()} Case Study for Codexist by Nisa Dost.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
