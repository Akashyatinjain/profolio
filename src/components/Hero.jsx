import React, { useState, useCallback } from 'react';
import { ArrowUpRight, FileText, Copy, Check } from 'lucide-react';
import { Github, Linkedin, Leetcode } from './Icons';
import { profile, stats } from '../data/portfolio';
import './Hero.css';

const heroStats = [
  { value: stats.projects, label: 'Live projects' },
  { value: stats.cgpa, label: 'CGPA' },
  { value: stats.problemsSolved, label: 'DSA solved' },
  { value: 'IEEE Lead', label: 'SFIT Tech Committee' },
];

const Hero = () => {
  const [emailCopied, setEmailCopied] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  const handleResumeClick = () => {
    window.open('/resume/Resume.pdf', '_blank');
  };

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(profile.email).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  }, []);

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-main">
            <div className="status-pill reveal">Open to internships · graduating May 2027</div>

            <h1 className="hero-name reveal reveal-delay-1">
              Hi, I'm <span className="highlight-text">{profile.shortName}</span>
            </h1>

            <p className="hero-role reveal reveal-delay-2">
              Full-Stack Developer · React, Node.js, PostgreSQL
            </p>

            <p className="hero-bio reveal reveal-delay-2">
              3rd-year IT student at SFIT, Mumbai. I take projects from database schema to a deployed UI —
              auth, APIs, and the frontend that ties it together. Currently building DataStock and Finance Tracker v2.
            </p>

            <div className="hero-stats-bar reveal reveal-delay-3">
              {heroStats.map((item) => (
                <div key={item.label} className="hero-stat-item">
                  <span className="hero-stat-value">{item.value}</span>
                  <span className="hero-stat-label">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="hero-actions reveal reveal-delay-3">
              <button type="button" className="btn btn-primary" onClick={() => scrollTo('projects')}>
                See my work
                <ArrowUpRight size={16} />
              </button>
              <button type="button" className="btn btn-outline" onClick={handleResumeClick}>
                <FileText size={16} />
                Download Resume
              </button>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <Github size={16} />
                GitHub
              </a>
            </div>

            <div className="hero-socials reveal reveal-delay-4">
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" className="social-link" title="LeetCode">
                <Leetcode size={18} />
              </a>
              <a href={`mailto:${profile.email}`} className="social-link email-link">
                {profile.email}
              </a>
              <button type="button" className="copy-email-btn" onClick={copyEmail} title="Copy email">
                {emailCopied ? <Check size={14} className="copy-icon copied" /> : <Copy size={14} className="copy-icon" />}
              </button>
            </div>
          </div>

          <div className="hero-preview reveal-right">
            <a
              href="https://data-stock.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-preview-card card"
            >
              <div className="browser-chrome-header">
                <div className="browser-chrome-dots">
                  <span className="chrome-dot dot-red" />
                  <span className="chrome-dot dot-yellow" />
                  <span className="chrome-dot dot-green" />
                </div>
                <div className="browser-chrome-address">data-stock.vercel.app</div>
              </div>
              <div className="hero-preview-image-wrap">
                <img src="/projects/datastock.png" alt="DataStock — cloud storage app" className="hero-preview-image" />
              </div>
              <div className="hero-preview-caption">
                <span className="hero-preview-label">Latest project</span>
                <span className="hero-preview-title">DataStock — Cloud Storage</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
