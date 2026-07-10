import React from 'react';
import { experience, technicalHighlights, engineeringHighlights } from '../data/portfolio';
import { Calendar, Briefcase, Shield, Server, Database, Cloud, Lock, Zap, CheckCircle2 } from 'lucide-react';
import './ExtraSections.css';

const highlightIcons = {
  shield: Shield,
  server: Server,
  database: Database,
  cloud: Cloud,
  lock: Lock,
  zap: Zap,
};

const ExtraSections = () => {
  return (
    <section className="extra-sections">
      <div className="container">

        {/* Engineering Highlights Section */}
        <div className="engineering-highlights-wrapper">
          <div className="extra-header highlights-header">
            <p className="section-label reveal">
              <Shield size={14} style={{ color: 'var(--accent-light)' }} />
              Highlights
            </p>
            <h2 className="section-title highlights-title reveal reveal-delay-1">
              Engineering Highlights
            </h2>
            <p className="section-desc reveal reveal-delay-2">
              Core backend development capabilities, system designs, security layers, and devops integrations.
            </p>
          </div>

          <div className="highlights-checklist-grid">
            {engineeringHighlights.map((item, idx) => (
              <div key={item} className="checklist-item reveal-scale" style={{ transitionDelay: `${idx * 0.04}s` }}>
                <CheckCircle2 size={18} className="check-icon" />
                <span className="checklist-text">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Experience / Leadership Activity Section (Vertical Timeline) */}
        <div className="experience-activities-wrapper">
          <div className="extra-header">
            <p className="section-label reveal">
              <Briefcase size={14} style={{ color: 'var(--accent-light)' }} />
              Leadership & Experience
            </p>
            <h2 className="section-title reveal reveal-delay-1">Hackathons & Extra-curriculars</h2>
            <p className="section-desc reveal reveal-delay-2">
              Applying software development patterns in team activities, technical clubs, and exhibitions.
            </p>
          </div>

          <div className="experience-timeline">
            <div className="timeline-vertical-line" />
            {experience.map((exp, idx) => (
              <div key={exp.role} className={`timeline-row reveal ${idx % 2 === 0 ? 'left-row' : 'right-row'}`}>
                <div className="timeline-dot-badge">
                  <Briefcase size={14} />
                </div>
                <div className="timeline-content card">
                  <div className="timeline-content-header">
                    <div>
                      <h3 className="timeline-role">{exp.role}</h3>
                      <span className="timeline-org">{exp.organization}</span>
                    </div>
                    <div className="timeline-period-badge">
                      <Calendar size={13} />
                      <span>{exp.period}</span>
                    </div>
                  </div>
                  <p className="timeline-desc">{exp.description}</p>
                  <div className="timeline-tags">
                    {exp.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Technical Highlights Section */}
        <div className="tech-highlights-wrapper">
          <div className="extra-header">
            <p className="section-label reveal">
              <Shield size={14} style={{ color: 'var(--accent-light)' }} />
              Technical Highlights
            </p>
            <h2 className="section-title reveal reveal-delay-1">Architecture & Capabilities</h2>
            <p className="section-desc reveal reveal-delay-2">
              A quick checklist of core backend competencies, database design, and optimization techniques.
            </p>
          </div>

          <div className="tech-highlights-grid">
            {technicalHighlights.map((highlight, idx) => {
              const IconComp = highlightIcons[highlight.icon] || Shield;
              return (
                <div key={highlight.label} className="tech-highlight-card reveal-scale" style={{ transitionDelay: `${idx * 0.06}s` }}>
                  <div className="tech-highlight-icon-wrap">
                    <IconComp size={18} />
                  </div>
                  <div className="tech-highlight-info">
                    <h4 className="tech-highlight-label">{highlight.label}</h4>
                    <p className="tech-highlight-detail">{highlight.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExtraSections;
