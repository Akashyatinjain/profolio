// src/components/CustomCursor.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

// Pre-calculated 1975 Porsche 911 (930) Turbo Fuchs 5-leaf petal spoke paths
const FUCHS_SPOKES = [
  {
    d: 'M 23.61 20.72 Q 22.77 16.07 21.42 10.64 Q 25 9.5 28.58 10.64 Q 27.23 16.07 26.39 20.72 Z',
    x1: 25,
    y1: 19.5,
    x2: 25,
    y2: 11,
  },
  {
    d: 'M 28.64 22.35 Q 32.8 20.12 37.55 17.16 Q 39.74 20.21 39.76 23.97 Q 34.18 24.36 29.5 25 Z',
    x1: 30.23,
    y1: 23.3,
    x2: 38.31,
    y2: 20.67,
  },
  {
    d: 'M 28.64 27.65 Q 32.05 30.91 36.34 34.51 Q 34.11 37.54 30.54 38.72 Q 28.45 33.53 26.39 29.28 Z',
    x1: 28.23,
    y1: 29.45,
    x2: 33.23,
    y2: 36.33,
  },
  {
    d: 'M 23.61 29.28 Q 21.55 33.53 19.46 38.72 Q 15.89 37.54 13.66 34.51 Q 17.95 30.91 21.36 27.65 Z',
    x1: 21.77,
    y1: 29.45,
    x2: 16.77,
    y2: 36.33,
  },
  {
    d: 'M 20.5 25 Q 15.82 24.36 10.24 23.97 Q 10.26 20.21 12.45 17.16 Q 17.2 20.12 21.36 22.35 Z',
    x1: 19.77,
    y1: 23.3,
    x2: 11.69,
    y2: 20.67,
  },
];

