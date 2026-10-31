// src/components/CustomCursor.jsx
import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { damping: 25, stiffness: 250, mass: 0.5 });
  const ringY = useSpring(cursorY, { damping: 25, stiffness: 250, mass: 0.5 });
  const ringScale = useSpring(1, { damping: 20, stiffness: 300 });
  const dotScale = useSpring(1, { damping: 20, stiffness: 300 });
  const isFine = useRef(false);

  useEffect(() => {
    isFine.current = window.matchMedia('(pointer: fine)').matches;
    if (!isFine.current) return;

    document.body.classList.add('custom-cursor-active');

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        ringScale.set(1.8);
        dotScale.set(0.5);
      }
    };

    const handleMouseOut = () => {
      ringScale.set(1);
      dotScale.set(1);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY, ringScale, dotScale]);

  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{
          left: cursorX,
          top: cursorY,
          x: '-50%',
          y: '-50%',
          scale: dotScale,
        }}
      />
      <motion.div
        className="cursor-ring"
        style={{
          left: ringX,
          top: ringY,
          x: '-50%',
          y: '-50%',
          scale: ringScale,
        }}
      />
    </>
  );
};

export default CustomCursor;
