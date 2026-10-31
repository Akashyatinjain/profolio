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

function DeferredPorscheCanvas({ onReady, onProgress, onError }) {
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

  return active ? <Suspense fallback={null}><PorscheCanvas onReady={onReady} onProgress={onProgress} onError={onError} /></Suspense> : null;
}

function App() {
  const [modelReady, setModelReady] = useState(false);
  const [modelProgress, setModelProgress] = useState(null);
  const [modelFailed, setModelFailed] = useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <DeferredPorscheCanvas onReady={() => setModelReady(true)} onProgress={setModelProgress} onError={() => setModelFailed(true)} />
      <ScrollProgress />
      <Header />
      <main id="main-content">
        <Hero modelReady={modelReady} modelProgress={modelProgress} modelFailed={modelFailed} />
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
