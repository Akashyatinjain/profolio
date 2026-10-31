// src/components/About.jsx
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import './About.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const About = () => {
  return (
    <section id="about" className="about-section" aria-label="About Akash Yatin Jain">
      <div className="container about-container">
        {/* Left Column: Editorial Presentation */}
        <motion.div
          className="about-editorial-col"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div className="section-tag" variants={fadeUp}>
            01 // THE DRIVER
          </motion.div>

          <motion.h2 className="about-headline" variants={fadeUp}>
            CRAFTSMANSHIP AT THE INTERSECTION OF CODE & PERFORMANCE.
          </motion.h2>

          <motion.div className="about-body-text" variants={fadeUp}>
            <p>
              I am an Information Technology undergraduate at St. Francis Institute of Technology (SFIT), Mumbai,
              and an active freelance full-stack developer focused on building production-ready web applications.
            </p>
            <p>
              I work across the full application lifecycle: React frontend design, Express REST API architecture,
              PostgreSQL schema design with Prisma ORM, and cloud deployment with Docker, Render, and Vercel.
              Alongside client delivery, I solve DSA in Java with 212+ problems completed across LeetCode and
              Striver A2Z, while serving as Technical Executive in the IEEE Student Branch at SFIT.
            </p>
          </motion.div>

          {/* Automotive Engineering Spec Table */}
          <motion.div className="about-spec-grid" variants={fadeUp}>
            <div className="spec-item">
              <span className="spec-label">EDUCATION</span>
              <span className="spec-value">B.TECH IN INFORMATION TECHNOLOGY</span>
              <span className="spec-sub">SFIT, MUMBAI · CGPA 8.50 / 10 (2024–2028)</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">LEADERSHIP</span>
              <span className="spec-value">IEEE SFIT TECHNICAL EXECUTIVE</span>
              <span className="spec-sub">TECH WORKSHOPS, HACKATHONS & LOGISTICS</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">ALGORITHMS</span>
              <span className="spec-value">212+ DSA COMPLETED</span>
              <span className="spec-sub">84 LEETCODE · 128 STRIVER A2Z (JAVA)</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">LOCATION</span>
              <span className="spec-value">MUMBAI, MAHARASHTRA</span>
              <span className="spec-sub">OPEN TO INTERNSHIPS & FREELANCE</span>
            </div>
          </motion.div>

          {/* Developer Activity Telemetry */}
          <motion.div className="about-telemetry-bar" variants={fadeUp}>
            <div className="telemetry-pill">
              <span className="tel-val">{profile.developerActivity?.contributions || '1,376'}</span>
              <span className="tel-lbl">CONTRIBUTIONS</span>
            </div>
            <div className="telemetry-pill">
              <span className="tel-val">{profile.developerActivity?.yearCommits || '1,122'}</span>
              <span className="tel-lbl">YEAR COMMITS</span>
            </div>
            <div className="telemetry-pill">
              <span className="tel-val">{profile.developerActivity?.maxStreak || '72d'}</span>
              <span className="tel-lbl">MAX STREAK</span>
            </div>
            <div className="telemetry-pill">
              <span className="tel-val">{profile.developerActivity?.publicRepos || '40+'}</span>
              <span className="tel-lbl">PUBLIC REPOS</span>
            </div>
          </motion.div>

          <motion.div className="about-actions" variants={fadeUp}>
            <a
              href={profile.links?.github || profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              VIEW GITHUB ARCHIVE
              <ArrowUpRight size={15} />
            </a>
            <a
              href={profile.links?.linkedin || profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-steel"
            >
              LINKEDIN NETWORK
              <ArrowUpRight size={15} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column: Framing the 3D 911 Side Profile */}
        <div className="about-model-stage" aria-hidden="true">
          <div className="stage-telemetry-badge">
            <span className="badge-index">PROFILE // 90° SILHOUETTE</span>
            <span className="badge-name">1975 911 (930) TURBO</span>
            <span className="badge-spec">3.0L FLAT-6 · 260 HP · WHALE TAIL</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
