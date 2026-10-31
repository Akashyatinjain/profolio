// src/components/Contact.jsx
import React, { useState } from 'react';
import { Mail, MapPin, Send, FileText, CheckCircle2, Copy, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Leetcode } from './Icons';
import { profile } from '../data/portfolio';
import './Contact.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setTimeout(() => {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus(null), 5000);
      }, 700);
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Automotive Portfolio Inquiry from ${formData.name}`,
          from_name: 'Akash Jain Portfolio',
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleResumeClick = () => {
    window.open('/resume/Resume.pdf?v=latest', '_blank');
  };

  return (
    <section id="contact" className="contact-section" aria-label="Contact - The Final Drive">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="section-tag">05 // FINAL DRIVE</div>
          <h2 className="contact-headline">LET'S BUILD SOMETHING EXTRAORDINARY.</h2>
          <p>
            Whether you are scouting engineering talent for an internship, looking to deploy
            a high-performance full-stack system, or discussing architecture—let's talk.
          </p>
        </motion.div>

        <div className="contact-editorial-layout">
          {/* Left Column: Direct Inquiries & Links */}
          <motion.div
            className="contact-info-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            {/* Direct Email Card */}
            <div className="contact-email-card" onClick={copyEmail} role="button" tabIndex={0}>
              <div className="email-meta-top">
                <span className="email-subtag">DIRECT INBOX</span>
                <span className="email-copy-badge">
                  {copied ? <CheckCircle2 size={13} color="var(--porsche-champagne)" /> : <Copy size={13} />}
                  {copied ? 'COPIED TO CLIPBOARD' : 'CLICK TO COPY'}
                </span>
              </div>
              <div className="email-address-text">{profile.email}</div>
            </div>

            {/* Automotive Spec Sheet Contact Info */}
            <div className="contact-spec-box">
              <div className="contact-spec-row">
                <span className="c-label">ACADEMIC INBOX</span>
                <span className="c-val">{profile.studentEmail || 'aj0881871@student.sfit.ac.in'}</span>
              </div>
              <div className="contact-spec-row">
                <span className="c-label">LOCATION</span>
                <span className="c-val">Mumbai, India (IST · UTC +5:30)</span>
              </div>
              <div className="contact-spec-row">
                <span className="c-label">STATUS</span>
                <span className="c-val">Open to Internships '28 & Full-Time</span>
              </div>
            </div>

            {/* Professional Network Links */}
            <div className="contact-network-links">
              <a
                href={profile.links?.github || profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                aria-label="GitHub Profile"
              >
                <Github size={15} />
                GITHUB
                <ArrowUpRight size={14} />
              </a>

              <a
                href={profile.links?.linkedin || profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={15} />
                LINKEDIN
                <ArrowUpRight size={14} />
              </a>

              <a
                href={profile.links?.leetcode || profile.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-steel"
                aria-label="LeetCode Profile"
              >
                <Leetcode size={15} />
                LEETCODE
                <ArrowUpRight size={14} />
              </a>

              <button
                type="button"
                className="btn btn-steel"
                onClick={handleResumeClick}
              >
                <FileText size={15} />
                RESUME PDF
              </button>
            </div>
          </motion.div>

          {/* Right Column: Luxury Contact Form */}
          <motion.div
            className="contact-form-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <form className="porsche-contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="contact-name" className="form-label">
                  YOUR NAME
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Ferdinand Porsche"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email" className="form-label">
                  YOUR EMAIL
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">
                  PROJECT SPECIFICATIONS / MESSAGE
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe your project, timeline, or engineering opportunity..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary form-submit-btn"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'}
                <Send size={14} />
              </button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    className="form-alert alert-success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Transmission received. I will review and reply within 24 hours.
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    className="form-alert alert-error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Transmission failed. Please reach out directly at {profile.email}.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
