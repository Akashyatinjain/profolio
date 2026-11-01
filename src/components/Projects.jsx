// src/components/Projects.jsx
import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowUpRight, X, SlidersHorizontal, Shield, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github } from './Icons';
import { miniProjects } from '../data/portfolio';
import { playClick, playSwitch } from '../utils/soundEffects';
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
    video: '/videos/datastock.mp4',
    liveUrl: 'https://data-stock.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/DataStock',
    description:
      'Secure cloud storage platform with 3-method auth: JWT, Google OAuth, and email OTP. Features hierarchical folder management, Cloudinary CDN uploads up to 100 MB per file, and 6 interactive storage analytics charts.',
    technologies: ['React', 'Express', 'PostgreSQL', 'Prisma', 'Cloudinary', 'OAuth'],
    architecture: 'Client (React 19) ──▶ Express REST API ──▶ PostgreSQL (Prisma ORM) ──▶ Cloudinary CDN Stream (100MB chunked)',
    problem: 'Users required a private, self-hosted alternative to Google Drive with granular folder access permissions and realtime disk usage telemetry.',
    challenges: 'Handling concurrent multi-part binary streaming directly to Cloudinary without exhausting Node.js heap memory, while synchronizing hierarchical folder trees and file metadata in PostgreSQL.',
    demoCredentials: 'Instant guest access available directly on the landing page, or sign in using any test email OTP.',
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
    video: '/videos/financetracker.mp4',
    liveUrl: 'https://budget-tracker-no3.vercel.app/',
    githubUrl: 'https://github.com/Akashyatinjain/Budget-tracker-no3',
    description:
      'Automated personal finance platform featuring custom Indian bank statement CSV parsing, configurable category spending threshold alerts, and real-time financial trajectory visualization.',
    technologies: ['React', 'Express', 'PostgreSQL', 'Prisma', 'JWT', 'CSV Parser'],
    architecture: 'React Dashboard ──▶ Express API ──▶ In-Memory CSV Stream Parser ──▶ PostgreSQL Relational Ledger',
    problem: 'Mainstream budgeting tools fail to reliably parse varied statement formatting conventions across different Indian commercial banks.',
    challenges: 'Building a robust heuristic regex and streaming parser capable of reconciling heterogeneous CSV schemas from SBI, HDFC, and ICICI into a normalized transactional database ledger.',
    demoCredentials: 'Demo financial dataset preloaded. You can also upload test bank CSV statements directly on the dashboard.',
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
      'Autonomous reasoning assistant with dynamic intent routing across conversational chat, pgvector RAG document search, and external API tool invocation with Server-Sent Events (SSE) token streaming.',
    technologies: ['React', 'Express', 'pgvector', 'OpenAI', 'Gemini', 'SSE'],
    architecture: 'React Client ──▶ Intent Router ──▶ pgvector Embeddings (Cosine Sim) ──▶ Multi-LLM Gateway (SSE Stream)',
    problem: 'Bridging high-latency autonomous agent multi-step planning with instant, zero-delay conversational feedback for web users.',
    challenges: 'Structuring low-latency Server-Sent Events token multiplexing alongside background vector similarity queries using PostgreSQL pgvector extension.',
    demoCredentials: 'Open assistant sandbox — prompt directly with real-time SSE token response and tool execution.',
    specs: [
      { label: 'INTENT ROUTING', value: 'Chat, RAG Search & API Tools' },
      { label: 'VECTOR DATABASE', value: 'pgvector Semantic Search' },
      { label: 'LLM STREAMING', value: 'Multi-LLM Abstraction with SSE' },
    ],
  },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

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
          <div className="section-tag">04 // THE GARAGE</div>
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
                <div
                  className="project-media-wrapper"
                  onClick={() => {
                    playClick();
                    setSelectedProject(project);
                  }}
                  style={{ cursor: 'pointer' }}
                  title="Click to view full architecture & demo"
                >
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
                    <button
                      type="button"
                      className="btn btn-inspect"
                      onClick={() => {
                        playClick();
                        setSelectedProject(project);
                      }}
                    >
                      <SlidersHorizontal size={14} />
                      INSPECT ARCHITECTURE
                    </button>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      LAUNCH APP
                      <ExternalLink size={14} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      <Github size={15} />
                      SOURCE
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

      {/* Interactive Deep Dive Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="project-modal-container"
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-project-title"
            >
              {/* Modal Header */}
              <div className="project-modal-header">
                <div className="modal-header-info">
                  <span className="modal-pre-title">{selectedProject.category} · {selectedProject.date}</span>
                  <h3 id="modal-project-title" className="modal-title">{selectedProject.title}</h3>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => {
                    playSwitch();
                    setSelectedProject(null);
                  }}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="project-modal-body">
                {/* Video Demo (if available) */}
                {selectedProject.video ? (
                  <div className="modal-video-wrapper">
                    <video
                      controls
                      autoPlay
                      muted
                      playsInline
                      preload="metadata"
                      className="modal-video-player"
                      poster={selectedProject.image}
                    >
                      <source src={selectedProject.video} type="video/mp4" />
                      Your browser does not support HTML5 video preview.
                    </video>
                  </div>
                ) : (
                  <div className="modal-video-wrapper">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="modal-video-player"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Architecture Pipeline */}
                <div className="modal-arch-box">
                  <div className="modal-arch-title">
                    <Cpu size={15} color="#10b981" />
                    SYSTEM ARCHITECTURE PIPELINE
                  </div>
                  <div className="modal-arch-diagram">
                    {selectedProject.architecture}
                  </div>
                </div>

                {/* 2-Column Info: Problem & Engineering Challenges */}
                <div className="modal-grid-2col">
                  <div className="modal-info-card">
                    <div className="modal-card-label">PROBLEM SOLVED</div>
                    <p className="modal-card-text">{selectedProject.problem}</p>
                  </div>

                  <div className="modal-info-card">
                    <div className="modal-card-label">ENGINEERING CHALLENGES OVERCOME</div>
                    <p className="modal-card-text">{selectedProject.challenges}</p>
                  </div>
                </div>

                {/* Demo Credentials for Judges */}
                <div className="modal-credentials-box">
                  <Shield size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>TESTING INSTRUCTIONS FOR HACKATHON JUDGES:</strong>
                    <div style={{ marginTop: 4 }}>{selectedProject.demoCredentials}</div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="project-modal-footer">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <Github size={15} />
                  GITHUB SOURCE
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  OPEN LIVE PRODUCTION APP
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
