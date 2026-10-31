import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const navItems = [
  { label: 'ABOUT', id: 'about' },
  { label: 'SKILLS', id: 'skills' },
  { label: 'GARAGE', id: 'projects' },
  { label: 'JOURNEY', id: 'journey' },
  { label: 'CONTACT', id: 'contact' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    document.body.classList.remove('menu-open');
  }, []);

  const openMobile = useCallback(() => {
    setMobileOpen(true);
    document.body.classList.add('menu-open');
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) closeMobile();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, closeMobile]);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      const pos = window.scrollY + 120;
      const sections = [{ id: 'home' }, ...navItems.map((n) => ({ id: n.id }))];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && pos >= el.offsetTop) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile on resize
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const handler = (e) => e.matches && closeMobile();
    mq.addEventListener('change', handler);
    return () => {
      mq.removeEventListener('change', handler);
      document.body.classList.remove('menu-open');
    };
  }, [closeMobile]);

  const scrollTo = (id) => {
    closeMobile();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <button type="button" className="logo" onClick={() => scrollTo('home')}>
          <span className="logo-brand">AKASH YATIN JAIN</span>
          <span className="logo-model">911 TURBO HERITAGE</span>
        </button>

        <nav className="nav-desktop" aria-label="Main Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
              {activeSection === item.id && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-primary header-cta"
            onClick={() => scrollTo('contact')}
          >
            GET IN TOUCH
            <ArrowUpRight size={14} />
          </button>

          <button
            type="button"
            className="burger"
            onClick={() => (mobileOpen ? closeMobile() : openMobile())}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-navigation"
            className="nav-mobile"
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
            <div className="mobile-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => scrollTo('contact')}
              >
                GET IN TOUCH
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
