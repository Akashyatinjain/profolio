// src/components/Projects.jsx
import React from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Github } from './Icons';
import { miniProjects } from '../data/portfolio';
import './Projects.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const featuredProjects = [
  {
    id: 'datastock',
    title: 'DATASTOCK',
    category: 'CLOUD STORAGE // FULL-STACK',
    date: 'Mar 2026',
    image: '/projects/datastock.png',
    liveUrl: 'https://data-stock.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/DataStock',
    description:
      'Secure cloud storage with 3-method auth: JWT, Google OAuth, and email OTP. Features folder hierarchy, Cloudinary CDN uploads up to 100 MB, and 6 interactive storage analytics charts.',
    technologies: ['React', 'Express', 'PostgreSQL', 'Prisma', 'Cloudinary', 'OAuth'],
    specs: [
      { label: 'AUTHENTICATION', value: 'JWT · Google OAuth · Email OTP' },
      { label: 'STORAGE PIPELINE', value: 'Cloudinary CDN (100MB/file)' },
      { label: 'DATABASE & ORM', value: 'PostgreSQL with Prisma' },
    ],
  },
  {
    id: 'finance-tracker',
    title: 'FINANCE TRACKER',
    category: 'FINTECH PLATFORM // FULL-STACK',
    date: 'Oct 2025',
    image: '/projects/finance-tracker.png',
    liveUrl: 'https://budget-tracker-no3.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/Budget-tracker-no3',
    description:
      'Budget automation app with Indian bank CSV import, custom spending thresholds, category-level trend charts, and automated notification alerts.',
    technologies: ['React', 'Express', 'PostgreSQL', 'Prisma', 'JWT', 'CSV Parser'],
    specs: [
      { label: 'CSV IMPORT ENGINE', value: 'Indian Bank Statements Parser' },
      { label: 'SPENDING ALERTS', value: 'Custom Category Thresholds' },
      { label: 'DATABASE SCHEMA', value: 'PostgreSQL Relational Storage' },
    ],
  },
  {
    id: 'minigpt',
    title: 'MINIGPT (AGENT AI)',
    category: 'AI ASSISTANT // FULL-STACK',
    date: 'Feb 2026',
    image: '/projects/agent-ai.png',
    liveUrl: 'https://miniakashagent.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/Agent',
    description:
      'AI assistant with dynamic intent routing: chat, RAG document search using pgvector, and real-time API tools. Multi-LLM abstraction with SSE streaming.',
    technologies: ['React', 'Express', 'pgvector', 'OpenAI', 'Gemini', 'SSE'],
    specs: [
      { label: 'INTENT ROUTING', value: 'Chat, RAG Search & API Tools' },
      { label: 'VECTOR DATABASE', value: 'pgvector Semantic Search' },
      { label: 'LLM STREAMING', value: 'Multi-LLM Abstraction with SSE' },
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
                        decoding="async"
                        fetchPriority="low"
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
                    <span className="project-date-pill">{project.date}</span>
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

        {/* Additional Projects Archive */}
        <motion.div
          className="additional-projects-wrapper"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <div className="archive-header">
            <div>
              <span className="archive-tag">FULL ARCHIVE // INTERACTIVE LABS</span>
              <h3 className="archive-title">ADDITIONAL PROJECTS.</h3>
            </div>
            <p className="archive-subtitle">
              Interactive utility apps, algorithm visualizers, and web platforms built for client needs and open exploration.
            </p>
          </div>

          <div className="archive-grid">
            {miniProjects.map((mini) => (
              <div key={mini.title} className="archive-card">
                <div className="archive-card-top">
                  <h4 className="archive-card-title">{mini.title}</h4>
                  <a
                    href={mini.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="archive-link-icon"
                    aria-label={`Open ${mini.title} live demo`}
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
                <p className="archive-card-desc">{mini.description}</p>
                <div className="archive-card-tags">
                  {mini.tech.map((t) => (
                    <span key={t} className="archive-tag-pill">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="archive-card-actions">
                  <a
                    href={mini.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="archive-cta-btn"
                  >
                    VIEW LIVE APP
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
