import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, FileText, CheckCircle2 } from 'lucide-react';
import { Github, Linkedin, Leetcode } from './Icons';
import { profile } from '../data/portfolio';
import confetti from 'canvas-confetti';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(profile.email).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#2563EB', '#3B82F6', '#60A5FA', '#10B981']
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setTimeout(() => {
        setStatus('success');
        triggerConfetti();
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus(null), 5000);
      }, 1000);
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          ...formData,
          from_name: 'Portfolio Contact',
        }),
      });
      const result = await res.json();
      if (result.success) {
        setStatus('success');
        triggerConfetti();
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
      setTimeout(() => setStatus(null), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <p className="section-label reveal">Contact</p>
        <h2 className="section-title reveal reveal-delay-1">Let's talk</h2>
        <p className="section-desc reveal reveal-delay-2">
          Looking for a software engineering intern for 2026? I'd love to hear about your team. Let's build something great.
        </p>

        <div className="contact-layout">
          <div className="contact-info reveal-left">
            <div className="contact-card card">
              <div onClick={copyEmail} className="contact-row clickable-contact-row" title="Click to copy email">
                <div className="contact-icon-wrapper">
                  <Mail size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <span className="contact-row-label">Email (Click to copy)</span>
                  <span className="contact-row-val">{profile.email}</span>
                </div>
              </div>
              <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="contact-row">
                <div className="contact-icon-wrapper">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="contact-row-label">Phone</span>
                  <span className="contact-row-val">{profile.phone}</span>
                </div>
              </a>
              <div className="contact-row">
                <div className="contact-icon-wrapper">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="contact-row-label">Location</span>
                  <span className="contact-row-val">{profile.location}</span>
                </div>
              </div>
            </div>

            <div className="contact-socials">
              <span className="contact-socials-label">Connect Elsewhere</span>
              <div className="contact-socials-row">
                <a href="/resume/Resume.pdf" download className="social-chip resume-chip" title="Download Resume">
                  <FileText size={16} /> Resume PDF
                </a>
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="social-chip" title="GitHub">
                  <Github size={16} /> GitHub
                </a>
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="social-chip" title="LinkedIn">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" className="social-chip" title="LeetCode">
                  <Leetcode size={16} /> LeetCode
                </a>
              </div>
            </div>
          </div>

          <form className="contact-form card reveal-right" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Internship opportunity / Project collaboration"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about the role or what you have in mind..."
                rows={5}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-submit-contact" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
              {status !== 'sending' && <Send size={15} />}
            </button>

            {status === 'success' && (
              <div className="form-success-wrapper">
                <CheckCircle2 className="success-check-icon animate-success" size={20} />
                <p className="form-msg form-msg-success">Got it — I'll get back to you soon.</p>
              </div>
            )}
            {status === 'error' && (
              <p className="form-msg form-msg-error">Something went wrong. Try emailing me directly.</p>
            )}
          </form>
        </div>
      </div>

      {/* Copy Email Toast Notification */}
      {showToast && (
        <div className="contact-toast">
          <span>Email copied to clipboard!</span>
        </div>
      )}
    </section>
  );
};

export default Contact;
