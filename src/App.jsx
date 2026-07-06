// src/App.jsx
import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import ExtraSections from './components/ExtraSections';
import ProblemSolving from './components/ProblemSolving';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

function App() {
  useEffect(() => {
    // IntersectionObserver for scroll-reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after revealing for performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.02, // Lower threshold for mobile devices
        rootMargin: '0px 0px -20px 0px',
      }
    );

    // Helper to observe element nodes
    const observeElements = (container) => {
      const revealElements = container.querySelectorAll(
        '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)'
      );
      revealElements.forEach((el) => observer.observe(el));
    };

    // Observe initial layout
    observeElements(document);

    // Watch for dynamic DOM changes (like project category filters)
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          observeElements(document);
        }
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <ExtraSections />
        <ProblemSolving />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
