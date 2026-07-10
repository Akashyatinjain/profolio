import React from 'react';
import { profile } from '../data/portfolio';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        
        {/* Column 1: Branding & Copy */}
        <div className="footer-brand">
          <span className="footer-name">{profile.name}</span>
          <p className="footer-tagline">Designed & Developed by Akash Jain</p>
          <span className="footer-copy">© {year} · All Rights Reserved</span>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="footer-nav">
          <span className="footer-title">Navigation</span>
          <div className="footer-links-grid">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        {/* Column 3: Tech & Metadata Info */}
        <div className="footer-meta">
          <span className="footer-title">Metadata</span>
          <div className="footer-meta-items">
            <span className="footer-badge badge-react">React + Vite</span>
            <span className="footer-badge badge-date">Updated: July 2026</span>
          </div>
          <div className="footer-social-meta">
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <span className="meta-dot">•</span>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="meta-dot">•</span>
            <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer">LeetCode</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
