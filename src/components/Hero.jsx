import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, ArrowDown, FileText, CheckCircle2, MapPin, Copy, Check, Trophy, Users, GitBranch, Briefcase, Code2, Database, Container, Coffee, Cloud, Cpu, BookOpen, Zap } from 'lucide-react';
import { Github, Linkedin, Leetcode } from './Icons';
import { profile, stats, achievements, availableFor } from '../data/portfolio';
import './Hero.css';

/* Tech stack with colored icons */
const techStack = [
  { name: 'React', icon: Code2, color: '#61DAFB' },
  { name: 'Node.js', icon: Cpu, color: '#68A063' },
  { name: 'PostgreSQL', icon: Database, color: '#336791' },
  { name: 'Docker', icon: Container, color: '#2496ED' },
  { name: 'Java', icon: Coffee, color: '#ED8B00' },
];

/* Current focus tags */
const focusTags = [
  { label: 'Docker', icon: Container },
  { label: 'System Design', icon: Cpu },
  { label: 'Cloud / AWS', icon: Cloud },
  { label: 'DSA', icon: BookOpen },
  { label: 'Microservices', icon: Zap },
];

/* Achievement icon map */
const achievementIcons = {
  trophy: Trophy,
  users: Users,
  gitBranch: GitBranch,
};

const Counter = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
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
        setCount(end);
      } else {
        setCount(Math.floor(start) + (end.includes('+') ? '+' : ''));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}</span>;
};

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

            {/* Hero Name */}
            <h1 className="hero-name reveal-fade reveal-delay-1">
              Hi, I'm <span className="highlight-text">{profile.shortName}</span>
            </h1>

            {/* Fixed Role Titles — Problem 3 */}
            <h2 className="hero-roles reveal-fade reveal-delay-2">
              <span>Full Stack Developer</span>
              <span className="bullet-dot" />
              <span>Backend-Focused Dev</span>
            </h2>

            {/* Rewritten bio — Problem 2 */}
            <p className="hero-bio reveal-fade reveal-delay-2">
              Built 7+ full-stack production apps with React, Node.js, PostgreSQL & Docker.
              IEEE Technical Lead mentoring 100+ students. Passionate about scalable backend
              systems and currently exploring cloud engineering & system design.
            </p>

            {/* Personality quote — Problem 18 */}
            <p className="hero-quote reveal-fade reveal-delay-2">
              "I enjoy turning complex backend problems into clean, deployed products."
            </p>

            {/* Tech Stack with Icons — Problem 4 */}
            <div className="trust-checks-row reveal-fade reveal-delay-3">
              {techStack.map((tech) => {
                const Icon = tech.icon;
                return (
                  <div key={tech.name} className="trust-badge">
                    <Icon size={15} className="tech-icon" style={{ color: tech.color }} />
                    <span>{tech.name}</span>
                  </div>
                );
              })}
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

            {/* Available For — Problem 16 */}
            <div className="available-for-row reveal-fade reveal-delay-3">
              <span className="available-for-label">
                <Briefcase size={13} />
                Available For
              </span>
              <div className="available-for-tags">
                {availableFor.map((item) => (
                  <span key={item} className="available-tag">{item}</span>
                ))}
              </div>
            </div>

            {/* Social Connects + Email Copy — Problem 12 */}
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
              <button type="button" className="copy-email-btn" onClick={copyEmail} title="Copy email">
                {emailCopied ? <Check size={14} className="copy-icon copied" /> : <Copy size={14} className="copy-icon" />}
                <span className={`copy-tooltip ${emailCopied ? 'show' : ''}`}>
                  {emailCopied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>
          </div>

          <div className="hero-side reveal-right">
            {/* Profile Card — Problem 6: ACTIVE badge removed */}
            <div className="hero-profile card hero-card-float">
              <div className="card-ambient-light" />
              
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

            {/* Stat Blocks — Problems 7, 8, 9, 11, 20 */}
            <div className="hero-stats">
              <div className="stat-box card hero-card-float" style={{ animationDelay: '0.5s' }}>
                <span className="stat-num">
                  <Counter end={stats.projects} />
                </span>
                <span className="stat-lbl">Production Ready Projects</span>
                <span className="stat-sublabel">Deployed on Vercel / Render</span>
              </div>
              
              <div className="stat-box card hero-card-float" style={{ animationDelay: '1s' }}>
                <span className="stat-num">
                  <Counter end={stats.cgpa} />
                </span>
                <span className="stat-lbl">CGPA (IT)</span>
                <span className="stat-sublabel">out of 10.0</span>
              </div>

              <div className="stat-box card hero-card-float" style={{ animationDelay: '1.5s' }}>
                <span className="stat-num">
                  <Counter end={stats.problemsSolved} />
                </span>
                <span className="stat-lbl">Problems Solved</span>
                <span className="stat-sublabel">Java · DSA · TUF + LC</span>
              </div>

              {/* Expanded Current Focus — Problem 5 */}
              <div className="stat-box card stat-box-wide hero-card-float" style={{ animationDelay: '2s' }}>
                <div className="stat-currently-header">
                  <span className="stat-lbl-currently">CURRENT FOCUS</span>
                  <span className="status-dot-green animate-pulse-slow" />
                </div>
                <div className="focus-tags-grid">
                  {focusTags.map((tag) => {
                    const Icon = tag.icon;
                    return (
                      <span key={tag.label} className="focus-tag">
                        <Icon size={13} />
                        {tag.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Achievements — Problem 10 */}
            <div className="achievements-row">
              {achievements.map((a, i) => {
                const Icon = achievementIcons[a.icon];
                return (
                  <div key={a.label} className="achievement-card card hero-card-float" style={{ animationDelay: `${2.5 + i * 0.3}s` }}>
                    <div className="achievement-icon-wrap">
                      <Icon size={16} />
                    </div>
                    <div className="achievement-info">
                      <span className="achievement-label">{a.label}</span>
                      <span className="achievement-detail">{a.detail}</span>
                    </div>
                  </div>
                );
              })}
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
