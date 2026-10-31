// src/components/Footer.jsx
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Github, Linkedin, Leetcode } from './Icons';
import { profile } from '../data/portfolio';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="porsche-footer">
      <div className="container footer-inner">
        {/* Left: Identity */}
        <div className="footer-brand-col">
          <span className="footer-title">AKASH YATIN JAIN</span>
          <span className="footer-sub">PORSCHE HERITAGE // MODERN MOTORSPORT</span>
        </div>

        {/* Center: Heritage Badge */}
        <div className="footer-center-col">
          <span className="heritage-badge">1975 911 TURBO [930]</span>
          <span className="heritage-note">REALTIME WEBGL · 60 FPS CHOREOGRAPHY</span>
        </div>

        {/* Right: Socials & Back to Top */}
        <div className="footer-actions-col">
          <div className="footer-social-row">
            <a
              href={profile.links?.github || profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="f-social-btn"
              aria-label="GitHub Profile"
            >
              <Github size={15} />
            </a>
            <a
              href={profile.links?.linkedin || profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="f-social-btn"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={15} />
            </a>
            <a
              href={profile.links?.leetcode || profile.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="f-social-btn"
              aria-label="LeetCode Profile"
            >
              <Leetcode size={15} />
            </a>
          </div>

          <button
            type="button"
            className="porsche-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            title="Return to top"
          >
            TOP
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
