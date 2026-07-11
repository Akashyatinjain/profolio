import React from 'react';
import { experience } from '../data/portfolio';
import { Calendar, Briefcase } from 'lucide-react';
import './ExtraSections.css';

const ExtraSections = () => {
  return (
    <section id="experience" className="extra-sections">
      <div className="container">
        <div className="experience-activities-wrapper">
          <div className="extra-header">
            <p className="section-label reveal">
              <Briefcase size={14} />
              Leadership & Experience
            </p>
            <h2 className="section-title reveal reveal-delay-1">Beyond the code</h2>
            <p className="section-desc reveal reveal-delay-2">
              Hackathons, IEEE leadership, and community work that shaped how I build in teams.
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
      </div>
    </section>
  );
};

export default ExtraSections;
