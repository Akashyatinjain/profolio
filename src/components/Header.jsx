import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { profile } from '../data/portfolio';
import './Header.css';

const navItems = [
  { label: 'About', id: 'about' },
  { label: 'Work', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'DSA', id: 'leetcode' },
  { label: 'Contact', id: 'contact' },
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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      const pos = window.scrollY + 100;
      const sections = [{ id: 'home' }, ...navItems.map((n) => ({ id: n.id }))];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && pos >= el.offsetTop) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
    }
  };

  const handleResumeClick = () => {
    window.open('/resume/Resume.pdf', '_blank');
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <button type="button" className="logo" onClick={() => scrollTo('home')}>
          <span className="logo-mark">AJ</span>
          <span className="logo-name">{profile.shortName}</span>
        </button>

        <nav className="nav-desktop" aria-label="Main">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button type="button" className="btn btn-outline resume-header-btn" onClick={handleResumeClick}>
            <FileText size={15} />
            Resume
          </button>
          <button type="button" className="btn btn-primary header-cta" onClick={() => scrollTo('contact')}>
            Hire Me
          </button>
          <button
            type="button"
            className="burger"
            onClick={() => (mobileOpen ? closeMobile() : openMobile())}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={`nav-overlay ${mobileOpen ? 'open' : ''}`} onClick={closeMobile} aria-hidden="true" />

      <nav className={`nav-mobile ${mobileOpen ? 'open' : ''}`} aria-label="Mobile">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => scrollTo(item.id)}
          >
            {item.label}
          </button>
        ))}
        <button type="button" className="btn btn-outline" onClick={handleResumeClick} style={{ marginTop: '1rem' }}>
          <FileText size={15} /> Resume
        </button>
        <button type="button" className="btn btn-primary" onClick={() => scrollTo('contact')} style={{ marginTop: '0.5rem' }}>
          Get in touch
        </button>
      </nav>
    </header>
  );
};

export default Header;
