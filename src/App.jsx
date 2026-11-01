// src/App.jsx
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import ProblemSolving from './components/ProblemSolving';
import Projects from './components/Projects';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import Terminal from './components/Terminal';
import {
  initSoundPreference,
  setSoundEnabled,
  playEngineRev,
  playClick,
  playSwitch,
} from './utils/soundEffects';
const PorscheCanvas = lazy(() => import('./components/PorscheCanvas'));
import './App.css';

function isDataSaverOrSlowNetwork() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return false;
  if (connection.saveData === true) return true;
  return /(^|-)2g$/.test(connection.effectiveType || '');
}

function DeferredPorscheCanvas({
  enabled,
  onReady,
  onProgress,
  onError,
  onDeferred,
  carColor,
  headlightsOn,
  inspectMode,
}) {
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
        carColor={carColor}
        headlightsOn={headlightsOn}
        inspectMode={inspectMode}
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

  // Showroom Customization & Sound FX
  const [carColor, setCarColor] = useState('#083d20');
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [inspectMode, setInspectMode] = useState(false);
  const [soundOn, setSoundOn] = useState(() => initSoundPreference());
  const [terminalOpen, setTerminalOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleRevEngine = () => {
    playEngineRev();
  };

  // Keyboard shortcuts: Escape to exit 360 inspect mode or close terminal; ` or ~ to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (inspectMode) {
          e.preventDefault();
          playSwitch();
          setInspectMode(false);
          return;
        }
        if (terminalOpen) {
          setTerminalOpen(false);
          return;
        }
      } else if (e.key === '`' || e.key === '~') {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
          playSwitch();
          setTerminalOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectMode, terminalOpen]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <CustomCursor />
      <DeferredPorscheCanvas
        enabled={mobileModelRequested}
        onReady={() => setModelReady(true)}
        onProgress={setModelProgress}
        onError={() => setModelFailed(true)}
        onDeferred={() => setModelDeferred(true)}
        carColor={carColor}
        headlightsOn={headlightsOn}
        inspectMode={inspectMode}
      />
      <ScrollProgress />
      <Header
        soundOn={soundOn}
        onToggleSound={toggleSound}
        onOpenTerminal={() => setTerminalOpen(true)}
      />
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
          carColor={carColor}
          onChangeCarColor={setCarColor}
          headlightsOn={headlightsOn}
          onToggleHeadlights={() => setHeadlightsOn((prev) => !prev)}
          inspectMode={inspectMode}
          onToggleInspectMode={() => setInspectMode((prev) => !prev)}
          onRevEngine={handleRevEngine}
        />
        <About />
        <Skills />
        <ProblemSolving />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />

      {/* 360° Inspection Mode Floating Exit HUD */}
      <AnimatePresence>
        {inspectMode && (
          <motion.aside
            className="inspect-exit-banner"
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
          >
            <div className="inspect-banner-inner">
              <div className="inspect-banner-info">
                <span className="inspect-dot-indicator" />
                <span className="inspect-banner-title">360° SHOWROOM INSPECTION</span>
                <span className="inspect-banner-sub">DRAG WITH MOUSE OR TOUCH TO ROTATE</span>
              </div>
              <button
                type="button"
                className="btn-exit-360"
                onClick={() => {
                  playSwitch();
                  setInspectMode(false);
                }}
                title="Exit 360° Inspection (Press Escape)"
                aria-label="Exit 360 Degree View"
              >
                <X size={15} />
                <span>EXIT 360°</span>
                <kbd className="esc-badge">ESC</kbd>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Floating DevShell Launcher Button */}
      <button
        type="button"
        className="floating-devshell-btn"
        onClick={() => {
          playClick();
          setTerminalOpen(true);
        }}
        aria-label="Open Interactive DevShell"
      >
        <span className="pulse-indicator" aria-hidden="true" />
        <TerminalIcon size={14} color="#10b981" />
        <span>DEVSHELL [ ` ]</span>
      </button>

      {/* DevShell Modal Window */}
      <AnimatePresence>
        {terminalOpen && (
          <motion.div
            className="devshell-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTerminalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '860px' }}
            >
              <Terminal isModal={true} onClose={() => setTerminalOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
