// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, FolderGit, Award, Code2 } from 'lucide-react';
import { Github } from './Icons';
import './Hero.css';

const Hero = () => {
  const words = ['Java Developer', 'Full-Stack Engineer', 'DSA Problem Solver'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      const fullWord = words[currentWordIndex];
      if (!isDeleting) {
        // Typing
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === fullWord) {
          // Pause before deleting
          setIsDeleting(true);
          setTypingSpeed(2000); // Wait 2s
        }
      } else {
        // Deleting
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(50);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(500); // Pause before next word
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Decorative Orbs */}
      <div className="glow-orb glow-orb-purple"></div>
      <div className="glow-orb glow-orb-blue" style={{ top: '60%', left: '5%' }}></div>

      {/* Animated Floating Code Particles */}
      <div className="floating-code code-particle-1">{"{ class Java }"}</div>
      <div className="floating-code code-particle-2">{"public static void"}</div>
      <div className="floating-code code-particle-3">{"O(N log N)"}</div>
      <div className="floating-code code-particle-4">{"ArrayList<T>"}</div>
      <div className="floating-code code-particle-5">{"[]"}</div>
      <div className="floating-code code-particle-6">{"const React"}</div>

      {/* Decorative Floating Cards */}
      <div className="hero-deco-card hero-deco-card-1">
        <FolderGit size={16} />
        <span>6+ Projects Live</span>
      </div>
      <div className="hero-deco-card hero-deco-card-2">
        <Github size={16} />
        <span>700+ Github Contributions</span>
      </div>
      <div className="hero-deco-card hero-deco-card-3">
        <Award size={16} />
        <span>Java Developer</span>
      </div>
      <div className="hero-deco-card hero-deco-card-4">
        <Code2 size={16} />
        <span>200+ LeetCode Solved</span>
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-greeting">
            <span className="hero-greeting-line"></span>
            <span>Welcome to my universe</span>
          </div>

          <h1 className="hero-title">
            Hey, I'm <span className="gradient-text">Akash Yatin Jain</span>
          </h1>

          <div className="hero-subtitle">
            <span>I'm a</span>
            <span className="typed-text">
              {currentText}
              <span className="cursor">|</span>
            </span>
          </div>

          <p className="hero-desc">
            3rd Year IT student with an elite focus on <strong className="text-highlight">Java OOP</strong>, Data Structures & Algorithms, and modern Full-Stack development. 
            Actively building enterprise-ready solutions with secure cloud pipelines.
          </p>

          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => scrollToSection('projects')}>
              Explore Work
              <ArrowUpRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => scrollToSection('contact')}>
              Let's Connect
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
