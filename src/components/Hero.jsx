// src/components/Hero.jsx
import React from 'react';
import { ArrowUpRight, ArrowDown, Lightbulb, Volume2, RotateCw, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { playClick, playSwitch } from '../utils/soundEffects';
import './Hero.css';

const containerVariants = {
  // The container must stay visible: a wrapper that starts at opacity 0 holds
  // back the largest-contentful-paint of the headline on phones.
  hidden: { opacity: 1 },
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

// The headline paints on the very first frame (transform-only entrance) so the
// LCP stays close to FCP instead of waiting for a fade-in.
const headlineVariants = {
  hidden: { opacity: 1, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const COLORS = [
  { id: '#083d20', name: 'BRG', label: 'British Racing Green' },
  { id: '#9e2929', name: 'Guards Red', label: 'Guards Red' },
  { id: '#7a8288', name: 'GT Silver', label: 'GT Silver Metallic' },
  { id: '#c27803', name: 'Speed Yellow', label: 'Speed Yellow' },
  { id: '#e2e8f0', name: 'White', label: 'Grand Prix White' },
  { id: '#14171a', name: 'Black', label: 'Midnight Black' },
];

const Hero = ({
  modelReady,
  modelProgress,
  modelFailed,
  modelDeferred,
  onRequestModel,
  carColor = '#083d20',
  onChangeCarColor,
  headlightsOn = true,
  onToggleHeadlights,
  inspectMode = false,
  onToggleInspectMode,
  onRevEngine,
}) => {

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
            <span className="eyebrow-role">FULL-STACK DEVELOPER & FREELANCER</span>
          </motion.div>

          {/* Monumental Editorial Headline */}
          <motion.h1 className="hero-headline" variants={headlineVariants}>
            ENGINEERING
            <br />
            DIGITAL
            <br />
            <span className="headline-accent">EXPERIENCES.</span>
          </motion.h1>

          {/* Editorial Subcopy */}
          <motion.p className="hero-subcopy" variants={itemVariants}>
            B.Tech IT student building production-ready web applications and digital products.
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
            <div className={`hero-loading-card has-poster ${modelReady ? 'is-hidden' : ''} ${modelDeferred ? 'is-deferred' : ''}`} aria-hidden={modelReady}>
              <img
                className="hero-car-poster"
                src="/images/porsche-911-turbo-mobile.webp"
                alt=""
                width="1400"
                height="560"
                decoding="async"
                fetchPriority="high"
              />
              <div className="loader-card-top">
                <span>STUTTGART · MODEL 930</span>
                <span className={`loader-status ${modelFailed || modelDeferred ? 'is-error' : ''}`}><i /> {modelFailed ? 'PREVIEW MODE' : modelDeferred ? 'ON DEMAND' : 'INITIALIZING'}</span>
              </div>
              <div className="loader-car-title">911 <span>TURBO</span></div>
              <div className="loader-card-bottom">
                {modelDeferred && !modelFailed ? null : (
                  <>
                    <span className={`loader-ring ${modelFailed ? 'is-error' : ''}`} aria-hidden="true" />
                    <div className="loader-progress-copy">
                      <span>{modelFailed ? '3D VIEW UNAVAILABLE' : modelProgress == null ? 'PREPARING SHOWROOM' : 'LOADING VEHICLE MODEL'}</span>
                      <div className={`loader-progress-track ${modelFailed ? 'is-error' : ''}`} role={modelFailed ? undefined : 'progressbar'} aria-label={modelFailed ? undefined : 'Loading 3D car model'} aria-valuemin={modelFailed ? undefined : '0'} aria-valuemax={modelFailed ? undefined : '100'} aria-valuenow={modelFailed ? undefined : modelProgress ?? undefined}>
                        {!modelFailed && <span className={modelProgress == null ? 'is-indeterminate' : ''} style={modelProgress == null ? undefined : { width: `${modelProgress}%` }} />}
                      </div>
                    </div>
                    {modelProgress != null && !modelFailed && <span className="loader-progress-number">{modelProgress}%</span>}
                  </>
                )}
              </div>
            </div>
            <div className="hero-model-caption">
              <span>1975 PORSCHE 911 (930) TURBO</span>
              <span>{COLORS.find((c) => c.id === carColor)?.label.toUpperCase() || 'BRITISH RACING GREEN'}</span>
              {modelDeferred && !modelFailed && (
                <button type="button" className="hero-model-action" onClick={onRequestModel}>
                  VIEW INTERACTIVE 3D <ArrowUpRight size={14} />
                </button>
              )}
            </div>

            {/* Interactive Showroom Configurator Deck */}
            <div className="hero-showroom-deck" role="toolbar" aria-label="Porsche 3D Showroom Configurator">
              <div className="showroom-deck-label">
                <Palette size={13} color="var(--porsche-champagne)" />
                <span>FINISH:</span>
                <div className="showroom-colors">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`color-swatch-btn ${carColor === c.id ? 'active' : ''}`}
                      style={{ backgroundColor: c.id }}
                      onClick={() => {
                        playClick();
                        onChangeCarColor?.(c.id);
                      }}
                      title={c.label}
                      aria-label={`Select ${c.label}`}
                    />
                  ))}
                </div>
              </div>

              <div className="showroom-controls">
                <button
                  type="button"
                  className={`deck-tool-btn ${headlightsOn ? 'active' : ''}`}
                  onClick={() => {
                    playSwitch();
                    onToggleHeadlights?.();
                  }}
                  title="Toggle Xenon Headlights"
                >
                  <Lightbulb size={12} />
                  <span>{headlightsOn ? 'BEAMS: ON' : 'BEAMS: OFF'}</span>
                </button>

                <button
                  type="button"
                  className="deck-tool-btn rev-btn"
                  onClick={() => onRevEngine?.()}
                  title="Rev 3.0L Flat-6 Boxer Engine"
                >
                  <Volume2 size={12} />
                  <span>REV FLAT-6</span>
                </button>

                <button
                  type="button"
                  className={`deck-tool-btn ${inspectMode ? 'active' : ''}`}
                  onClick={() => {
                    playSwitch();
                    onToggleInspectMode?.();
                  }}
                  title={inspectMode ? "Exit 360° Inspection (Press Escape)" : "Inspect Porsche 911 in 360 degrees"}
                >
                  <RotateCw size={12} />
                  <span>{inspectMode ? 'EXIT 360°' : '360° INSPECT'}</span>
                  {inspectMode && <kbd className="deck-esc-kbd">ESC</kbd>}
                </button>
              </div>
            </div>
          </div>

          {/* Minimal Engineering Footnote */}
          <motion.div className="hero-meta" variants={itemVariants}>
            <div className="meta-item">
              <span className="meta-label">DISCIPLINE</span>
              <span className="meta-value">FULL-STACK & FREELANCE</span>
            </div>
            <div className="meta-divider" />
            <div className="meta-item">
              <span className="meta-label">CENTERPIECE</span>
              <span className="meta-value">1975 PORSCHE 911 [930] TURBO</span>
            </div>
            <div className="meta-divider" />
            <div className="meta-item">
              <span className="meta-label">STATUS</span>
              <span className="meta-value">OPEN TO INTERNSHIPS & FREELANCE</span>
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
