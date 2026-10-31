// src/components/About.jsx
import React from 'react';
import { ArrowUpRight, Award, GraduationCap, Code2, MapPin } from 'lucide-react';
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
              I am a 3rd-year Information Technology engineer at SFIT, Mumbai, obsessed with building
              systems that perform as reliably under heavy load as a precision-tuned sports engine.
            </p>
            <p>
              From architecting relational database schemas with Prisma and PostgreSQL to engineering
              interactive WebGL 3D viewports in React, I treat digital product design with the same
              discipline found in motorsport engineering: clean structure, zero bloat, and uncompromising craft.
            </p>
          </motion.div>

          {/* Automotive Engineering Spec Table */}
          <motion.div className="about-spec-grid" variants={fadeUp}>
            <div className="spec-item">
              <span className="spec-label">EDUCATION</span>
              <span className="spec-value">B.E. INFORMATION TECHNOLOGY</span>
              <span className="spec-sub">SFIT, MUMBAI · CGPA 8.50</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">LEADERSHIP</span>
              <span className="spec-value">IEEE SFIT TECHNICAL EXECUTIVE</span>
              <span className="spec-sub">ORGANIZING TECH WORKSHOPS & HACKATHONS</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">ALGORITHMS</span>
              <span className="spec-value">195+ LEETCODE SOLVED</span>
              <span className="spec-sub">JAVA · ARRAYS, DP, TREES & GRAPHS</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">LOCATION</span>
              <span className="spec-value">MUMBAI, INDIA</span>
              <span className="spec-sub">OPEN TO GLOBAL REMOTE & RELOCATION</span>
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
