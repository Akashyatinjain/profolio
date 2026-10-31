// src/App.jsx
import React, { Suspense, lazy, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
const PorscheCanvas = lazy(() => import('./components/PorscheCanvas'));
import './App.css';

function DeferredPorscheCanvas({ onReady }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timeoutId;
    let idleId;
    timeoutId = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(() => setActive(true), { timeout: 1800 });
      } else {
        setActive(true);
      }
    }, 700);
    return () => {
      window.clearTimeout(timeoutId);
      if (idleId !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
    };
  }, []);

  return active ? <Suspense fallback={null}><PorscheCanvas onReady={onReady} /></Suspense> : null;
}

function App() {
  const [modelReady, setModelReady] = useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <DeferredPorscheCanvas onReady={() => setModelReady(true)} />
      <ScrollProgress />
      <Header />
      <main id="main-content">
        <Hero modelReady={modelReady} />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
