// src/components/Projects.jsx
import React from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Github } from './Icons';
import './Projects.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const featuredProjects = [
  {
    id: 'finance-tracker',
    title: 'FINANCE TRACKER V2',
    category: 'FINTECH PLATFORM // FULL-STACK',
    image: '/projects/finance-tracker.png',
    liveUrl: 'https://budget-tracker-no3.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/finance-tracker-v2',
    description:
      'Full-stack personal finance and expense analytics engine. Features automated balance calculations, category spending visualizations, transaction filtering, and secure stateless JWT authentication.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT Auth', 'REST API'],
    specs: [
      { label: 'AUTHENTICATION', value: 'Stateless JWT & BCrypt' },
      { label: 'DATABASE', value: 'MongoDB Document Store' },
      { label: 'ANALYTICS', value: 'Real-time Category Breakdown' },
    ],
  },
  {
    id: 'datastock',
    title: 'DATASTOCK CLOUD DRIVE',
    category: 'DISTRIBUTED CLOUD STORAGE',
    image: '/projects/datastock.png',
    liveUrl: 'https://data-stock.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/datastock',
    description:
      'Production-ready cloud asset storage platform with multi-file uploads up to 100MB, nested folder hierarchies, starred items, and relational PostgreSQL metadata managed via Prisma ORM.',
    technologies: ['React', 'Express', 'PostgreSQL', 'Prisma ORM', 'Cloudinary CDN', 'Google OAuth'],
    specs: [
      { label: 'STORAGE PIPELINE', value: 'Cloudinary CDN (100MB/file)' },
      { label: 'ORM SCHEMA', value: 'PostgreSQL with Prisma' },
      { label: 'AUTH PROTOCOL', value: 'Google OAuth 2.0 & Email' },
    ],
  },
  {
    id: 'gpt-agent',
    title: 'AUTONOMOUS GPT AGENT',
    category: 'AI REASONING SYSTEM',
    image: '/projects/gptagent.png',
    liveUrl: 'https://res-gptagent.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/gpt-agent',
    description:
      'Conversational AI interface powered by OpenAI language models. Implements Server-Sent Events (SSE) for low-latency token streaming, multi-turn conversational context, and custom prompt workflows.',
    technologies: ['React', 'Node.js', 'OpenAI API', 'Streaming SSE', 'TailwindCSS'],
    specs: [
      { label: 'MODEL INFERENCE', value: 'OpenAI GPT Architecture' },
      { label: 'DATA STREAMING', value: 'Server-Sent Events (SSE)' },
      { label: 'STATE RUNTIME', value: 'Client Session Memory' },
    ],
  },
];

const Projects = () => {
  return (
    <section id="projects" className="projects-section" aria-label="Featured Projects - The Garage">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="section-tag">03 // THE GARAGE</div>
          <h2 className="projects-headline">FEATURED ARCHITECTURES.</h2>
          <p>
            Production-grade full-stack platforms, cloud storage engines, and AI reasoning pipelines
            engineered for resilience, clarity, and real-world utility.
          </p>
        </motion.div>

        {/* Campaign Showcases */}
        <div className="projects-campaign-list">
          {featuredProjects.map((project, index) => {
            const isReverse = index % 2 === 1;
            return (
              <motion.article
                key={project.id}
                className={`project-campaign-card ${isReverse ? 'reverse' : ''}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
              >
                {/* Media Showcase Column */}
                <div className="project-media-wrapper">
                  <div className="browser-mockup-frame">
                    <div className="mockup-header">
                      <div className="mockup-dots">
                        <span className="dot dot-red" />
                        <span className="dot dot-steel" />
                        <span className="dot dot-steel" />
                      </div>
                      <div className="mockup-url-bar">
                        <span>{project.liveUrl.replace('https://', '')}</span>
                      </div>
                    </div>
                    <div className="mockup-image-container">
                      <img
                        src={project.image}
                        alt={`${project.title} live interface preview`}
                        loading="lazy"
                        className="mockup-image"
                      />
                    </div>
                  </div>
                </div>

                {/* Editorial Details Column */}
                <div className="project-editorial-col">
                  <div className="project-pre-tag">
                    <span className="project-number">0{index + 1}</span>
                    <span className="project-category">{project.category}</span>
                  </div>

                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  {/* Technical Specs Table */}
                  <div className="project-spec-table">
                    {project.specs.map((s) => (
                      <div key={s.label} className="spec-row">
                        <span className="spec-row-label">{s.label}</span>
                        <span className="spec-row-value">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technology Pills */}
                  <div className="project-tech-tags" aria-label="Technologies used">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Campaign Action Links */}
                  <div className="project-cta-actions">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      LAUNCH APPLICATION
                      <ExternalLink size={14} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      <Github size={15} />
                      SOURCE CODE
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
