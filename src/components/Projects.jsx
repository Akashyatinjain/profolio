import React, { useState } from 'react';
import { ExternalLink, ArrowUpRight, Play, X, ShieldAlert } from 'lucide-react';
import { Github } from './Icons';
import { projects } from '../data/portfolio';
import './Projects.css';

const filters = [
  { id: 'all', label: 'All Projects' },
  { id: 'fullstack', label: 'Full-Stack' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'others', label: 'Other' },
];

const Projects = () => {
  const [active, setActive] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);

  const featured = projects.filter((p) => p.featured);
  const filtered =
    active === 'all' ? projects.filter((p) => !p.featured) : projects.filter((p) => p.category === active && !p.featured);

  const showFeatured = active === 'all';

  const getProjectImage = (title) => {
    switch (title) {
      case 'DataStock':
        return '/projects/datastock.png';
      case 'Finance Tracker':
        return '/projects/finance-tracker.png';
      case 'SWASTHYA':
        return '/projects/swasthya.png';
      case 'Keeper Notes':
        return '/projects/keeper.png';
      case 'Simon Game':
        return '/projects/simon.png';
      default:
        return '/projects/datastock.png';
    }
  };

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="projects-header">
          <p className="section-label reveal">Portfolio</p>
          <h2 className="section-title reveal reveal-delay-1">Things I've built</h2>
          <p className="section-desc reveal reveal-delay-2">
            Full-stack applications and interactive frontends. I focus on clean state management, modular APIs, and intuitive layouts.
          </p>
        </div>

        <div className="filter-row reveal reveal-delay-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-btn ${active === f.id ? 'active' : ''}`}
              onClick={() => setActive(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {showFeatured && (
          <div className="featured-list">
            {featured.map((project, i) => (
              <article
                key={project.title}
                className={`featured-card card reveal-scale ${i % 2 === 1 ? 'featured-reverse' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="featured-accent" style={{ background: project.accent }} />
                <div className="featured-content">
                  <div className="featured-top">
                    <span className="featured-date">{project.date}</span>
                    <span className="featured-live">Featured Project</span>
                  </div>
                  <h3 className="featured-title">{project.title}</h3>
                  <p className="featured-desc">{project.description}</p>
                  {project.highlights && (
                    <ul className="featured-highlights">
                      {project.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  )}
                  <div className="featured-tags">
                    {project.tech.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                  <div className="featured-actions">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Live Demo
                      <ExternalLink size={14} />
                    </a>
                    {project.demoVideo && (
                      <button 
                        type="button" 
                        className="btn btn-outline" 
                        onClick={() => setActiveVideo(project.demoVideo)}
                        style={{ borderColor: 'var(--accent-light)', color: 'var(--accent)' }}
                      >
                        <Play size={14} fill="var(--accent)" />
                        Watch Demo
                      </button>
                    )}
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      <Github size={14} />
                      Source Code
                    </a>
                  </div>
                </div>
                
                <div className="featured-image-wrapper">
                  <img
                    src={getProjectImage(project.title)}
                    alt={`${project.title} Screenshot`}
                    className="featured-screenshot"
                  />
                  <div className="screenshot-overlay" />
                  
                  {project.demoVideo ? (
                    <button
                      type="button"
                      className="featured-preview-link"
                      onClick={() => setActiveVideo(project.demoVideo)}
                      aria-label={`Watch Video Demo for ${project.title}`}
                    >
                      <Play size={24} fill="currentColor" />
                    </button>
                  ) : (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="featured-preview-link"
                      aria-label={`View Live ${project.title}`}
                    >
                      <ArrowUpRight size={32} className="preview-arrow-icon" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="projects-grid">
          {(active === 'all' ? filtered : projects.filter((p) => p.category === active)).map((project, i) => (
            <article key={project.title} className="project-card card reveal-scale" style={{ transitionDelay: `${i * 0.06}s` }}>
              <div className="grid-project-image-wrapper">
                <img
                  src={getProjectImage(project.title)}
                  alt={`${project.title} Screenshot`}
                  className="grid-project-screenshot"
                />
              </div>
              <div className="project-card-content">
                <div className="project-top">
                  <span className="project-dot" style={{ background: project.accent }} />
                  {project.date && <span className="project-date">{project.date}</span>}
                </div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="project-tags">
                  {project.tech.slice(0, 3).map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                  {project.tech.length > 3 && <span className="tag">+{project.tech.length - 3}</span>}
                </div>
                <div className="project-links">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                    Demo <ExternalLink size={12} />
                  </a>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                    Code <Github size={12} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Video Modal Overlay */}
      {activeVideo && (
        <div className="video-modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="video-modal-content card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="video-modal-close" onClick={() => setActiveVideo(null)}>
              <X size={20} />
            </button>
            <div className="video-aspect-wrapper">
              <video src={activeVideo} controls autoPlay className="modal-video-element" />
            </div>
            <div className="video-modal-footer">
              <ShieldAlert size={14} className="video-info-icon" />
              <span>Demo interaction walkthrough video file.</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
