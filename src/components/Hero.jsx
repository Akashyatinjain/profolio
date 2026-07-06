import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDown, FileText, CheckCircle2, MapPin } from 'lucide-react';
import { Github, Linkedin, Leetcode } from './Icons';
import { profile, stats } from '../data/portfolio';
import './Hero.css';

const trustItems = [
  'React',
  'Node.js',
  'PostgreSQL',
  'Docker',
  'Java (DSA)'
];

const Counter = ({ end, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    // Extract number from string like "7+" or "60+"
    const numericEnd = parseInt(end.replace(/\D/g, ''));
    if (isNaN(numericEnd)) {
      setCount(end);
      return;
    }

    const totalSteps = 60;
    const stepTime = duration / totalSteps;
    const increment = numericEnd / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericEnd) {
        clearInterval(timer);
        setCount(end); // Set to final format with "+"
      } else {
        setCount(Math.floor(start) + (end.includes('+') ? '+' : ''));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}</span>;
};

const Hero = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  const handleResumeClick = () => {
    window.open('/resume/Resume.pdf', '_blank');
  };

  return (
    <section id="home" className="hero-section">
      {/* Decorative Grid and Ambient Lights */}
      <div className="grid-overlay" />
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      <div className="container">
        <div className="hero-grid">
          <div className="hero-main">
            {/* Availability Pill */}
            <div className="status-pill reveal-fade">
              {profile.available}
            </div>

            {/* Redesigned Hero Name & Typography */}
            <h1 className="hero-name reveal-fade reveal-delay-1">
              Hi, I'm <span className="highlight-text">{profile.shortName}</span>
            </h1>

            {/* Focused Core Role Titles */}
            <h2 className="hero-roles reveal-fade reveal-delay-2">
              <span>Full Stack Developer</span>
              <span className="bullet-dot" />
              <span>Backend Engineer</span>
            </h2>

            <p className="hero-bio reveal-fade reveal-delay-2">
              I specialize in taking products from database schemas to fully deployed user interfaces. I build robust auth flows, optimized REST APIs, and responsive frontends that tie the entire user journey together.
            </p>

            {/* Quick Trust Checks */}
            <div className="trust-checks-row reveal-fade reveal-delay-3">
              {trustItems.map((tech) => (
                <div key={tech} className="trust-badge">
                  <CheckCircle2 size={14} className="trust-icon" />
                  <span>{tech}</span>
                </div>
              ))}
            </div>

            {/* CTA Actions */}
            <div className="hero-actions reveal-fade reveal-delay-3">
              <button type="button" className="btn btn-primary btn-cta-main" onClick={() => scrollTo('projects')}>
                See my work
                <ArrowUpRight size={16} className="btn-arrow" />
              </button>
              <button type="button" className="btn btn-outline btn-resume" onClick={handleResumeClick}>
                <FileText size={16} />
                Get Resume
              </button>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-github-hero">
                <Github size={16} />
                GitHub
              </a>
            </div>

            {/* Social Connects */}
            <div className="hero-socials reveal-fade reveal-delay-4">
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" className="social-link" title="LeetCode">
                <Leetcode size={18} />
              </a>
              <div className="divider-vertical" />
              <a href={`mailto:${profile.email}`} className="social-link email-link">
                {profile.email}
              </a>
            </div>
          </div>

          <div className="hero-side reveal-right">
            {/* Revamped Profile Card with Visual Personality */}
            <div className="hero-profile card">
              <div className="card-ambient-light" />
              <div className="profile-badge-overlay">Active</div>
              
              <div className="avatar-wrapper">
                <img src={profile.avatar} alt={profile.name} className="hero-avatar" width={92} height={92} />
                <div className="avatar-ring-glow" />
              </div>

              <div className="hero-profile-info">
                <span className="hero-profile-name">{profile.name}</span>
                <span className="hero-profile-loc">
                  <MapPin size={13} className="loc-icon" />
                  {profile.location} · India
                </span>
              </div>
            </div>

            {/* Animated Stat Blocks */}
            <div className="hero-stats">
              <div className="stat-box card">
                <span className="stat-num">
                  <Counter end={stats.projects} />
                </span>
                <span className="stat-lbl">Live Projects</span>
                <div className="stat-mini-bar" style={{ width: '80%' }} />
              </div>
              
              <div className="stat-box card">
                <span className="stat-num">
                  <Counter end={stats.cgpa} />
                </span>
                <span className="stat-lbl">CGPA (IT)</span>
                <div className="stat-mini-bar" style={{ width: '85%', background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
              </div>

              <div className="stat-box card">
                <span className="stat-num">
                  <Counter end={stats.leetcodeDefault} />
                </span>
                <span className="stat-lbl">LeetCode Solved</span>
                <div className="stat-mini-bar" style={{ width: '70%', background: 'linear-gradient(90deg, #F59E0B, #FBBF24)' }} />
              </div>

              <div className="stat-box card stat-box-wide">
                <div className="stat-currently-header">
                  <span className="stat-lbl-currently">CURRENT FOCUS</span>
                  <span className="status-dot-green animate-pulse-slow" />
                </div>
                <span className="stat-current">
                  Building Cloud Storage apps & mastering Docker orchestrations.
                </span>
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="scroll-hint" onClick={() => scrollTo('about')} aria-label="Scroll down">
          <ArrowDown size={18} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
