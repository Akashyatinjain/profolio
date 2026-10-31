// src/components/Hero.jsx
import React from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import './Hero.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const Hero = ({ modelReady }) => {

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section" aria-label="Introduction">
      <div className="container hero-container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Automotive Campaign Overhead Label */}
          <motion.div className="hero-eyebrow" variants={itemVariants}>
            <span className="eyebrow-accent" />
            <span className="eyebrow-author">AKASH YATIN JAIN</span>
            <span className="eyebrow-divider">/</span>
            <span className="eyebrow-role">CREATIVE DEVELOPER · FULL-STACK ENGINEER</span>
          </motion.div>

          {/* Monumental Editorial Headline */}
          <motion.h1 className="hero-headline" variants={itemVariants}>
            ENGINEERING
            <br />
            DIGITAL
            <br />
            <span className="headline-accent">EXPERIENCES.</span>
          </motion.h1>

          {/* Editorial Subcopy */}
          <motion.p className="hero-subcopy" variants={itemVariants}>
            Architecting production-ready full-stack systems, high-throughput backend APIs,
            and cinematic 3D interfaces with uncompromising automotive discipline.
          </motion.p>

          {/* Clean Action Buttons */}
          <motion.div className="hero-actions" variants={itemVariants}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => scrollTo('projects')}
            >
              EXPLORE PROJECTS
              <ArrowUpRight size={16} />
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => scrollTo('contact')}
            >
              GET IN TOUCH
            </button>
          </motion.div>

          <div className="hero-model-preview" aria-label="1975 Porsche 911 Turbo in British Racing Green">
            <img className={`hero-porsche-poster ${modelReady ? 'is-hidden' : ''}`} src="/porsche-preview.svg" alt="" aria-hidden="true" />
            <div className="hero-model-caption">
              <span>1975 PORSCHE 911 (930) TURBO</span>
              <span>BRITISH RACING GREEN</span>
            </div>
          </div>

          {/* Minimal Engineering Footnote */}
          <motion.div className="hero-meta" variants={itemVariants}>
            <div className="meta-item">
              <span className="meta-label">DISCIPLINE</span>
              <span className="meta-value">FULL-STACK & GRAPHICS</span>
            </div>
            <div className="meta-divider" />
            <div className="meta-item">
              <span className="meta-label">CENTERPIECE</span>
              <span className="meta-value">1975 PORSCHE 911 [930] TURBO</span>
            </div>
            <div className="meta-divider" />
            <div className="meta-item">
              <span className="meta-label">STATUS</span>
              <span className="meta-value">OPEN TO INTERNSHIPS '28</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          type="button"
          className="hero-scroll-cue"
          onClick={() => scrollTo('about')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          aria-label="Scroll to about section"
        >
          <span className="scroll-cue-text">SCROLL TO EXPLORE</span>
          <ArrowDown size={14} className="scroll-cue-icon" />
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