// 5 center hub lug nuts
const LUG_NUTS = [
  { cx: 27, cy: 22.25 },
  { cx: 28.23, cy: 26.05 },
  { cx: 25, cy: 28.4 },
  { cx: 21.77, cy: 26.05 },
  { cx: 23, cy: 22.25 },
];

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Rotation physics: spring provides smooth rotational momentum when flicking the mouse
  const rawRotation = useMotionValue(0);
  const smoothRotation = useSpring(rawRotation, { damping: 22, stiffness: 220, mass: 0.25 });

  // Scale physics: snappy response for hover and click states
  const rawScale = useMotionValue(1);
  const smoothScale = useSpring(rawScale, { damping: 20, stiffness: 360 });

  // Opacity: fade in gracefully on first move; fade out when mouse leaves window
  const rawOpacity = useMotionValue(0);
  const smoothOpacity = useSpring(rawOpacity, { damping: 18, stiffness: 280 });

  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const lastPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  useEffect(() => {
    // Only activate custom cursor on desktop fine pointer devices
    const fineMatch = window.matchMedia('(pointer: fine)').matches;
    if (!fineMatch) return;
    setIsSupported(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      cursorX.set(x);
      cursorY.set(y);

      if (!hasMoved.current) {
        hasMoved.current = true;
        lastPos.current = { x, y };
        rawOpacity.set(1);
        return;
      }

      // Rolling rotation physics
      if (!prefersReducedMotion) {
        const dx = x - lastPos.current.x;
        const dy = y - lastPos.current.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0.5) {
          // Horizontal direction dictates forward/backward rolling; vertical also imparts forward momentum
          const dir = dx !== 0 ? Math.sign(dx) : (dy > 0 ? 1 : -1);
          // Scale ~2.2 deg per pixel moved (mimicking realistic circumference rolling cadence)
          rawRotation.set(rawRotation.get() + dir * dist * 2.2);
        }
      }

      lastPos.current = { x, y };
      rawOpacity.set(1);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const isInteractive = Boolean(
        target.closest(
          'a, button, [role="button"], input, textarea, select, .color-swatch-btn, .deck-tool-btn, .hero-model-action, [tabindex="0"]'
        )
      );

      if (isInteractive) {
        setIsHovered(true);
        rawScale.set(1.22);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const isLeavingInteractive = Boolean(
        target.closest(
          'a, button, [role="button"], input, textarea, select, .color-swatch-btn, .deck-tool-btn, .hero-model-action, [tabindex="0"]'
        )
      );

      if (isLeavingInteractive) {
        setIsHovered(false);
        rawScale.set(1);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      rawScale.set(0.9);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      rawScale.set(isHovered ? 1.22 : 1);
    };

    const handleMouseLeave = () => {
      rawOpacity.set(0);
    };

    const handleMouseEnter = () => {
      rawOpacity.set(1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, rawOpacity, rawRotation, rawScale, isHovered]);

  if (!isSupported) {
    return null;
  }

  return (
    <motion.div
      className={`tire-cursor-container ${isHovered ? 'is-hovered' : ''} ${isClicking ? 'is-clicking' : ''}`}
      style={{
        left: cursorX,
        top: cursorY,
        scale: smoothScale,
        opacity: smoothOpacity,
      }}
      aria-hidden="true"
    >
      <svg
        className="tire-cursor-svg"
        width="34"
        height="34"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Polished Fuchs Aluminum Rim Lip Gradient */}
          <linearGradient id="fuchsRimAlloy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="28%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#64748b" />
            <stop offset="82%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Porsche Guards Red Brembo Caliper Gradient */}
          <linearGradient id="porscheCaliper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3b30" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          {/* Realistic Vulcanized Rubber Sidewall Depth Gradient */}
          <radialGradient id="rubberVolume" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#282d34" />
            <stop offset="85%" stopColor="#16191d" />
            <stop offset="100%" stopColor="#0e1013" />
          </radialGradient>
        </defs>

        {/* ── Stationary Hub Knuckle & Guards Red Caliper ──
            Anchored at top-right (~ -35°) while tire rolls freely, mirroring real automotive suspension */}
        <g className="tire-caliper">
          <path
            d="M 21.5 10.8 A 14.5 14.5 0 0 1 35 14.2 L 33.2 17.5 A 11.2 11.2 0 0 0 23 14 Z"
            fill="url(#porscheCaliper)"
            stroke="#ff6b6b"
            strokeWidth="0.6"
          />
          {/* Dual ventilated caliper pistons */}
          <circle cx="27" cy="12.8" r="0.65" fill="#ffffff" opacity="0.95" />
          <circle cx="30" cy="14.3" r="0.65" fill="#ffffff" opacity="0.95" />
        </g>

        {/* ── Rotating Tire, Rim, Brake Rotor, and Fuchs Spokes ──
            Spins dynamically with mouse displacement velocity and coasts with inertia */}
        <motion.g
          style={{
            rotate: smoothRotation,
            originX: '25px',
            originY: '25px',
          }}
        >
          {/* 1. Outer Tire Tread Profile & Specular Edge Highlight */}
          <circle cx="25" cy="25" r="23.2" fill="none" stroke="#0a0c0e" strokeWidth="2.6" />
          {/* Crisp specular perimeter ring (ensures sharp tire silhouette against dark themes) */}
          <circle cx="25" cy="25" r="23.8" fill="none" stroke="rgba(220, 207, 176, 0.45)" strokeWidth="0.75" />
          {/* High-grip track tread blocks (dashed radial channels) */}
          <circle cx="25" cy="25" r="23.2" fill="none" stroke="#4b5563" strokeWidth="2.2" strokeDasharray="2.2 2.6" />
          <circle cx="25" cy="25" r="21.8" fill="none" stroke="#1f2329" strokeWidth="0.75" />

          {/* 2. Tire Sidewall Rubber with Volume */}
          <circle cx="25" cy="25" r="21.4" fill="url(#rubberVolume)" stroke="#333a44" strokeWidth="0.7" />
          <circle cx="25" cy="25" r="18.8" fill="none" stroke="#0a0c0e" strokeWidth="1.2" />
          <circle cx="25" cy="25" r="17.4" fill="none" stroke="#2c333d" strokeWidth="0.5" strokeDasharray="7 2.5 3 2.5" />

          {/* 3. Classic Fuchs Polished Aluminum Lip */}
          <circle cx="25" cy="25" r="16.4" fill="#181a1d" stroke="url(#fuchsRimAlloy)" strokeWidth="1.3" />
          <circle cx="25" cy="25" r="15.2" fill="#101215" stroke="#475569" strokeWidth="0.5" />

          {/* 4. Drilled Ventilated Brake Disc / Rotor (revealed beneath spokes) */}
          <circle cx="25" cy="25" r="14.4" fill="#2d323a" stroke="#64748b" strokeWidth="0.5" />
          <circle cx="25" cy="25" r="12" fill="none" stroke="#17191d" strokeWidth="0.8" strokeDasharray="1.2 2.2" />
          <circle cx="25" cy="25" r="9.5" fill="none" stroke="#1e2227" strokeWidth="0.6" strokeDasharray="1 2.5" />

          {/* 5. 5 Iconic Fuchs Petal Spokes */}
          <g>
            {FUCHS_SPOKES.map((spoke, i) => (
              <React.Fragment key={i}>
                <path
                  d={spoke.d}
                  fill="#101214"
                  stroke="#e5e7eb"
                  strokeWidth="0.9"
                  strokeLinejoin="round"
                />
                <line
                  x1={spoke.x1}
                  y1={spoke.y1}
                  x2={spoke.x2}
                  y2={spoke.y2}
                  stroke="#374151"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </React.Fragment>
            ))}
          </g>

          {/* 6. Center Hub Base */}
          <circle cx="25" cy="25" r="4.9" fill="#141619" stroke="#cbd5e1" strokeWidth="0.8" />

          {/* 7. 5 Motorsport Wheel Lug Nuts */}
          {LUG_NUTS.map((lug, i) => (
            <circle
              key={i}
              cx={lug.cx}
              cy={lug.cy}
              r="0.75"
              fill="#f3f4f6"
              stroke="#1f2937"
              strokeWidth="0.3"
            />
          ))}

          {/* 8. Center Hub Cap (Porsche Champagne / Red Crest) */}
          <circle cx="25" cy="25" r="2.3" fill="#c3a875" stroke="#785e2f" strokeWidth="0.5" />
          <circle cx="25" cy="25" r="1.3" fill="#a32020" />
        </motion.g>

        {/* ── 9. Pinpoint Center Aiming Hotspot Dot ──
            Guarantees 100% pixel-perfect click accuracy for buttons, links, and 3D controls */}
        <g className="tire-center-reticle">
          <circle cx="25" cy="25" r="1.1" fill="#ffffff" />
          <circle
            cx="25"
            cy="25"
            r="1.9"
            fill="none"
            stroke="rgba(224, 43, 32, 0.85)"
            strokeWidth="0.45"
          />
        </g>
      </svg>
    </motion.div>
  );
};

export default CustomCursor;
