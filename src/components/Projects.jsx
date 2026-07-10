import React, { useState } from 'react';
import { ExternalLink, ArrowUpRight, Play, X, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { Github } from './Icons';
import { projects, miniProjects } from '../data/portfolio';
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
  const [showMiniProjects, setShowMiniProjects] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});

  const featured = projects.filter((p) => p.featured);
  const filtered =
    active === 'all' ? projects.filter((p) => !p.featured) : projects.filter((p) => p.category === active && !p.featured);

  const showFeatured = active === 'all';

  const toggleProjectExpand = (title) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

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
      case 'World Tracker':
        return '/projects/world-tracker.png';
      case 'World Capital Quiz':
        return '/projects/capital-quiz.png';
      case 'C++ Website Redesign':
        return '/projects/cpp-redesign.png';
      case 'Drum Kit':
        return '/projects/drums.png';
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
            {featured.map((project, i) => {
              const isExpanded = !!expandedProjects[project.title];
              return (
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

                    {/* Expandable Case Study Details */}
                    {isExpanded && (
                      <div className="featured-collapsible-details">
                        {project.problem && (
                          <div className="featured-problem">
                            <span className="featured-problem-label">Problem</span>
                            <p className="featured-problem-text">{project.problem}</p>
                          </div>
                        )}
                        {project.architecture && (
                          <div className="featured-architecture">
                            <span className="featured-arch-label">Architecture</span>
                            <code className="featured-arch-code">{project.architecture}</code>
                          </div>
                        )}
                        {project.highlights && (
                          <ul className="featured-highlights">
                            {project.highlights.map((h) => (
                              <li key={h}>{h}</li>
                            ))}
                          </ul>
                        )}
                        {project.challenges && (
                          <div className="featured-challenges">
                            <span className="featured-challenge-label">Key Challenge</span>
                            <p className="featured-challenge-text">{project.challenges}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="featured-toggle-wrapper">
                      <button
                        type="button"
                        className="featured-toggle-btn"
                        onClick={() => toggleProjectExpand(project.title)}
                      >
                        <span>{isExpanded ? 'Hide Details' : 'Read Case Study'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>

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
                  
                  <div className="featured-image-wrapper" onClick={() => !project.demoVideo && window.open(project.liveUrl, '_blank')}>
                    {/* Browser Chrome Frame */}
                    <div className="browser-chrome-frame">
                      <div className="browser-chrome-header">
                        <div className="browser-chrome-dots">
                          <span className="chrome-dot dot-red" />
                          <span className="chrome-dot dot-yellow" />
                          <span className="chrome-dot dot-green" />
                        </div>
                        <div className="browser-chrome-address-bar">
                          <span>{project.liveUrl.replace('https://', '')}</span>
                        </div>
                      </div>
                      <div className="browser-chrome-body">
                        <img
                          src={getProjectImage(project.title)}
                          alt={`${project.title} Screenshot`}
                          className="featured-screenshot"
                        />
                      </div>
                    </div>
                    
                    <div className="screenshot-overlay" />
                    
                    {project.demoVideo ? (
                      <button
                        type="button"
                        className="featured-preview-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVideo(project.demoVideo);
                        }}
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowUpRight size={32} className="preview-arrow-icon" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="projects-grid">
          {(active === 'all' ? filtered : projects.filter((p) => p.category === active)).map((project, i) => (
            <article key={project.title} className="project-card card reveal-scale" style={{ transitionDelay: `${i * 0.06}s` }}>
              <div className="grid-project-image-wrapper">
                {/* Browser Frame for standard cards */}
                <div className="browser-chrome-frame mini-frame">
                  <div className="browser-chrome-header">
                    <div className="browser-chrome-dots">
                      <span className="chrome-dot dot-red" />
                      <span className="chrome-dot dot-yellow" />
                      <span className="chrome-dot dot-green" />
                    </div>
                  </div>
                  <div className="browser-chrome-body">
                    <img
                      src={getProjectImage(project.title)}
                      alt={`${project.title} Screenshot`}
                      className="grid-project-screenshot"
                    />
                  </div>
                </div>
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

        {/* Mini Projects Section Toggle */}
        <div className="mini-projects-toggle reveal">
          <button
            type="button"
            className={`btn ${showMiniProjects ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowMiniProjects(!showMiniProjects)}
          >
            <span>{showMiniProjects ? 'Hide Mini Projects' : 'Mini Projects'}</span>
            <ChevronDown size={16} className={`toggle-arrow ${showMiniProjects ? 'rotated' : ''}`} />
          </button>
        </div>

        {/* Collapsible Mini Projects Grid */}
        {showMiniProjects && (
          <div className="mini-projects-container">
            <div className="mini-projects-header">
              <h3>Frontend Mini Projects</h3>
              <p>
                A collection of client-side projects showcasing interactive UI features, api integrations, and clean codebases.
              </p>
            </div>
            <div className="projects-grid">
              {miniProjects.map((project, i) => (
                <article
                  key={project.title}
                  className="project-card card"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="grid-project-image-wrapper">
                    <div className="browser-chrome-frame mini-frame">
                      <div className="browser-chrome-header">
                        <div className="browser-chrome-dots">
                          <span className="chrome-dot dot-red" />
                          <span className="chrome-dot dot-yellow" />
                          <span className="chrome-dot dot-green" />
                        </div>
                      </div>
                      <div className="browser-chrome-body">
                        <img
                          src={getProjectImage(project.title)}
                          alt={`${project.title} Screenshot`}
                          className="grid-project-screenshot"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="project-card-content">
                    <div className="project-top">
                      <span className="project-dot" style={{ background: project.accent }} />
                      {project.date && <span className="project-date">{project.date}</span>}
                    </div>
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-desc">{project.description}</p>
                    <div className="project-tags">
                      {project.tech.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
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
        )}
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
