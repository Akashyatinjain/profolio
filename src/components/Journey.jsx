// src/components/Journey.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './Journey.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const timelineMilestones = [
  {
    period: 'JUL 2026 — PRESENT',
    phase: 'FREELANCE & CLIENT DELIVERY',
    title: 'Freelance Full-Stack Developer',
    lead: 'Designs, builds, and deploys responsive websites and full-stack apps for clients. Works with Next.js and React frontends, builds REST APIs and database architecture, and handles authentication and cloud deployment.',
    tags: ['Freelance', 'Full-Stack', 'Client Delivery', 'Next.js', 'React', 'Node.js', 'PostgreSQL'],
  },
  {
    period: 'JUL 2026 — PRESENT',
    phase: 'STUDENT TECHNICAL LEADERSHIP',
    title: 'Technical Executive — IEEE SFIT Student Branch',
    lead: 'Organizes technical workshops, coding events, and hackathons. Coordinates technical activities, campus logistics, and participant engagement across the engineering student community.',
    tags: ['Technical Leadership', 'Hackathons', 'Event Logistics', 'Collaboration'],
  },
  {
    period: '2026',
    phase: 'HACKATHON RECOGNITION',
    title: '2nd Runner-Up — SFIT Colloquium Hackathon 2026',
    lead: 'Awarded Certificate of Achievement at the SFIT Colloquium Hackathon 2026 technical exhibition for competitive full-stack software prototyping.',
    tags: ['Hackathon 2nd Runner-Up', 'Technical Exhibition', 'SFIT Colloquium'],
  },
  {
    period: '2026 — PRESENT',
    phase: 'ALGORITHMIC PROBLEM SOLVING',
    title: '212+ DSA Problems Completed in Java',
    lead: 'Completed 84 LeetCode problems (44 Easy, 37 Medium, 3 Hard) and 128 Striver A2Z problems (83 Easy, 33 Medium, 12 Hard). Focused on arrays, two pointers, binary search, trees, graphs, and dynamic programming.',
    tags: ['Java', '212+ Completed', '84 LeetCode', '128 Striver A2Z'],
  },
  {
    period: '2024 — 2028',
    phase: 'UNDERGRADUATE DEGREE',
    title: 'B.Tech in Information Technology — SFIT Mumbai',
    lead: 'Maintaining current CGPA of 8.50 / 10 at St. Francis Institute of Technology with focused coursework in Data Structures & Algorithms, DBMS, and Software Engineering.',
    tags: ['SFIT Mumbai', 'B.Tech IT', 'CGPA 8.50 / 10', 'Expected Mar 2028'],
  },
  {
    period: '2022 — 2024',
    phase: 'HIGHER SECONDARY EDUCATION',
    title: 'Class XII HSC (Science) — Sudarshan Jr. College',
    lead: 'Completed Class XII Higher Secondary Certificate in the Science stream with 76.2%, emphasizing mathematics, physical sciences, and computer fundamentals.',
    tags: ['Class XII Science', '76.2%', 'Sudarshan Jr. College'],
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
            client systems, hackathon wins, and technical leadership.
          </p>
        </motion.div>

        {/* Minimal Timeline Track */}
        <div className="timeline-track-wrapper">
          <div className="timeline-spine-line" aria-hidden="true" />

          <div className="timeline-entries-list">
            {timelineMilestones.map((item) => (
              <motion.article
                key={item.title}
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
