import React from 'react';
import { profile } from '../data/portfolio';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <span className="footer-name">{profile.name}</span>
          <span className="footer-copy">© {year}</span>
        </div>
        <div className="footer-links">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer">LeetCode</a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
