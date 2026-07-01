// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <span className="footer-copyright">
          © {currentYear} Akash Yatin Jain. All rights reserved.
        </span>
        <span className="footer-tech">
          Made with <span className="footer-tech-heart">❤</span> using React, Vite & Vanilla CSS
        </span>
      </div>
    </footer>
  );
};

export default Footer;
