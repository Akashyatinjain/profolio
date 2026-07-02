// src/components/Header.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Terminal } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'LeetCode', id: 'leetcode' },
    { label: 'Contact', id: 'contact' },
  ];

  // Toggle body scroll lock
  const toggleBodyScroll = useCallback((lock) => {
    if (lock) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, []);

  // Close mobile menu and unlock body scroll
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    toggleBodyScroll(false);
  }, [toggleBodyScroll]);

  // Open mobile menu and lock body scroll
  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
    toggleBodyScroll(true);
  }, [toggleBodyScroll]);

  useEffect(() => {
    const handleScroll = () => {
      // Background scroll check
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Active section scroll detection
      const scrollPosition = window.scrollY + 120;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close mobile menu when viewport crosses desktop breakpoint
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    const handleResize = (e) => {
      if (e.matches) {
        closeMobileMenu();
      }
    };

    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, [closeMobileMenu]);

  // Cleanup body class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, []);

  const handleNavClick = (id) => {
    closeMobileMenu();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleBurgerClick = () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo" onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
          <Terminal size={22} className="text-purple-400" style={{ stroke: 'url(#hero-grad)' }} />
          <span>Akash Yatin Jain</span>
          <span className="logo-dot"></span>
        </div>

        {/* Desktop Nav */}
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.id}>
              <span
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Mobile Burger Toggle */}
        <button className="burger" onClick={handleBurgerClick} aria-label="Toggle menu">
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Dark overlay behind mobile menu */}
        <div
          className={`nav-overlay ${mobileMenuOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        ></div>

        {/* Mobile Navigation Drawer */}
        <ul className={`nav-menu-mobile ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-accent"></div>
          {navItems.map((item) => (
            <li key={item.id}>
              <span
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* SVG Linear Gradient for Terminal Icon */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </header>
  );
};

export default Header;
