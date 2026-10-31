// src/App.jsx
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
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

function isDataSaverOrSlowNetwork() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return false;
  if (connection.saveData === true) return true;
  return /(^|-)2g$/.test(connection.effectiveType || '');
}

function DeferredPorscheCanvas({ enabled, onReady, onProgress, onError, onDeferred }) {
  const [active, setActive] = useState(false);
  const callbacksRef = useRef({ onReady, onProgress, onError, onDeferred });
  callbacksRef.current = { onReady, onProgress, onError, onDeferred };

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // On phones, show the crisp poster first and only start WebGL when asked.
    if (isMobile && !enabled) {
      callbacksRef.current.onDeferred?.();
      if (isDataSaverOrSlowNetwork()) callbacksRef.current.onError?.();
      return undefined;
    }

    if (isDataSaverOrSlowNetwork()) {
      callbacksRef.current.onError?.();
      return undefined;
    }

    if (isMobile && enabled) {
      setActive(true);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setActive(true), 100);

    return () => window.clearTimeout(timeoutId);
  }, [enabled]);

  return active ? (
    <Suspense fallback={null}>
      <PorscheCanvas
        onReady={callbacksRef.current.onReady}
        onProgress={callbacksRef.current.onProgress}
        onError={callbacksRef.current.onError}
      />
    </Suspense>
  ) : null;
}

function App() {
  const [modelReady, setModelReady] = useState(false);
  const [modelProgress, setModelProgress] = useState(null);
  const [modelFailed, setModelFailed] = useState(false);
  const [modelDeferred, setModelDeferred] = useState(false);
  const [mobileModelRequested, setMobileModelRequested] = useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <DeferredPorscheCanvas
        enabled={mobileModelRequested}
        onReady={() => setModelReady(true)}
        onProgress={setModelProgress}
        onError={() => setModelFailed(true)}
        onDeferred={() => setModelDeferred(true)}
      />
      <ScrollProgress />
      <Header />
      <main id="main-content">
        <Hero
          modelReady={modelReady}
          modelProgress={modelProgress}
          modelFailed={modelFailed}
          modelDeferred={modelDeferred}
          onRequestModel={() => {
            setModelDeferred(false);
            setMobileModelRequested(true);
          }}
        />
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
