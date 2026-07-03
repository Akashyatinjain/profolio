// src/components/Contact.jsx
import React, { useState } from 'react';
import { Mail, MapPin, Send, MessageSquareCode, Phone } from 'lucide-react';
import { Github, Instagram, Linkedin } from './Icons';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState(null); // 'sending', 'success', 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.warn("Web3Forms access key (VITE_WEB3FORMS_ACCESS_KEY) is missing in your .env file. Running in simulation mode.");
      setTimeout(() => {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setFormStatus(null), 5000); // Clear message after 5 seconds
      }, 1500);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: "Portfolio Contact Form"
        })
      });

      const result = await response.json();
      if (result.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setFormStatus(null), 5000);
      } else {
        console.error("Web3Forms submission error:", result);
        setFormStatus('error');
        setTimeout(() => setFormStatus(null), 5000);
      }
    } catch (error) {
      console.error("Web3Forms network error:", error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="glow-orb glow-orb-purple" style={{ bottom: '-100px', right: '15%' }}></div>
      <div className="container">
        <h2 className="section-title reveal">Get In Touch</h2>
        <p className="section-subtitle reveal reveal-delay-1">
          Have an exciting project suggestion, a job opportunity, or just want to chat? Shoot me a message!
        </p>

        <div className="contact-grid">
          {/* Info Panel */}
          <div className="contact-info-panel reveal-left">
            <div>
              <h3 className="contact-heading">Let's discuss something great</h3>
              <p className="contact-desc-text">
                I am actively seeking internship opportunities and entry-level positions where I can apply my cloud database knowledge and React full-stack experience.
              </p>
            </div>

            <div className="contact-methods">
              <div className="contact-method-card">
                <div className="method-icon-wrapper">
                  <Mail size={20} />
                </div>
                <div className="method-details">
                  <span className="method-label">Email Me</span>
                  <a href="mailto:aj0881871@student.sfit.ac.in" className="method-val">aj0881871@gmail.com</a>
                </div>
              </div>

              <div className="contact-method-card">
                <div className="method-icon-wrapper">
                  <Phone size={20} />
                </div>
                <div className="method-details">
                  <span className="method-label">Call Me</span>
                  <a href="tel:+917710926977" className="method-val">+91 7710926977</a>
                </div>
              </div>

              <div className="contact-method-card">
                <div className="method-icon-wrapper">
                  <MapPin size={20} />
                </div>
                <div className="method-details">
                  <span className="method-label">Location</span>
                  <span className="method-val">Mumbai, India</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="socials-title">Follow My Channels</h4>
              <div className="socials-row">
                <a
                  href="https://github.com/Akashyatinjain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn github"
                  title="GitHub Profile"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn linkedin"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://stackoverflow.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn stackoverflow"
                  title="StackOverflow"
                >
                  <MessageSquareCode size={20} />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn instagram"
                  title="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="glass-card reveal-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="What is this regarding?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={formStatus === 'sending'}
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
              >
                {formStatus === 'sending' ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={16} />
                  </>
                )}
              </button>

              {formStatus === 'success' && (
                <div className="form-success-msg">
                  🎉 Thank you! Your message has been sent successfully.
                </div>
              )}

              {formStatus === 'error' && (
                <div className="form-error-msg">
                  ❌ Something went wrong. Please check your network or try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
