// src/components/PorscheCanvas.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './PorscheCanvas.css';

// Procedural luxury showroom contact shadow under wheels
function createContactShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 1024, 1024);

  // Soft overall chassis ambient occlusion
  const grad = ctx.createRadialGradient(512, 512, 80, 512, 512, 470);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.78)');
  grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(512, 512, 420, 210, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4 tire contact patches (darker, sharp core, feathered falloff)
  function drawTireShadow(cx, cy, rx, ry) {
    const tGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, rx);
    tGrad.addColorStop(0, 'rgba(0, 0, 0, 0.96)');
    tGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.65)');
    tGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.2)');
    tGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = tGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Front tires (contact patches)
  drawTireShadow(320, 310, 80, 38); // Front left
  drawTireShadow(704, 310, 80, 38); // Front right

  // Wide 930 Turbo rear tires (wide stance)
  drawTireShadow(300, 714, 110, 48); // Rear left
  drawTireShadow(724, 714, 110, 48); // Rear right

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

const PorscheCanvas = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── 1. Renderer, Camera, Scene Setup ──────────────────────────────────
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL init failed:', e);
      setWebglSupported(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    window.__scene = scene;
    scene.fog = new THREE.FogExp2(0x0e1012, 0.028);

    // Cinematic Automotive Studio Lens (26° FOV for authentic telephoto compression)
    // Camera is placed at eye/hood height (0.95m) for a powerful, full-sized automotive stance
    const camera = new THREE.PerspectiveCamera(
      26,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.95, 11.2);
    camera.lookAt(0, 0.65, 0);

    // ── 2. Procedural Automotive Studio Environment (Continuous IBL) ──────
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const studioScene = new THREE.Scene();
    studioScene.background = new THREE.Color(0x0e1012);

    // Overhead softbox bank (diffuse continuous light panel)
    const topPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 26),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    topPanel.rotation.x = Math.PI / 2;
    topPanel.position.set(0, 9, 0);
    studioScene.add(topPanel);

    // Left fill silk softbox
    const leftPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 18),
      new THREE.MeshBasicMaterial({ color: 0xfff6ec })
    );
    leftPanel.position.set(-12, 4.5, 3);
    leftPanel.rotation.y = Math.PI / 3;
    studioScene.add(leftPanel);

    // Right fill softbox
    const rightPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 18),
      new THREE.MeshBasicMaterial({ color: 0xe8eef8 })
    );
    rightPanel.position.set(12, 4.5, 3);
    rightPanel.rotation.y = -Math.PI / 3;
    studioScene.add(rightPanel);

    // Rear rim strip for iconic whale-tail contour
    const rearPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 4),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    rearPanel.position.set(0, 5, -8);
    rearPanel.rotation.x = -Math.PI / 6;
    studioScene.add(rearPanel);

    const studioEnvMap = pmremGenerator.fromScene(studioScene).texture;
    scene.environment = studioEnvMap;

    // ── 3. Showroom Ground & Contact Shadow ───────────────────────────────
    // Dark Graphite polished showroom floor (velvety satin sheen, NO harsh circular spots)
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0c0e10,
      roughness: 0.72,
      metalness: 0.18,
      envMapIntensity: 0.45,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // ── 4. Professional Studio Lighting Rig ───────────────────────────────
    // 1. Soft balanced ambient fill
    const ambientLight = new THREE.AmbientLight(0x232e27, 1.6);
    scene.add(ambientLight);

    // 2. Large soft key light (Front-Left Studio Softbox)
    const keyLight = new THREE.DirectionalLight(0xfff7ee, 2.5);
    keyLight.position.set(-5.5, 5.0, 6.5);
    scene.add(keyLight);

    // 3. Secondary fill light (Front-Right)
    const fillLight = new THREE.DirectionalLight(0xe8f0f8, 1.6);
    fillLight.position.set(5.5, 4.2, 5.5);
    scene.add(fillLight);

    // 4. Overhead strip lighting (runs along car roofline)
    const overheadLight = new THREE.DirectionalLight(0xffffff, 1.8);
    overheadLight.position.set(0, 8.0, 0);
    scene.add(overheadLight);

    // 5. Dual subtle rim lights for flared rear turbo arches & whale tail
    const rearRimLeft = new THREE.DirectionalLight(0xd0e4da, 1.4);
    rearRimLeft.position.set(-4.5, 3.2, -5.5);
    scene.add(rearRimLeft);

    const rearRimRight = new THREE.DirectionalLight(0xd0e4da, 1.4);
    rearRimRight.position.set(4.5, 3.2, -5.5);
    scene.add(rearRimRight);

    // ── 5. Vehicle Root & 3D Porsche Loading ───────────────────────────────
    const carRoot = new THREE.Group();
    // Position carRoot ON THE FLOOR at y = 0
    carRoot.position.set(1.65, 0, 0.1);
    scene.add(carRoot);

    // Procedural feathered 4-tire contact shadow
    const contactShadowTexture = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(5.8, 5.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.002; // Sits 2mm above ground
    carRoot.add(contactShadow);

    // Taillight point lights
    const tailLight1 = new THREE.PointLight(0xaa1818, 0.4, 8, 1.8);
    const tailLight2 = new THREE.PointLight(0xaa1818, 0.4, 8, 1.8);
    carRoot.add(tailLight1);
    carRoot.add(tailLight2);

    const taillightMeshes = [];
    let paintMeshes = [];

    // Rogue nodes list: Blender curves and antennas with 240m exploded vertices
    const rogueNodes = [
      'Cylinder.000', 'Cylinder.006', 'Cube.004', 'Plane.007',
      'Cylinder.003', 'Cylinder.002', 'Cylinder.041', 'Cylinder.013',
      'Cylinder.004', 'Plane.008'
    ];

    const loader = new GLTFLoader();
    loader.load(
      '/models/porsche_911.glb',
      (gltf) => {
        const porsche = gltf.scene;

        // ── 5.1 CLEAN UP ROGUE NODES & TOY ELEMENTS ─────────────────────
        porsche.traverse((child) => {
          const rawName = (child.name || '').toLowerCase();
          const cleanName = rawName.replace(/[^a-z0-9]/g, '');
          const matName = (child.material?.name || '').toLowerCase();

          // Compute object's local geometry center Z
          let zCenter = child.position.z;
          if (child.geometry) {
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            if (child.geometry.boundingBox) {
              zCenter += (child.geometry.boundingBox.min.z + child.geometry.boundingBox.max.z) / 2;
            }
          }

          // 1. Disable toy pine-tree air freshener hanging in windshield
          if (
            matName.includes('wunderbaum') ||
            cleanName.includes('plane005') ||
            cleanName.includes('plane004')
          ) {
            child.visible = false;
          }

          // 2. Disable exploded antenna wire & rogue Blender curves
          if (
            cleanName.includes('cylinder000') ||
            cleanName.includes('cylinder002') ||
            cleanName.includes('cylinder003') ||
            cleanName.includes('cylinder004') ||
            cleanName.includes('cylinder006') ||
            cleanName.includes('cylinder013') ||
            cleanName.includes('cylinder041') ||
            cleanName.includes('plane007') ||
            cleanName.includes('plane008') ||
            cleanName.includes('cube004') ||
            cleanName.includes('cube002') ||
            rawName.includes('antenna')
          ) {
            child.visible = false;
          }

          // 3. Disable duplicate 'coat' outer shell to eliminate gummy plastic look
          if (matName.includes('coat')) {
            child.visible = false;
          }

          // 4. Disable red motorsport tape/sticker discs covering the headlights (at z < -2.1)
          if (
            (matName.includes('sticker') && zCenter < -2.1) ||
            cleanName.includes('circle016') ||
            cleanName.includes('circle013') ||
            cleanName.includes('circle1012')
          ) {
            child.visible = false;
          }
        });

        // ── 5.2 PRECISE WHEEL GROUNDING & SCALE NORMALIZATION ───────────────
        // Step 1: Compute bounding box ONLY of visible clean geometry
        porsche.updateMatrixWorld(true);
        const cleanBox = new THREE.Box3();
        porsche.traverse((child) => {
          if (child.isMesh && child.visible) {
            cleanBox.expandByObject(child);
          }
        });

        const initialSize = cleanBox.getSize(new THREE.Vector3());
        // Authentic 1975 Porsche 930 Turbo length: 4.29 meters
        const targetLength = 4.29;
        const scaleFactor = targetLength / initialSize.z;
        porsche.scale.set(scaleFactor, scaleFactor, scaleFactor);
        porsche.updateMatrixWorld(true);

        // Step 2: Compute exact scaled bounding box
        const scaledBox = new THREE.Box3();
        porsche.traverse((child) => {
          if (child.isMesh && child.visible) {
            scaledBox.expandByObject(child);
          }
        });
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

        // Step 3: Center on X and Z, and place tire contact patches EXACTLY on Y = 0
        porsche.position.x = -scaledCenter.x;
        porsche.position.y = -scaledBox.min.y; // Lowest wheel contact points now sit precisely on Y = 0!
        porsche.position.z = -scaledCenter.z;
        porsche.updateMatrixWorld(true);

        // Position taillights at exact rear chassis coordinates
        tailLight1.position.set(-0.7, 0.55, 1.9);
        tailLight2.position.set(0.7, 0.55, 1.9);

        // ── 5.3 AUTOMOTIVE MATERIALS & AUTHENTIC DETAILS ──────────────────
        porsche.traverse((child) => {
          if (!child.isMesh || !child.material || !child.visible) return;
          const rawName = (child.name || '').toLowerCase();
          const cleanName = rawName.replace(/[^a-z0-9]/g, '');
          const matName = child.material.name.toLowerCase();

          // Compute object's local geometry center Z
          let zCenter = child.position.z;
          if (child.geometry) {
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            if (child.geometry.boundingBox) {
              zCenter += (child.geometry.boundingBox.min.z + child.geometry.boundingBox.max.z) / 2;
            }
          }

          // 1. Hide motorsport sticker discs covering the front headlights (zCenter < -2.1)
          if (matName.includes('sticker')) {
            if (zCenter < -2.1) {
              child.visible = false;
              console.log('STICKER HIDDEN:', child.name, zCenter);
              return;
            } else {
              console.log('STICKER KEPT:', child.name, zCenter);
            }
          }

          // 2. REAR TAILLIGHTS (Z > 0): Guards Red (#9E2929) & rear reflector strip
          if ((matName.includes('light') || matName.includes('refraction')) && zCenter > 0) {
            console.log('REAR LIGHT RED:', child.name, matName, zCenter);
            child.material = child.material.clone();
            child.material.color = new THREE.Color(0x991818);
            child.material.emissive = new THREE.Color(0xaa1515);
            child.material.emissiveIntensity = 0.5;
            child.material.roughness = 0.2;
            child.material.metalness = 0.35;
            child.material.envMapIntensity = 2.0;
            taillightMeshes.push(child);
            return;
          }

          // 3. FRONT HEADLIGHTS & TURN SIGNALS (Z <= 0):
          if ((matName.includes('light') || matName.includes('refraction')) && zCenter <= 0) {
            console.log('FRONT LIGHT WHITE/AMBER:', child.name, matName, zCenter);
            child.material = child.material.clone();
            const isTurnSignal = cleanName.includes('cube003');
            if (isTurnSignal) {
              child.material.color = new THREE.Color(0xdd8833);
              child.material.emissive = new THREE.Color(0xdd8833);
              child.material.emissiveIntensity = 0.35;
            } else {
              // Main Headlight Projector Dish & Halogen Bulb
              child.material.color = new THREE.Color(0xffffff);
              child.material.metalness = 0.95;
              child.material.roughness = 0.08;
              child.material.emissive = new THREE.Color(0xffeedd); // warm vintage halogen glow
              child.material.emissiveIntensity = 0.75;
              child.material.envMapIntensity = 2.8;
            }
            return;
          }

          // 4. Rich British Racing Green / Oak Green Metallic Body Paint
          if (matName.includes('paint')) {
            const origNorm = child.material.normalMap;
            const origRough = child.material.roughnessMap;

            // Luxury automotive multi-layer clearcoat lacquer
            child.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color('#143d2b'), // Deep, rich emerald racing green
              metalness: 0.68,
              roughness: 0.26,
              clearcoat: 1.0,
              clearcoatRoughness: 0.08,
              reflectivity: 0.92,
              envMapIntensity: 2.4,
              normalMap: origNorm,
              normalScale: new THREE.Vector2(0.85, 0.85),
              roughnessMap: origRough,
            });
            child.material.needsUpdate = true;
            paintMeshes.push(child);
            return;
          }

          // 5. Rims: Classic Fuchs Two-Tone Alloy Rims (Satin black center + polished chrome rim)
          if (matName.includes('rim')) {
            child.material.metalness = 0.88;
            child.material.roughness = 0.22;
            child.material.envMapIntensity = 2.4;
            return;
          }

          // 6. Tires: Authentic Matte Vulcanized Rubber (Preserves tread normal map)
          if (matName.includes('tire')) {
            child.material.color = new THREE.Color(0x161616);
            child.material.metalness = 0.02;
            child.material.roughness = 0.88;
            child.material.envMapIntensity = 0.35;
            return;
          }

          // 7. Chrome Trim: Mirror Polished Chrome (Bezels, window frames, exhaust)
          if (matName.includes('chrome')) {
            child.material.color = new THREE.Color(0xffffff);
            child.material.metalness = 0.98;
            child.material.roughness = 0.05;
            child.material.envMapIntensity = 3.2;
            return;
          }

          // 8. Windows: Deep Tinted Automotive Safety Glass
          if (matName.includes('glass')) {
            child.material.color = new THREE.Color(0x121b16);
            child.material.transparent = true;
            child.material.opacity = 0.38;
            child.material.roughness = 0.04;
            child.material.metalness = 0.85;
            child.material.envMapIntensity = 2.6;
            return;
          }

          // 9. Porsche Stuttgart Crest Hood Badge & Stickers
          if (matName.includes('sticker')) {
            child.material.metalness = 0.8;
            child.material.roughness = 0.22;
            child.material.envMapIntensity = 2.2;
            return;
          }

          // 10. License Plate
          if (matName.includes('plate')) {
            child.material.roughness = 0.42;
            child.material.metalness = 0.12;
            return;
          }

          // 11. Plastics: Front spoiler chin, rear whale-tail rubber lip, bumper bellows
          if (matName.includes('plastic') || matName.includes('_black')) {
            child.material.color = new THREE.Color(0x171918);
            child.material.metalness = 0.06;
            child.material.roughness = 0.65;
            return;
          }
        });

        carRoot.add(porsche);
        setIsLoaded(true);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(pct);
        }
      },
      (err) => {
        console.error('Failed to load Porsche 911 GLB:', err);
      }
    );

    // ── 6. Mouse Parallax (Refined & Subtle) ───────────────────────────────
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.25;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.15;
    };

    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // ── 7. Scroll Choreography (ALL STAGES GROUNDED AT Y = 0) ──────────────
    const getChoreographyTarget = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      const aboutEl = document.getElementById('about');
      const skillsEl = document.getElementById('skills');
      const projectsEl = document.getElementById('projects');
      const journeyEl = document.getElementById('journey');
      const contactEl = document.getElementById('contact');

      const getProgress = (el) => {
        if (!el) return 1.0;
        const rect = el.getBoundingClientRect();
        return rect.top / window.innerHeight;
      };

      const aboutP = getProgress(aboutEl);
      const skillsP = getProgress(skillsEl);
      const projectsP = getProgress(projectsEl);
      const journeyP = getProgress(journeyEl);
      const contactP = getProgress(contactEl);

      // STAGE 1: HERO (Cinematic Front 3/4 View — ALL WHEELS GROUNDED AT Y=0)
      let target = {
        x: isMobile ? 0 : 1.65,
        y: 0, // MUST REMAIN AT 0 (ON THE SHOWROOM FLOOR)
        z: isMobile ? -0.8 : 0.05,
        rotX: 0.015,
        rotY: -Math.PI * 0.22, // -40° front 3/4
        rotZ: 0,
        scale: isMobile ? 0.62 : (isTablet ? 0.82 : 1.0),
        tailLightIntensity: 0.2,
        tailLightGlow: 0.3,
      };

      if (contactP <= 0.6) {
        // STAGE 6: CONTACT (Direct Rear Stance + Guards Red Taillights)
        target = {
          x: 0,
          y: 0, // GROUNDED
          z: isMobile ? -0.5 : 0.35,
          rotX: 0.015,
          rotY: Math.PI, // 180° Direct Rear View
          rotZ: 0,
          scale: isMobile ? 0.68 : 1.05,
          tailLightIntensity: 4.8,
          tailLightGlow: 3.2,
        };
      } else if (journeyP <= 0.6) {
        // STAGE 5: JOURNEY (Rear Three-Quarter Track — Whale Tail Focus)
        target = {
          x: isMobile ? 0 : 1.35,
          y: 0, // GROUNDED
          z: isMobile ? -0.6 : 0.05,
          rotX: 0.03,
          rotY: -Math.PI * 0.78,
          rotZ: 0,
          scale: isMobile ? 0.6 : 0.96,
          tailLightIntensity: 1.5,
          tailLightGlow: 1.2,
        };
      } else if (projectsP <= 0.6) {
        // STAGE 4: PROJECTS (Dynamic Left Stance, Framing Project Cards)
        target = {
          x: isMobile ? 0 : -2.35,
          y: 0, // GROUNDED
          z: isMobile ? -0.6 : 0.25,
          rotX: 0.025,
          rotY: Math.PI * 0.22,
          rotZ: 0,
          scale: isMobile ? 0.64 : 1.0,
          tailLightIntensity: 0.3,
          tailLightGlow: 0.4,
        };
      } else if (skillsP <= 0.6) {
        // STAGE 3: SKILLS (Elevated Technical Perspective & Widebody Stance)
        target = {
          x: isMobile ? 0 : 1.45,
          y: 0, // GROUNDED
          z: isMobile ? -0.6 : 0.0,
          rotX: 0.04,
          rotY: -Math.PI * 0.28,
          rotZ: 0,
          scale: isMobile ? 0.62 : 0.95,
          tailLightIntensity: 0.2,
          tailLightGlow: 0.3,
        };
      } else if (aboutP <= 0.6) {
        // STAGE 2: ABOUT (Pure 90° Side Profile Silhouette)
        target = {
          x: isMobile ? 0 : 2.1,
          y: 0, // GROUNDED
          z: isMobile ? -0.7 : -0.05,
          rotX: 0.01,
          rotY: -Math.PI * 0.5, // 90° pure side silhouette
          rotZ: 0,
          scale: isMobile ? 0.62 : 0.98,
          tailLightIntensity: 0.3,
          tailLightGlow: 0.35,
        };
      }

      return target;
    };

    const current = {
      x: 1.65,
      y: 0,
      z: 0.05,
      rotX: 0.015,
      rotY: -Math.PI * 0.22,
      rotZ: 0,
      scale: 1.0,
      tailLightIntensity: 0.2,
      tailLightGlow: 0.3,
    };

    // ── 8. Animation Loop ─────────────────────────────────────────────────
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Mouse smoothing
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Choreography interpolation
      const target = getChoreographyTarget();
      const ease = 0.045;

      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      current.z += (target.z - current.z) * ease;
      current.rotX += (target.rotX - current.rotX) * ease;
      current.rotY += (target.rotY - current.rotY) * ease;
      current.rotZ += (target.rotZ - current.rotZ) * ease;
      current.scale += (target.scale - current.scale) * ease;
      current.tailLightIntensity += (target.tailLightIntensity - current.tailLightIntensity) * ease;
      current.tailLightGlow += (target.tailLightGlow - current.tailLightGlow) * ease;

      // Subtle suspension breathing (just 2mm, grounded on floor)
      const idleHover = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.8) * 0.002;

      carRoot.position.set(
        current.x + currentMouseX * 0.18,
        0 + idleHover, // GROUNDED ON FLOOR
        current.z
      );

      carRoot.rotation.set(
        current.rotX + currentMouseY * 0.06,
        current.rotY + currentMouseX * 0.18,
        current.rotZ
      );

      carRoot.scale.set(current.scale, current.scale, current.scale);

      // Taillight intensity updates
      tailLight1.intensity = current.tailLightIntensity;
      tailLight2.intensity = current.tailLightIntensity;

      if (taillightMeshes.length > 0) {
        taillightMeshes.forEach((mesh) => {
          if (mesh.material && mesh.material.emissive) {
            mesh.material.emissiveIntensity = current.tailLightGlow;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── 9. Window Resize Handler ──────────────────────────────────────────
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      pmremGenerator.dispose();
      studioEnvMap.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div className="porsche-fallback" aria-hidden="true">
        <div className="porsche-fallback-overlay" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`porsche-canvas-container ${isLoaded ? 'is-ready' : 'is-loading'}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="porsche-gl-canvas" />

      {/* Loading Telemetry HUD */}
      {!isLoaded && (
        <div className="porsche-loader-hud">
          <div className="porsche-loader-badge">
            <span className="porsche-loader-dot" />
            <span className="porsche-loader-label">1975 PORSCHE 911 (930) TURBO</span>
          </div>
          <div className="porsche-loader-bar-bg">
            <div
              className="porsche-loader-bar-fill"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className="porsche-loader-stats">
            <span>CALIBRATING CHASSIS</span>
            <span>{loadProgress}%</span>
          </div>
        </div>
      )}

      {/* Telemetry Corner Badges */}
      <div className="porsche-hud-badge top-right">
        <span className="hud-accent">MODEL:</span> 1975 PORSCHE 911 (930) TURBO
      </div>
      <div className="porsche-hud-badge bottom-left">
        <span className="hud-accent">PAINT:</span> BRITISH RACING GREEN METALLIC
      </div>
    </div>
  );
};

export default PorscheCanvas;
