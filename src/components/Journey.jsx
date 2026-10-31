// src/components/Journey.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import './Journey.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const timelineMilestones = [
  {
    period: '2026 — PRESENT',
    phase: 'LEADERSHIP & DISTRIBUTED SYSTEMS',
    title: 'IEEE SFIT Executive & Container Architecture',
    lead: 'Appointed Technical Executive at IEEE SFIT Student Branch. Organizing engineering hackathons and workshops while mastering Docker containerization, microservice decoupling, and system design.',
    tags: ['IEEE SFIT', 'Docker', 'System Design', 'Microservices'],
  },
  {
    period: 'EARLY 2026',
    phase: 'PRODUCTION CLOUD DEPLOYMENTS',
    title: 'DataStock & GPT Agent Deployments',
    lead: 'Architected and shipped DataStock (cloud asset management platform with Prisma ORM, PostgreSQL, and Cloudinary) and GPT Agent (real-time SSE streaming AI interface).',
    tags: ['PostgreSQL', 'Prisma ORM', 'OpenAI API', 'Cloudinary CDN'],
  },
  {
    period: 'LATE 2025',
    phase: 'BACKEND ARCHITECTURES & SECURITY',
    title: 'Stateless Authentication & Database Modeling',
    lead: 'Engineered Finance Tracker v2. Designed relational data schemas, bcrypt password hashing, and stateless JWT authorization pipelines handling multi-user financial transactions.',
    tags: ['Node.js', 'Express.js', 'JWT Auth', 'MongoDB', 'REST APIs'],
  },
  {
    period: '2025',
    phase: 'FULL-STACK SPRINT & HACKATHON',
    title: 'Colloquium 2026 Runner-Up & SWASTHYA',
    lead: 'Awarded 2nd Runner Up at Colloquium SFIT technical exhibition for pitching and engineering SWASTHYA full-stack health platform under intense 24-hour sprint constraints.',
    tags: ['Hackathon Runner-Up', 'React SPA', 'Component Architecture'],
  },
  {
    period: '2024',
    phase: 'ALGORITHMIC FOUNDATIONS',
    title: '195+ LeetCode Solutions & Computer Science Core',
    lead: 'Built foundational software engineering discipline in Java. Mastered arrays, two-pointer algorithms, dynamic programming, binary trees, and graph traversal at SFIT Mumbai.',
    tags: ['Java', 'Data Structures', '195+ LeetCode', 'SFIT Mumbai (CGPA 8.50)'],
  },
];

const Journey = () => {
  return (
    <section id="journey" className="journey-section" aria-label="Development Journey - The Evolution">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="section-tag">04 // THE EVOLUTION</div>
          <h2 className="journey-headline">ENGINEERING CHRONOLOGY.</h2>
          <p>
            The deliberate progression from core algorithmic fundamentals to production-grade
            cloud systems and technical leadership.
          </p>
        </motion.div>

        {/* Minimal Timeline Track */}
        <div className="timeline-track-wrapper">
          <div className="timeline-spine-line" aria-hidden="true" />

          <div className="timeline-entries-list">
            {timelineMilestones.map((item, index) => (
              <motion.article
                key={item.period}
                className="timeline-entry-row"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUp}
              >
                {/* Year Badge Column */}
                <div className="timeline-time-col">
                  <span className="milestone-period">{item.period}</span>
                  <span className="milestone-phase">{item.phase}</span>
                </div>

                {/* Marker Node */}
                <div className="timeline-node-pin" aria-hidden="true">
                  <span className="pin-dot" />
                </div>

                {/* Content Card */}
                <div className="timeline-card-col">
                  <h3 className="milestone-title">{item.title}</h3>
                  <p className="milestone-lead">{item.lead}</p>

                  <div className="milestone-tags" aria-label="Milestone key skills">
                    {item.tags.map((tag) => (
                      <span key={tag} className="milestone-tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
