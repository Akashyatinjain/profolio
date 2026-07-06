import React from 'react';
import { growthTimeline, experience, testimonials } from '../data/portfolio';
import { Calendar, Award, Quote, Milestone, Briefcase } from 'lucide-react';
import './ExtraSections.css';

const ExtraSections = () => {
  return (
    <section className="extra-sections">
      <div className="container">
        
        {/* Growth Timeline Section */}
        <div className="growth-timeline-wrapper">
          <div className="extra-header">
            <p className="section-label reveal">
              <Milestone size={14} style={{ color: 'var(--accent-light)' }} />
              Growth Roadmap
            </p>
            <h2 className="section-title reveal reveal-delay-1">Developer Journey</h2>
            <p className="section-desc reveal reveal-delay-2">
              A brief walkthrough of how my technical focus shifted from computer fundamentals to system orchestration.
            </p>
          </div>

          <div className="timeline-horizontal reveal-scale">
            {growthTimeline.map((item, idx) => (
              <div key={item.year} className="timeline-road-node">
                <div className="node-connector-line" />
                <div className="node-marker">
                  <span className="node-year-text">{item.year}</span>
                </div>
                <div className="node-card card">
                  <h4 className="node-title">{item.title}</h4>
                  <p className="node-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Experience / Leadership Activity Section */}
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

          <div className="experience-cards-grid">
            {experience.map((exp, idx) => (
              <div key={exp.role} className="exp-card card reveal-scale" style={{ transitionDelay: `${idx * 0.08}s` }}>
                <div className="exp-card-header">
                  <div className="exp-header-info">
                    <h3 className="exp-role">{exp.role}</h3>
                    <span className="exp-org">{exp.organization}</span>
                  </div>
                  <div className="exp-period-badge">
                    <Calendar size={13} />
                    <span>{exp.period}</span>
                  </div>
                </div>
                <p className="exp-desc">{exp.description}</p>
                <div className="exp-tags-row">
                  {exp.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Testimonials Quote Blocks */}
        <div className="testimonials-wrapper">
          <div className="extra-header">
            <p className="section-label reveal">
              <Award size={14} style={{ color: 'var(--accent-light)' }} />
              Testimonials
            </p>
            <h2 className="section-title reveal reveal-delay-1">What colleagues say</h2>
            <p className="section-desc reveal reveal-delay-2">
              Collaborative feedback from technical chairs, peers, and team partners.
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={t.author} className="testimonial-card card reveal-scale" style={{ transitionDelay: `${idx * 0.1}s` }}>
                <Quote size={24} className="testimonial-quote-icon" />
                <p className="testimonial-quote-text">"{t.quote}"</p>
                <div className="testimonial-author-row">
                  <div className="author-dot-avatar">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="testimonial-author-name">{t.author}</h4>
                    <span className="testimonial-author-role">{t.role}</span>
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
