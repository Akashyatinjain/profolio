// src/components/KineticReactorCanvas.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './KineticReactorCanvas.css';

const KineticReactorCanvas = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── 1. Setup Three.js Scene, Camera, Renderer ─────────────────────────
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL initialization failed, falling back:', e);
      setWebglSupported(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    // ── 2. Create the Procedural Kinetic Reactor ─────────────────────────
    const reactorGroup = new THREE.Group();
    scene.add(reactorGroup);

    // Chrome Material for mechanical components
    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      metalness: 0.95,
      roughness: 0.16,
      envMapIntensity: 1.2,
      flatShading: true,
    });

    // Dark titanium accent material
    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.85,
      roughness: 0.35,
    });

    // Emissive Glowing Core Material (Acid Green with crimson core)
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a1505,
      emissive: 0xb6ff00,
      emissiveIntensity: 1.4,
      roughness: 0.25,
      metalness: 0.8,
      wireframe: false,
    });

    // 2.1 Central Energy Core
    const coreGeo = new THREE.IcosahedronGeometry(0.75, 2);
    const coreMesh = new THREE.Mesh(coreGeo, coreMaterial);
    reactorGroup.add(coreMesh);

    // Outer Geodesic Lattice Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.05, 1);
    const cageWireMat = new THREE.MeshBasicMaterial({
      color: 0xb6ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageWireMat);
    reactorGroup.add(cageMesh);

    // Node spheres at cage vertices
    const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xb6ff00,
      emissiveIntensity: 2.0,
      metalness: 0.9,
    });
    const nodeGroup = new THREE.Group();
    const cagePos = cageGeo.attributes.position;
    for (let i = 0; i < cagePos.count; i += 3) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(cagePos.getX(i), cagePos.getY(i), cagePos.getZ(i));
      nodeGroup.add(node);
    }
    reactorGroup.add(nodeGroup);

    // 2.2 Multi-Layered Orbital Gimbal Rings
    // Ring 1: Equatorial Inner Ring
    const ring1Group = new THREE.Group();
    const ring1Geo = new THREE.TorusGeometry(1.5, 0.038, 16, 120);
    const ring1Mesh = new THREE.Mesh(ring1Geo, chromeMaterial);
    ring1Group.add(ring1Mesh);

    // Add mechanical clamp brackets around Ring 1
    const bracketGeo = new THREE.BoxGeometry(0.09, 0.14, 0.14);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const bracket = new THREE.Mesh(bracketGeo, titaniumMaterial);
      bracket.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
      bracket.rotation.z = angle;
      ring1Group.add(bracket);
    }
    reactorGroup.add(ring1Group);

    // Ring 2: Inclined Mid Ring (tilted on X)
    const ring2Group = new THREE.Group();
    const ring2Geo = new THREE.TorusGeometry(1.95, 0.034, 16, 120);
    const ring2Mesh = new THREE.Mesh(ring2Geo, chromeMaterial);
    ring2Group.add(ring2Mesh);

    // Brackets on Ring 2
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const bracket = new THREE.Mesh(bracketGeo, titaniumMaterial);
      bracket.position.set(Math.cos(angle) * 1.95, Math.sin(angle) * 1.95, 0);
      bracket.rotation.z = angle;
      ring2Group.add(bracket);
    }
    ring2Group.rotation.x = Math.PI * 0.35;
    reactorGroup.add(ring2Group);

    // Ring 3: Outer Oblique Ring (tilted on Y and Z)
    const ring3Group = new THREE.Group();
    const ring3Geo = new THREE.TorusGeometry(2.45, 0.032, 16, 120);
    const ring3Mesh = new THREE.Mesh(ring3Geo, chromeMaterial);
    ring3Group.add(ring3Mesh);

    // Crimson accent nodes on Ring 3
    const redNodeMat = new THREE.MeshStandardMaterial({
      color: 0xff3030,
      emissive: 0xff3030,
      emissiveIntensity: 1.8,
      metalness: 0.8,
    });
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const redNode = new THREE.Mesh(nodeGeo, redNodeMat);
      redNode.position.set(Math.cos(angle) * 2.45, Math.sin(angle) * 2.45, 0);
      ring3Group.add(redNode);
    }
    ring3Group.rotation.z = -Math.PI * 0.25;
    ring3Group.rotation.y = Math.PI * 0.2;
    reactorGroup.add(ring3Group);

    // 2.3 Floating Mechanical Fragments / Debris
    const fragments = [];
    const shardGeos = [
      new THREE.OctahedronGeometry(0.12, 0),
      new THREE.TetrahedronGeometry(0.14, 0),
      new THREE.BoxGeometry(0.08, 0.2, 0.08),
    ];

    const shardGroup = new THREE.Group();
    const numShards = 28;
    for (let i = 0; i < numShards; i++) {
      const g = shardGeos[i % shardGeos.length];
      const mat = (i % 5 === 0) ? redNodeMat : chromeMaterial;
      const mesh = new THREE.Mesh(g, mat);

      const baseRadius = 1.3 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      mesh.position.set(
        baseRadius * Math.cos(theta) * Math.cos(phi),
        baseRadius * Math.sin(phi),
        baseRadius * Math.sin(theta) * Math.cos(phi)
      );

      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      const speed = (0.2 + Math.random() * 0.5) * (Math.random() > 0.5 ? 1 : -1);

      fragments.push({
        mesh,
        baseRadius,
        theta,
        phi,
        speed,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.03,
          y: (Math.random() - 0.5) * 0.03,
        },
      });

      shardGroup.add(mesh);
    }
    reactorGroup.add(shardGroup);

    // 2.4 Ambient Energy Particles (Subtle Starfield / Energy Dust)
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const greenColor = new THREE.Color(0xb6ff00);
    const redColor = new THREE.Color(0xff3030);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const r = 2.0 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      const colorChoice = Math.random();
      const col = colorChoice < 0.65 ? greenColor : (colorChoice < 0.85 ? redColor : whiteColor);
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── 3. Lighting Rig (Cinematic Green Rim & Dramatic Red Flare) ─────────
    const ambientLight = new THREE.AmbientLight(0x0a0a0a, 0.7);
    scene.add(ambientLight);

    // Green Key / Rim Light (Primary Acid Green Accent)
    const greenLight = new THREE.PointLight(0xb6ff00, 5.0, 15, 1.2);
    greenLight.position.set(-3.5, 2.5, 3.0);
    scene.add(greenLight);

    // Red Dramatic Light (Secondary Crimson Accent)
    const redLight = new THREE.PointLight(0xff3030, 0.8, 14, 1.2);
    redLight.position.set(4.0, -2.0, 2.5);
    scene.add(redLight);

    // White Key Directional Light for crisp chrome specular reflections
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(1, 4, 5);
    scene.add(dirLight);

    // ── 4. Mouse Tracking (Subtle Parallax on Desktop) ──────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.45;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.45;
    };

    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // ── 5. Scroll Choreography Interpolator ────────────────────────────────
    // Define the 6 choreography stages corresponding to portfolio sections
    const getChoreographyTarget = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      // Section elements
      const homeEl = document.getElementById('home');
      const aboutEl = document.getElementById('about');
      const skillsEl = document.getElementById('skills');
      const projectsEl = document.getElementById('projects');
      const journeyEl = document.getElementById('journey');
      const contactEl = document.getElementById('contact');

      // Calculate relative scroll position to determine current section
      const getSectionProgress = (el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.top / window.innerHeight;
      };

      // Default stage: HERO (The Awakening)
      // Object in center / balanced, slow mechanical rotation, dramatic green rim
      let target = {
        x: isMobile ? 0 : 1.7,
        y: isMobile ? -0.2 : 0,
        z: isMobile ? -0.5 : 0,
        rotX: 0.1,
        rotY: 0,
        rotZ: 0,
        scale: isMobile ? 0.72 : (isTablet ? 0.9 : 1.05),
        separation: 0.0,
        greenIntensity: 5.2,
        redIntensity: 0.8,
        corePulse: 1.3,
      };

      // Determine stages based on element visibility
      const aboutProg = getSectionProgress(aboutEl);
      const skillsProg = getSectionProgress(skillsEl);
      const projectsProg = getSectionProgress(projectsEl);
      const journeyProg = getSectionProgress(journeyEl);
      const contactProg = getSectionProgress(contactEl);

      if (contactProg <= 0.6) {
        // STAGE 6: CONTACT — THE FINAL STATE
        // Centered, rings align, dramatic lighting, large contact typography
        target = {
          x: 0,
          y: isMobile ? -0.2 : 0.2,
          z: isMobile ? -0.4 : -0.2,
          rotX: 0.15,
          rotY: Math.PI * 0.4,
          rotZ: 0.08,
          scale: isMobile ? 0.72 : 1.05,
          separation: 0.05,
          greenIntensity: 5.2,
          redIntensity: 2.6,
          corePulse: 1.4,
        };
      } else if (journeyProg <= 0.6) {
        // STAGE 5: JOURNEY — THE EVOLUTION
        // Re-converges towards center, timeline content reveals, lighting returns towards green
        target = {
          x: isMobile ? 0 : 0.4,
          y: isMobile ? -0.2 : 0.1,
          z: isMobile ? -0.4 : -0.2,
          rotX: -0.15,
          rotY: Math.PI * 0.25,
          rotZ: 0.05,
          scale: isMobile ? 0.68 : 0.92,
          separation: 0.2,
          greenIntensity: 4.8,
          redIntensity: 1.2,
          corePulse: 1.4,
        };
      } else if (projectsProg <= 0.6) {
        // STAGE 4: PROJECTS — THE POWER (Most dramatic section!)
        // Object moves to left, lighting surges with dramatic RED & GREEN, components rotate
        target = {
          x: isMobile ? 0 : -2.5,
          y: isMobile ? -0.4 : 0.05,
          z: isMobile ? -0.3 : 0.25,
          rotX: 0.35,
          rotY: -Math.PI * 0.35,
          rotZ: -0.15,
          scale: isMobile ? 0.7 : 1.12,
          separation: 0.55,
          greenIntensity: 4.5,
          redIntensity: 6.2, // SURGE IN CRIMSON RED!
          corePulse: 1.8,
        };
      } else if (skillsProg <= 0.6) {
        // STAGE 3: SKILLS — THE SYSTEM
        // Disassembles: rings expand outward, fragments spread wide, green illumination
        target = {
          x: isMobile ? 0 : 0,
          y: isMobile ? -0.3 : 0.15,
          z: isMobile ? -0.6 : -0.35,
          rotX: 0.1,
          rotY: Math.PI * 0.6,
          rotZ: 0.2,
          scale: isMobile ? 0.65 : 0.95,
          separation: 1.0, // MAXIMUM DISASSEMBLY / SEPARATION
          greenIntensity: 6.2,
          redIntensity: 1.0,
          corePulse: 1.6,
        };
      } else if (aboutProg <= 0.6) {
        // STAGE 2: ABOUT — THE TRANSFORMATION
        // Moves toward right, rotation changes, scales down, softer lighting
        target = {
          x: isMobile ? 0 : 2.4,
          y: isMobile ? -0.3 : -0.1,
          z: isMobile ? -0.4 : 0.0,
          rotX: -0.2,
          rotY: Math.PI * 0.3,
          rotZ: 0.1,
          scale: isMobile ? 0.65 : 0.88,
          separation: 0.15,
          greenIntensity: 4.0,
          redIntensity: 0.6,
          corePulse: 1.2,
        };
      }

      return target;
    };

    // ── 6. Animation Loop with Controlled Lerp ─────────────────────────────
    let animationFrameId;
    const startTime = performance.now();

    // Current smooth values
    const current = {
      x: 0,
      y: 0,
      z: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      scale: 1,
      separation: 0,
      greenIntensity: 5.0,
      redIntensity: 0.8,
      corePulse: 1.0,
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Get choreography target from scroll
      const target = getChoreographyTarget();

      // Lerp main transforms smoothly
      const lerpSpeed = 0.055;
      current.x += (target.x - current.x) * lerpSpeed;
      current.y += (target.y - current.y) * lerpSpeed;
      current.z += (target.z - current.z) * lerpSpeed;
      current.scale += (target.scale - current.scale) * lerpSpeed;
      current.separation += (target.separation - current.separation) * lerpSpeed;
      current.greenIntensity += (target.greenIntensity - current.greenIntensity) * lerpSpeed;
      current.redIntensity += (target.redIntensity - current.redIntensity) * lerpSpeed;
      current.corePulse += (target.corePulse - current.corePulse) * lerpSpeed;

      // Apply to reactorGroup
      reactorGroup.position.set(current.x, current.y, current.z);
      reactorGroup.scale.setScalar(current.scale);

      // Continuous mechanical rotations + scroll target rotations + mouse parallax
      const continuousSpeed = prefersReducedMotion ? 0 : 0.25;
      reactorGroup.rotation.x = target.rotX + mouseY * 0.35 + Math.sin(elapsedTime * 0.3) * 0.05;
      reactorGroup.rotation.y = elapsedTime * continuousSpeed + target.rotY + mouseX * 0.35;
      reactorGroup.rotation.z = target.rotZ + Math.cos(elapsedTime * 0.25) * 0.04;

      // Core rotation
      coreMesh.rotation.y = -elapsedTime * 0.6;
      cageMesh.rotation.y = elapsedTime * 0.4;
      cageMesh.rotation.x = elapsedTime * 0.2;

      // Core emissive pulsing
      coreMaterial.emissiveIntensity =
        current.corePulse * (1.2 + Math.sin(elapsedTime * 3.0) * 0.35);

      // Orbital Rings rotation & Separation animation
      const sep = current.separation;
      // Ring 1 (Inner Equator)
      ring1Group.rotation.z = elapsedTime * 0.5;
      ring1Group.scale.setScalar(1.0 + sep * 0.35);

      // Ring 2 (Mid Polar)
      ring2Group.rotation.y = -elapsedTime * 0.45;
      ring2Group.scale.setScalar(1.0 + sep * 0.45);

      // Ring 3 (Outer Oblique)
      ring3Group.rotation.z = elapsedTime * 0.38;
      ring3Group.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2 - Math.PI * 0.25;
      ring3Group.scale.setScalar(1.0 + sep * 0.6);

      // Floating fragments orbit & spread
      fragments.forEach((frag) => {
        if (!prefersReducedMotion) {
          frag.theta += frag.speed * 0.015;
          frag.mesh.rotation.x += frag.rotSpeed.x;
          frag.mesh.rotation.y += frag.rotSpeed.y;
        }

        const expandedRadius = frag.baseRadius * (1.0 + sep * 0.85);
        frag.mesh.position.set(
          expandedRadius * Math.cos(frag.theta) * Math.cos(frag.phi),
          expandedRadius * Math.sin(frag.phi),
          expandedRadius * Math.sin(frag.theta) * Math.cos(frag.phi)
        );
      });

      // Ambient particle slow rotation
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      // Update light intensities
      greenLight.intensity = current.greenIntensity;
      redLight.intensity = current.redIntensity;

      // Move lights slightly for organic glints on chrome
      greenLight.position.x = -3.5 + Math.sin(elapsedTime * 0.5) * 0.5;
      redLight.position.y = -2.0 + Math.cos(elapsedTime * 0.6) * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    // ── 7. Viewport Resize Handler ─────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // ── 8. Cleanup on Unmount ─────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      // Dispose Three.js objects
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="reactor-canvas-container" aria-hidden="true">
      {webglSupported ? (
        <canvas ref={canvasRef} className="reactor-webgl-canvas" />
      ) : (
        <div className="reactor-fallback-visual" />
      )}
    </div>
  );
};

export default KineticReactorCanvas;
