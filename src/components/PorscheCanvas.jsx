// src/components/PorscheCanvas.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import './PorscheCanvas.css';

// Master meshopt-compressed model for authentic silhouette, clearcoat lacquer, and high-fidelity textures.
const MODEL_URL_DESKTOP = '/models/porsche_911.opt.glb?v=4';

function disposeModel(root) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  root.traverse((node) => {
    if (node.geometry) geometries.add(node.geometry);
    const nodeMaterials = Array.isArray(node.material) ? node.material : [node.material];
    nodeMaterials.filter(Boolean).forEach((material) => {
      materials.add(material);
      Object.values(material).forEach((value) => {
        if (value?.isTexture) textures.add(value);
      });
    });
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => texture.dispose());
}

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

  // Rear wide 930 Turbo tires (at negative Z / top of canvas)
  drawTireShadow(290, 320, 115, 48); // Rear left
  drawTireShadow(734, 320, 115, 48); // Rear right

  // Front tires (at positive Z / bottom of canvas)
  drawTireShadow(320, 710, 85, 38); // Front left
  drawTireShadow(704, 710, 85, 38); // Front right

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

// Procedural soft showroom floor falloff vignette (eliminates horizon line completely)
function createGroundAlphaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Three.js alphaMap reads the green/luminance channel:
  // #ffffff = fully opaque satin floor, #000000 = 100% transparent
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 512, 512);

  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 235);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.3, '#cccccc');
  grad.addColorStop(0.55, '#555555');
  grad.addColorStop(0.78, '#151515');
  grad.addColorStop(1.0, '#000000');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(256, 256, 235, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

// Procedural luminous LED headlight lens glow texture
function createHeadlightGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 256, 256);

  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 125);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.25, 'rgba(255, 252, 245, 0.85)');
  grad.addColorStop(0.55, 'rgba(255, 248, 235, 0.30)');
  grad.addColorStop(0.85, 'rgba(255, 245, 225, 0.06)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

// Broad soft alpha map for the high-beam spill on the showroom floor
function createHeadlightBeamTexture(maxAlpha = 0.32) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(512, 512);
  for (let y = 0; y < 512; y += 1) {
    for (let x = 0; x < 512; x += 1) {
      const dx = (x - 255.5) / 255.5;
      const dy = (y - 255.5) / 255.5;
      const radius = Math.sqrt(dx * dx + dy * dy);
      const softFalloff = Math.exp(-radius * radius * 3.5) * Math.min(1, (1 - radius) * 7);
      const alpha = Math.round(255 * maxAlpha * Math.max(0, softFalloff));
      const offset = (y * 512 + x) * 4;
      image.data[offset] = 224;
      image.data[offset + 1] = 240;
      image.data[offset + 2] = 255;
      image.data[offset + 3] = alpha;
    }
  }
  ctx.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  return texture;
}

const PorscheCanvas = ({
  onReady,
  onProgress,
  onError,
  carColor = '#083d20',
  headlightsOn = true,
  inspectMode = false,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const lastProgressRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  const carColorRef = useRef(carColor);
  carColorRef.current = carColor;
  const headlightsOnRef = useRef(headlightsOn);
  headlightsOnRef.current = headlightsOn;
  const inspectModeRef = useRef(inspectMode);
  inspectModeRef.current = inspectMode;
  const paintMeshesRef = useRef([]);
  const headlightElementsRef = useRef([]);
  const scheduleAnimationRef = useRef(null);
  const updateChoreographyTargetRef = useRef(null);

  // Dynamic Paint Color update
  useEffect(() => {
    if (paintMeshesRef.current.length === 0) return;
    const col = new THREE.Color(carColor);
    paintMeshesRef.current.forEach((mesh) => {
      if (mesh.material) {
        mesh.material.color.copy(col);
        if (mesh.material.sheenColor) {
          mesh.material.sheenColor.copy(col).offsetHSL(0, 0.1, 0.12);
        }
        mesh.material.needsUpdate = true;
      }
    });
    scheduleAnimationRef.current?.();
  }, [carColor]);

  // Dynamic Headlights update
  useEffect(() => {
    if (headlightElementsRef.current.length === 0) return;
    headlightElementsRef.current.forEach((el) => {
      if (el) el.visible = headlightsOn;
    });
    scheduleAnimationRef.current?.();
  }, [headlightsOn]);

  // Inspect mode trigger update
  useEffect(() => {
    updateChoreographyTargetRef.current?.();
    scheduleAnimationRef.current?.();
  }, [inspectMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileViewport = window.innerWidth <= 768;
    const hasCapabilityInfo = Boolean(navigator.deviceMemory || navigator.hardwareConcurrency);
    const lowEndDevice = (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (mobileViewport && !hasCapabilityInfo);
    // High-performance automotive renderer: 1.35x DPR on mobile balances Retina clarity with 54% less GPU fill rate
    const pixelRatio = mobileViewport
      ? Math.min(window.devicePixelRatio || 1, 1.35)
      : Math.min(window.devicePixelRatio || 1, 2);

    // ── 1. Renderer, Camera, Scene Setup ──────────────────────────────────
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !lowEndDevice,
        powerPreference: 'high-performance',
        precision: mobileViewport ? 'mediump' : 'highp',
      });
    } catch (e) {
      console.warn('WebGL init failed:', e);
      setWebglSupported(false);
      onErrorRef.current?.();
      return;
    }

    renderer.setPixelRatio(pixelRatio);
    const initialRect = containerRef.current.getBoundingClientRect();
    renderer.setSize(initialRect.width || window.innerWidth, initialRect.height || window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25; // Slightly boosted for richer midtone contrast & paint depth
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;

    const scene = new THREE.Scene();
    if (import.meta.env.DEV) {
      window.__scene = scene;
      window.__THREE = THREE;
    }
    // Set 100% opaque seamless studio background with fog pushed far behind the vehicle
    const STUDIO_BG = 0x0e1012;
    scene.background = new THREE.Color(STUDIO_BG);
    scene.fog = new THREE.Fog(STUDIO_BG, 18.0, 42.0); // Car at z=11.2 has 0% fog — crystal-clear contrast

    // Cinematic Automotive Studio Lens (26° FOV for authentic telephoto compression)
    // Camera is placed at eye/hood height (0.95m) for a powerful, full-sized automotive stance
    const camera = new THREE.PerspectiveCamera(
      26,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    const mobileCameraDistance = 11.2;
    camera.position.set(0, 0.95, mobileCameraDistance);
    camera.lookAt(0, mobileViewport ? 0.72 : 0.65, 0);
    if (import.meta.env.DEV) window.__camera = camera;

    // ── 2. Procedural Automotive Studio Environment (Continuous IBL) ──────
    // Fully enabled on both mobile and desktop for rich clearcoat specular & reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const studioScene = new THREE.Scene();
    studioScene.background = new THREE.Color(STUDIO_BG);

    // ── Premium Automotive Photography Studio IBL ──
    // Uses gradient-painted panels for smoother, more photorealistic reflections
    // on curved body panels (vs. flat white panels that produce harsh cutoffs).

    // Helper: gradient canvas material for soft studio reflections
    const createGradientMaterial = (w, h, stops) => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      const g = ctx.createLinearGradient(0, 0, 0, h);
      stops.forEach(([pos, col]) => g.addColorStop(pos, col));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return new THREE.MeshBasicMaterial({ map: t });
    };

    // Overhead softbox bank — bright-to-warm gradient for natural falloff
    const topPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 28),
      createGradientMaterial(4, 64, [
        [0, '#ffffff'], [0.4, '#fff8ee'], [0.75, '#ffe8cc'], [1, '#0e1012'],
      ])
    );
    topPanel.rotation.x = Math.PI / 2;
    topPanel.position.set(0, 9.5, 0);
    studioScene.add(topPanel);

    // Left fill silk softbox — warm edge for body highlights
    const leftPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 20),
      createGradientMaterial(4, 64, [
        [0, '#0e1012'], [0.15, '#fff5e5'], [0.6, '#ffffff'], [0.85, '#fff8ee'], [1, '#0e1012'],
      ])
    );
    leftPanel.position.set(-13, 4.5, 3);
    leftPanel.rotation.y = Math.PI / 3;
    studioScene.add(leftPanel);

    // Right fill softbox — slightly cooler for depth
    const rightPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 20),
      createGradientMaterial(4, 64, [
        [0, '#0e1012'], [0.15, '#f5f8ff'], [0.6, '#ffffff'], [0.85, '#fffbf5'], [1, '#0e1012'],
      ])
    );
    rightPanel.position.set(13, 4.5, 3);
    rightPanel.rotation.y = -Math.PI / 3;
    studioScene.add(rightPanel);

    // Rear rim strip for iconic whale-tail contour
    const rearPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 5),
      createGradientMaterial(4, 32, [
        [0, '#0e1012'], [0.3, '#ffffff'], [0.7, '#ffffff'], [1, '#0e1012'],
      ])
    );
    rearPanel.position.set(0, 5.5, -9);
    rearPanel.rotation.x = -Math.PI / 6;
    studioScene.add(rearPanel);

    // Front horizontal softbox strip for hood/fender reflection curve
    const frontPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 4),
      createGradientMaterial(64, 4, [
        [0, '#0e1012'], [0.2, '#ffffff'], [0.8, '#ffffff'], [1, '#0e1012'],
      ])
    );
    frontPanel.position.set(0, 3.5, 13);
    studioScene.add(frontPanel);

    // Low ground bounce panel — subtle floor-level fill for underbody
    const groundBounce = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshBasicMaterial({ color: 0x1a1c1e })
    );
    groundBounce.rotation.x = -Math.PI / 2;
    groundBounce.position.set(0, -0.5, 0);
    studioScene.add(groundBounce);

    const studioEnvMap = pmremGenerator.fromScene(studioScene).texture;
    scene.environment = studioEnvMap;
    pmremGenerator.dispose();

    // ── 4. Professional Studio Lighting Rig ───────────────────────────────
    // 1. Warm forest green ambient fill — guarantees curves & body never drop to pitch black
    const ambientLight = new THREE.AmbientLight(0x132a1b, 2.0);
    scene.add(ambientLight);

    // 2. Large soft key light (Front-Left Studio Softbox) — boosted for richer specular
    const keyLight = new THREE.DirectionalLight(0xfffaed, 3.2);
    keyLight.position.set(-5.5, 5.0, 6.2);
    scene.add(keyLight);

    // 3. Secondary fill light (Front-Right) — warm neutral studio white
    const fillLight = new THREE.DirectionalLight(0xfffaef, 1.8);
    fillLight.position.set(5.5, 4.2, 5.2);
    scene.add(fillLight);

    // 4. Overhead strip lighting (runs along car roofline) — slightly warmer
    const overheadLight = new THREE.DirectionalLight(0xfffdf8, 2.1);
    overheadLight.position.set(0, 8.5, 0);
    scene.add(overheadLight);

    // 5. Dual subtle rim lights for flared rear turbo arches & whale tail
    const rearRimLeft = new THREE.DirectionalLight(0xfffaed, 1.5);
    rearRimLeft.position.set(-4.5, 3.2, -5.5);
    scene.add(rearRimLeft);

    const rearRimRight = new THREE.DirectionalLight(0xfffaed, 1.5);
    rearRimRight.position.set(4.5, 3.2, -5.5);
    scene.add(rearRimRight);

    // 6. Subtle upward underbody fill to soften chassis shadows
    const underbodyFill = new THREE.DirectionalLight(0x16241b, 0.75);
    underbodyFill.position.set(0, -2, 0);
    scene.add(underbodyFill);

    // 7. Low-angle kicker for wheel arch & fender highlight (cinematic automotive photography)
    const kickerLight = new THREE.DirectionalLight(0xfff5e8, 0.9);
    kickerLight.position.set(-7, 1.2, 2);
    scene.add(kickerLight);

    // ── 5. Vehicle Root & Ground Anchor ───────────────────────────────────
    const carRoot = new THREE.Group();
    carRoot.position.set(1.65, 0, 0.1);
    scene.add(carRoot);

    // Soft radial showroom floor reflection pool (strictly under car, ZERO horizon line)
    const groundGeo = new THREE.PlaneGeometry(8, 8);
    const groundAlphaMap = createGroundAlphaTexture();
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x111315,
      roughness: 0.22,      // Polished showroom epoxy floor — sharper reflections
      metalness: 0.55,      // Reflects body paint & studio lights convincingly
      envMapIntensity: 2.2,
      alphaMap: groundAlphaMap,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0.0005, 0); // Sits right on showroom floor under chassis
    carRoot.add(ground);

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
    contactShadow.position.set(0, 0.002, 0); // Sits 2mm above ground
    carRoot.add(contactShadow);

    // Taillight point lights at rear chassis
    const tailLight1 = new THREE.PointLight(0xaa1818, 0.4, 8, 1.8);
    const tailLight2 = new THREE.PointLight(0xaa1818, 0.4, 8, 1.8);
    tailLight1.position.set(-0.7, 0.55, -2.1);
    tailLight2.position.set(0.7, 0.55, -2.1);
    carRoot.add(tailLight1);
    carRoot.add(tailLight2);

    // Front LED Headlight Beams & Projector Glow (pure 5500K xenon white)
    const addHeadlightSpot = (x, intensity = 18, angle = Math.PI / 12) => {
      const spot = new THREE.SpotLight(0xfffbf2, intensity, 20, angle, 0.9, 1.1);
      spot.position.set(x, 0.72, 2.3);
      spot.target.position.set(x, 0.02, 8.5);
      carRoot.add(spot, spot.target);
    };
    addHeadlightSpot(0.72);
    addHeadlightSpot(-0.72);

    const taillightMeshes = [];
    let paintMeshes = [];

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    // Use master optimized model everywhere for true clearcoat paint, metallic flakes, and high-fidelity textures
    const modelUrl = MODEL_URL_DESKTOP;
    let loadedModel = null;
    let loadCancelled = false;
    const loadModel = () => {
      if (loadCancelled) return;
      loader.load(
      modelUrl,
      (gltf) => {
        if (loadCancelled) {
          disposeModel(gltf.scene);
          return;
        }
        const porsche = gltf.scene;
        loadedModel = porsche;

        // Reduce blur on paint and trim viewed at shallow angles.
        const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        porsche.traverse((node) => {
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.filter(Boolean).forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value?.isTexture && value.anisotropy < maxAnisotropy) {
                value.anisotropy = maxAnisotropy;
                value.needsUpdate = true;
              }
            });
          });
        });

        // ── 5.1 CLEAN UP ROGUE NODES & TOY ELEMENTS ─────────────────────
        porsche.traverse((child) => {
          const rawName = (child.name || '').toLowerCase();
          const cleanName = rawName.replace(/[^a-z0-9]/g, '');
          const matName = (child.material?.name || '').toLowerCase();

          // Only sticker meshes need a Z-depth test. Computing bounds for every
          // phone mesh forces a costly full vertex scan during model startup.
          let zCenter = child.position.z;
          if (matName.includes('sticker') && child.geometry) {
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
        const cleanCenter = cleanBox.getCenter(new THREE.Vector3());
        porsche.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Uniform scaling lets us derive the grounded center from the first
        // bounds pass instead of walking every vertex a second time.
        porsche.position.x = -cleanCenter.x * scaleFactor;
        porsche.position.y = -cleanBox.min.y * scaleFactor;
        porsche.position.z = -cleanCenter.z * scaleFactor;
        porsche.updateMatrixWorld(true);

        // Position taillights at exact rear chassis coordinates (rear is negative Z)
        tailLight1.position.set(-0.7, 0.55, -2.1);
        tailLight2.position.set(0.7, 0.55, -2.1);

        // Front LED Projector Headlight Lenses (crisp 6000K luminous glow discs)
        const glowTex = createHeadlightGlowTexture();
        const glowMat = new THREE.MeshBasicMaterial({
          map: glowTex,
          transparent: true,
          opacity: 1.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        });
        const lensGeo = new THREE.PlaneGeometry(0.38, 0.38);

        const leftGlowMesh = new THREE.Mesh(lensGeo, glowMat);
        leftGlowMesh.position.set(0.86, 0.88, 3.02);
        leftGlowMesh.rotation.set(-0.25, 0.22, 0);
        porsche.add(leftGlowMesh);

        const rightGlowMesh = new THREE.Mesh(lensGeo, glowMat);
        rightGlowMesh.position.set(-0.86, 0.88, 3.02);
        rightGlowMesh.rotation.set(-0.25, -0.22, 0);
        porsche.add(rightGlowMesh);

        // Diffuse road spill makes the high beams read as light instead of flat shafts.
        const floorBeamTexture = createHeadlightBeamTexture(0.5);
        const floorBeamMaterial = new THREE.MeshBasicMaterial({
          color: 0xfffaee,
          map: floorBeamTexture,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
          toneMapped: false,
        });
        const floorBeamGeometry = new THREE.PlaneGeometry(3.5, 3.2);
        const addFloorBeam = (x) => {
          const pool = new THREE.Mesh(floorBeamGeometry, floorBeamMaterial);
          pool.rotation.x = Math.PI / 2;
          pool.position.set(x, 0.004, 4.35);
          porsche.add(pool);
        };
        [0.86, -0.86].forEach(addFloorBeam);

        // A restrained, soft-edged cone gives the headlight output a little atmosphere.
        const shaftLength = 4.4;
        const shaftAngle = 0.18;
        const shaftMaterial = new THREE.ShaderMaterial({
          uniforms: { beamColor: { value: new THREE.Color(0xfffaed) } },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 beamColor;
            varying vec2 vUv;
            void main() {
              float edge = min(vUv.x, 1.0 - vUv.x) * 2.0;
              float softEdge = smoothstep(0.0, 0.8, edge);
              float along = 0.65 + 0.35 * sin(vUv.y * 3.14159265);
              float alpha = softEdge * softEdge * along * 0.02;
              gl_FragColor = vec4(beamColor, alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
          toneMapped: false,
        });
        const addHeadlightShaft = (x) => {
          const shaft = new THREE.Mesh(
            new THREE.CylinderGeometry(0.82, 0.025, shaftLength, 32, 1, true),
            shaftMaterial
          );
          shaft.rotation.x = Math.PI / 2 + shaftAngle;
          shaft.position.set(
            x,
            0.88 - Math.sin(shaftAngle) * shaftLength / 2,
            3.04 + Math.cos(shaftAngle) * shaftLength / 2
          );
          porsche.add(shaft);
        };
        addHeadlightShaft(0.86);
        addHeadlightShaft(-0.86);

        // ── 5.3 AUTOMOTIVE MATERIALS & AUTHENTIC DETAILS ──────────────────
        porsche.traverse((child) => {
          if (!child.isMesh || !child.material || !child.visible) return;
          const rawName = (child.name || '').toLowerCase();
          const cleanName = rawName.replace(/[^a-z0-9]/g, '');
          const matName = child.material.name.toLowerCase();

          // 1. Hide motorsport sticker discs covering the front headlights
          if (
            matName.includes('sticker') &&
            (cleanName.includes('circle016') ||
             cleanName.includes('circle013') ||
             cleanName.includes('circle014') ||
             cleanName.includes('circle031') ||
             cleanName.includes('circle034') ||
             cleanName.includes('circle1012'))
          ) {
            child.visible = false;
            return;
          }

          // 2. FRONT HEADLIGHTS — OUTER BOSCH FLUTED GLASS LENS (Circle036)
          if (cleanName.includes('circle036') && matName.includes('refraction')) {
            const origNorm = child.material.normalMap;
            child.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color(0xffffff),
              transparent: true,
              opacity: 0.45,
              roughness: 0.04,
              clearcoat: 1.0,
              clearcoatRoughness: 0.02,
              envMapIntensity: 4.0,
              normalMap: origNorm,
              depthWrite: false,
            });
            return;
          }

          // 3. FRONT HEADLIGHTS — INNER REFLECTORS & ILLUMINATED LED PROJECTORS (Circle035 & Circle005)
          if (cleanName.includes('circle035') || cleanName.includes('circle005')) {
            const origNorm = child.material.normalMap;
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0xffffff),
              emissive: new THREE.Color(0xecf6ff), // Crisp 6000K brilliant LED white
              emissiveIntensity: 9.0,             // Full-beam projector output
              metalness: 0.90,
              roughness: 0.06,
              envMapIntensity: 3.8,
              normalMap: origNorm,
            });
            return;
          }

          // 4. FRONT HEADLIGHTS — POLISHED CHROME BEZEL RINGS (Circle060)
          if (cleanName.includes('circle060')) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0xffffff),
              metalness: 0.98,
              roughness: 0.02,
              envMapIntensity: 4.5,
            });
            return;
          }

          // 5. FRONT HORN GRILLES & CHROME TRIMS (Circle056, Circle033, Circle030)
          if (cleanName.includes('circle056') || cleanName.includes('circle033') || cleanName.includes('circle030')) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0xffffff),
              metalness: 0.98,
              roughness: 0.03,
              envMapIntensity: 4.0,
            });
            return;
          }

          // 6. FRONT LOWER BUMPER INDICATORS (Circle006)
          if (cleanName.includes('circle006')) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(0xffaa22), // Vintage amber signal lens
              emissive: new THREE.Color(0xff8800),
              emissiveIntensity: 0.7,
              roughness: 0.12,
              metalness: 0.25,
            });
            return;
          }

          // 7. REAR TAILLIGHTS & REFLECTOR STRIP (Circle008, Circle007, Circle025, Cube003 at rear Z < -1.5)
          const isRearTaillight =
            cleanName.includes('circle008') ||
            cleanName.includes('circle007') ||
            cleanName.includes('circle025') ||
            (cleanName.includes('cube003') && !matName.includes('chrome'));

          if (isRearTaillight) {
            child.material = child.material.clone();
            child.material.color = new THREE.Color(0x991818);
            child.material.emissive = new THREE.Color(0xcc1818);
            child.material.emissiveIntensity = 0.65;
            child.material.roughness = 0.16;
            child.material.metalness = 0.25;
            child.material.clearcoat = 0.95;
            child.material.clearcoatRoughness = 0.04;
            child.material.envMapIntensity = 2.4;
            taillightMeshes.push(child);
            return;
          }

          // 8. Rich British Racing Green / Oak Green Metallic Body Paint
          if (matName.includes('paint')) {
            const origNorm = child.material.normalMap;
            const origRough = child.material.roughnessMap;

            // AAA-grade British Racing Green — deep metallic lacquer with micro-flake depth
            child.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color('#083d20'),  // Slightly brighter BRG for better midtone separation
              metalness: 0.38,                   // Richer metallic flake presence without going mirror
              roughness: 0.08,                   // Near-perfect lacquer finish
              clearcoat: 1.0,                    // Wet-look mirror clearcoat
              clearcoatRoughness: 0.015,         // Razor-crisp clearcoat reflections
              reflectivity: 0.98,                // Near-perfect Fresnel reflectivity
              envMapIntensity: 2.8,              // Stronger environment reflections on curves
              sheen: 0.15,                       // Subtle micro-flake metallic sheen
              sheenRoughness: 0.25,              // Soft sparkle at grazing angles
              sheenColor: new THREE.Color('#1a6b3a'), // Green-tinted metallic flake shimmer
              normalMap: origNorm,
              normalScale: new THREE.Vector2(0.75, 0.75), // Slightly softer normals for smoother body curves
              roughnessMap: origRough,
            });
            child.material.needsUpdate = true;
            paintMeshes.push(child);
            return;
          }

          // 9. Rims: Classic Fuchs Two-Tone Alloy Rims (Satin black center + polished chrome rim)
          if (matName.includes('rim')) {
            child.material.metalness = 0.95;
            child.material.roughness = 0.12;  // Polished alloy finish
            child.material.envMapIntensity = 3.5;
            return;
          }

          // 10. Tires: Authentic Matte Vulcanized Rubber (Preserves tread normal map)
          if (matName.includes('tire')) {
            child.material.color = new THREE.Color(0x161616);
            child.material.metalness = 0.02;
            child.material.roughness = 0.88;
            child.material.envMapIntensity = 0.35;
            return;
          }

          // 11. Chrome Trim: Mirror Polished Chrome (Bezels, window frames, door handles, exhaust)
          if (matName.includes('chrome')) {
            child.material.color = new THREE.Color(0xffffff);
            child.material.metalness = 0.99;
            child.material.roughness = 0.01;  // Mirror-perfect chrome
            child.material.envMapIntensity = 5.0; // Blazing reflections on trim
            return;
          }

          // 12. Windows: Deep Tinted Automotive Safety Glass
          if (matName.includes('glass')) {
            child.material.color = new THREE.Color(0x081210);
            child.material.transparent = true;
            child.material.opacity = 0.50;  // Slightly more visible interior tint
            child.material.roughness = 0.02;
            child.material.metalness = 0.92;
            child.material.envMapIntensity = 3.8; // Stronger window reflections
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

        // Retain 100% full-resolution texture maps for tack-sharp clarity
        carRoot.add(porsche);

        // Shader compilation is what used to freeze the main thread for seconds
        // right as the car appeared (30 programs x ~150 ms under CPU throttle).
        // compileAsync links them in parallel via KHR_parallel_shader_compile,
        // so the reveal happens once the GPU is actually ready.
        let revealed = false;
        const reveal = () => {
          if (revealed || loadCancelled) return;
          revealed = true;
          // Absorb the first-frame cost (texture/geometry upload) while the
          // poster is still up, then fade the car in at the correct pose.
          Object.assign(current, choreographyTarget);
          carRoot.position.set(current.x, 0, current.z);
          carRoot.rotation.set(current.rotX, current.rotY, current.rotZ);
          carRoot.scale.set(current.scale, current.scale, current.scale);
          camera.lookAt(0, current.cameraTargetY, 0);
          try {
            renderer.render(scene, camera);
          } catch (e) {
            console.warn('Porsche scene failed to render; keeping the poster fallback.', e);
            setLoadFailed(true);
            onErrorRef.current?.();
            return;
          }
          setIsLoaded(true);
          paintMeshesRef.current = paintMeshes;
          headlightElementsRef.current = [leftGlowMesh, rightGlowMesh, floorBeamMaterial, shaftMaterial].filter(Boolean);
          if (carColorRef.current && carColorRef.current !== '#083d20') {
            const initCol = new THREE.Color(carColorRef.current);
            paintMeshes.forEach((mesh) => {
              if (mesh.material) {
                mesh.material.color.copy(initCol);
                if (mesh.material.sheenColor) mesh.material.sheenColor.copy(initCol).offsetHSL(0, 0.1, 0.12);
                mesh.material.needsUpdate = true;
              }
            });
          }
          if (headlightsOnRef.current === false) {
            headlightElementsRef.current.forEach((el) => {
              if (el) el.visible = false;
            });
          }
          onReadyRef.current?.();
          if (!prefersReducedMotion) scheduleAnimation();
        };
        if (typeof renderer.compileAsync === 'function') {
          renderer.compileAsync(scene, camera).then(reveal, reveal);
        } else {
          reveal();
        }
      },
      (xhr) => {
        if (xhr.total > 0) {
          const progress = Math.min(100, Math.round((xhr.loaded / xhr.total) * 100));
          if (progress !== lastProgressRef.current) {
            lastProgressRef.current = progress;
            onProgressRef.current?.(progress);
          }
        }
      },
      (err) => {
        if (loadCancelled) return;
        console.warn('Porsche model could not be loaded; keeping the lightweight hero fallback.', err);
        setLoadFailed(true);
        onErrorRef.current?.();
      }
      );
    };

    // Load model immediately for instant, high-clarity reveal
    loadModel();

    // ── 6. Mouse Parallax (Refined & Subtle) ───────────────────────────────
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.25;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.15;
    };

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!prefersReducedMotion && !lowEndDevice && hasFinePointer) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // ── 6.1 360° Inspection Orbit Controls ──────────────────────────────────
    let inspectRotY = -Math.PI * 0.22;
    let inspectRotX = 0.015;
    let isInspectDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    const handlePointerDown = (e) => {
      if (!inspectModeRef.current) return;
      isInspectDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    };

    const handlePointerMove = (e) => {
      if (!inspectModeRef.current || !isInspectDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      inspectRotY += dx * 0.009;
      inspectRotX = Math.max(-0.25, Math.min(0.35, inspectRotX + dy * 0.006));
      updateChoreographyTarget();
    };

    const handlePointerUp = () => {
      isInspectDragging = false;
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    // ── 7. Scroll Choreography (ALL STAGES GROUNDED AT Y = 0) ──────────────
    const getChoreographyTarget = () => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth < 1024;

      if (inspectModeRef.current) {
        return {
          x: isMobile ? 0 : 0.45,
          y: 0,
          z: isMobile ? 0.2 : 0.15,
          cameraTargetY: isMobile ? 0.72 : 0.65,
          rotX: inspectRotX,
          rotY: inspectRotY,
          rotZ: 0,
          scale: isMobile ? 0.82 : 1.05,
          tailLightIntensity: 0.8,
          tailLightGlow: 0.6,
        };
      }

      // MOBILE VIEW: Strictly lock to direct front bumper view with NO scroll choreography animations
      if (isMobile) {
        return {
          x: 0,
          y: 0, // Grounded on showroom floor
          z: 0.22,
          cameraTargetY: 0.72,
          rotX: 0.015,
          rotY: 0, // 0° Direct straight front bumper view
          rotZ: 0,
          scale: window.innerWidth < 360 ? 0.76 : 0.82,
          tailLightIntensity: 0.0,
          tailLightGlow: 0.2,
        };
      }

      const aboutEl = document.getElementById('about');
      const skillsEl = document.getElementById('skills');
      const problemSolvingEl = document.getElementById('problem-solving');
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
      const problemSolvingP = getProgress(problemSolvingEl);
      const projectsP = getProgress(projectsEl);
      const journeyP = getProgress(journeyEl);
      const contactP = getProgress(contactEl);

      // STAGE 1: HERO (Cinematic Front 3/4 View — ALL WHEELS GROUNDED AT Y=0)
      let target = {
        x: isMobile ? 0.18 : 1.65,
        y: 0, // MUST REMAIN AT 0 (ON THE SHOWROOM FLOOR)
        z: isMobile ? -0.28 : 0.05,
        cameraTargetY: isMobile ? 1.74 : 0.65,
        rotX: 0.015,
        rotY: -Math.PI * 0.22, // -40° front 3/4
        rotZ: 0,
        scale: isMobile ? 0.68 : (isTablet ? 0.82 : 1.0),
        tailLightIntensity: 0.0,
        tailLightGlow: 0.2,
      };

      if (contactP <= 0.6) {
        // STAGE 6: CONTACT (Direct Rear Stance + Guards Red Taillights)
        target = {
          x: 0,
          y: 0, // GROUNDED
          z: isMobile ? -0.1 : 0.35,
          cameraTargetY: isMobile ? 1.3 : 0.65,
          rotX: 0.015,
          rotY: Math.PI, // 180° Direct Rear View
          rotZ: 0,
          scale: isMobile ? 0.88 : 1.05,
          tailLightIntensity: 4.8,
          tailLightGlow: 3.2,
        };
      } else if (journeyP <= 0.6) {
        // STAGE 5: JOURNEY (Rear Three-Quarter Track — Whale Tail Focus)
        target = {
          x: isMobile ? 0 : 1.35,
          y: 0, // GROUNDED
          z: isMobile ? -0.15 : 0.05,
          cameraTargetY: isMobile ? 1.15 : 0.65,
          rotX: 0.03,
          rotY: -Math.PI * 0.78,
          rotZ: 0,
          scale: isMobile ? 0.82 : 0.96,
          tailLightIntensity: 1.5,
          tailLightGlow: 1.2,
        };
      } else if (projectsP <= 0.6) {
        // STAGE 4: PROJECTS (Dynamic Left Stance, Framing Project Cards)
        target = {
          x: isMobile ? 0 : -2.35,
          y: 0, // GROUNDED
          z: isMobile ? -0.15 : 0.25,
          cameraTargetY: isMobile ? -0.3 : 0.65,
          rotX: 0.025,
          rotY: Math.PI * 0.22,
          rotZ: 0,
          scale: isMobile ? 0.85 : 1.0,
          tailLightIntensity: 0.3,
          tailLightGlow: 0.4,
        };
      } else if (problemSolvingP <= 0.6) {
        // STAGE 3.5: TELEMETRY & ALGORITHMS (Technical 3/4 Stance)
        target = {
          x: isMobile ? 0 : -1.8,
          y: 0, // GROUNDED
          z: isMobile ? -0.15 : 0.15,
          cameraTargetY: isMobile ? 1.2 : 0.65,
          rotX: 0.035,
          rotY: Math.PI * 0.32,
          rotZ: 0,
          scale: isMobile ? 0.82 : 0.96,
          tailLightIntensity: 0.35,
          tailLightGlow: 0.4,
        };
      } else if (skillsP <= 0.6) {
        // STAGE 3: SKILLS (Elevated Technical Perspective & Widebody Stance)
        target = {
          x: isMobile ? 0 : 1.45,
          y: 0, // GROUNDED
          z: isMobile ? -0.15 : 0.0,
          cameraTargetY: isMobile ? 1.25 : 0.65,
          rotX: 0.04,
          rotY: -Math.PI * 0.28,
          rotZ: 0,
          scale: isMobile ? 0.84 : 0.95,
          tailLightIntensity: 0.2,
          tailLightGlow: 0.3,
        };
      } else if (aboutP <= 0.6) {
        // STAGE 2: ABOUT (Pure 90° Side Profile Silhouette)
        target = {
          x: isMobile ? 0 : 2.1,
          y: 0, // GROUNDED
          z: isMobile ? -0.2 : -0.05,
          cameraTargetY: isMobile ? 1.55 : 0.65,
          rotX: 0.01,
          rotY: -Math.PI * 0.5, // 90° pure side silhouette
          rotZ: 0,
          scale: isMobile ? 0.82 : 0.98,
          tailLightIntensity: 0.3,
          tailLightGlow: 0.35,
        };
      }

      if (isMobile && window.innerWidth < 360) target.scale *= 0.92;

      return target;
    };

    let choreographyTarget = getChoreographyTarget();
    const current = { ...choreographyTarget };

    // ── 8. Animation Loop ─────────────────────────────────────────────────
    let animationFrameId;
    let animationTimerId;
    let stageVisible = true;
    let motionStart = null;
    const frameInterval = lowEndDevice ? 1000 / 30 : 1000 / 60;

    const hasPendingMotion = () => {
      const target = choreographyTarget;
      return Math.abs(current.x - target.x) > 0.002 ||
        Math.abs(current.y - target.y) > 0.002 ||
        Math.abs(current.z - target.z) > 0.002 ||
        Math.abs(current.rotX - target.rotX) > 0.002 ||
        Math.abs(current.rotY - target.rotY) > 0.002 ||
        Math.abs(current.rotZ - target.rotZ) > 0.002 ||
        Math.abs(current.scale - target.scale) > 0.002 ||
        Math.abs(current.cameraTargetY - target.cameraTargetY) > 0.002 ||
        Math.abs(current.tailLightIntensity - target.tailLightIntensity) > 0.002 ||
        Math.abs(current.tailLightGlow - target.tailLightGlow) > 0.002 ||
        Math.abs(currentMouseX - targetMouseX) > 0.002 ||
        Math.abs(currentMouseY - targetMouseY) > 0.002;
    };

    const scheduleAnimation = () => {
      scheduleAnimationRef.current = scheduleAnimation;
      if (document.hidden || prefersReducedMotion || !stageVisible || animationTimerId !== undefined || animationFrameId !== undefined) return;
      animationTimerId = window.setTimeout(() => {
        animationTimerId = undefined;
        animationFrameId = requestAnimationFrame(animate);
      }, frameInterval);
    };

    const updateChoreographyTarget = () => {
      updateChoreographyTargetRef.current = updateChoreographyTarget;
      choreographyTarget = getChoreographyTarget();
      if (containerRef.current) {
        const scrolled = (window.scrollY || document.documentElement.scrollTop || 0) > 60;
        containerRef.current.classList.toggle('is-scrolled', scrolled);
      }
      if (prefersReducedMotion) {
        current.cameraTargetY = choreographyTarget.cameraTargetY;
        camera.lookAt(0, current.cameraTargetY, 0);
        renderer.render(scene, camera);
      } else if (hasPendingMotion()) {
        scheduleAnimation();
      }
    };
    // Scroll optimization: on mobile, car is locked to front bumper, so NEVER run
    // expensive getBoundingClientRect or WebGL renders on touch scroll.
    let scrollFrame = 0;
    const handleScroll = () => {
      if (mobileViewport && !inspectModeRef.current) {
        if (containerRef.current) {
          const scrolled = (window.scrollY || document.documentElement.scrollTop || 0) > 60;
          containerRef.current.classList.toggle('is-scrolled', scrolled);
        }
        return;
      }
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        updateChoreographyTarget();
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateChoreographyTarget();

    const animate = (now = 0) => {
      animationFrameId = undefined;
      if (document.hidden || prefersReducedMotion || !stageVisible) {
        return;
      }

      if (motionStart === null) motionStart = now;
      const elapsed = (now - motionStart) / 1000;

      // Mouse smoothing
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Choreography interpolation
      const target = choreographyTarget;
      const ease = 0.045;

      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      current.z += (target.z - current.z) * ease;
      current.rotX += (target.rotX - current.rotX) * ease;
      current.rotY += (target.rotY - current.rotY) * ease;
      current.rotZ += (target.rotZ - current.rotZ) * ease;
      current.scale += (target.scale - current.scale) * ease;
      current.cameraTargetY += (target.cameraTargetY - current.cameraTargetY) * ease;
      current.tailLightIntensity += (target.tailLightIntensity - current.tailLightIntensity) * ease;
      current.tailLightGlow += (target.tailLightGlow - current.tailLightGlow) * ease;

      // Subtle suspension breathing (just 2mm, grounded on floor)
      const idleHover = prefersReducedMotion || mobileViewport ? 0 : Math.sin(elapsed * 0.8) * 0.002;

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
      camera.lookAt(0, current.cameraTargetY, 0);

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
      // Mobile GPUs should not render an idle scene 24 times per second. Scroll
      // and pointer input schedule a short transition; once settled, it sleeps.
      if (!mobileViewport || hasPendingMotion()) scheduleAnimation();
    };

    if (prefersReducedMotion) renderer.render(scene, camera);
    else scheduleAnimation();

    // ── 9. Window Resize Handler ──────────────────────────────────────────
    const handleResize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || window.innerWidth;
      const height = rect?.height || window.innerHeight;
      camera.position.set(0, 0.95, 11.2);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(pixelRatio);
      updateChoreographyTarget();
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    const pauseAnimation = () => {
      cancelAnimationFrame(animationFrameId);
      window.clearTimeout(animationTimerId);
      animationFrameId = undefined;
      animationTimerId = undefined;
    };
    const stageObserver = new IntersectionObserver(([entry]) => {
      stageVisible = entry.isIntersecting;
      if (!stageVisible) {
        pauseAnimation();
      } else if (!mobileViewport || hasPendingMotion()) {
        scheduleAnimation();
      }
    });
    stageObserver.observe(containerRef.current);
    const handleVisibility = () => {
      if (document.hidden) {
        pauseAnimation();
      } else {
        if (prefersReducedMotion) renderer.render(scene, camera);
        else if (!mobileViewport || hasPendingMotion()) scheduleAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.clearTimeout(animationTimerId);
      loadCancelled = true;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('scroll', handleScroll);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver.disconnect();
      stageObserver.disconnect();
      renderer.renderLists.dispose();
      if (loadedModel) disposeModel(loadedModel);
      renderer.dispose();
      pmremGenerator?.dispose();
      studioEnvMap?.dispose();
      contactShadowTexture.dispose();
      groundAlphaMap.dispose();
      ground.geometry.dispose();
      groundMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      scene.clear();
      disposeModel(studioScene);
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
      className={`porsche-canvas-container ${isLoaded || loadFailed ? 'is-ready' : 'is-loading'} ${inspectMode ? 'is-inspecting' : ''}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="porsche-gl-canvas" />

      {/* Telemetry Corner Badges */}
      <div className="porsche-hud-badge top-right">
        <span className="hud-accent">MODEL:</span> 1975 PORSCHE 911 (930) TURBO
      </div>
      <div className="porsche-hud-badge bottom-left">
        <span className="hud-accent">FINISH:</span> {carColor === '#083d20' ? 'BRITISH RACING GREEN' : carColor === '#9e2929' ? 'GUARDS RED' : carColor === '#7a8288' ? 'GT SILVER' : carColor === '#c27803' ? 'SPEED YELLOW' : carColor === '#e2e8f0' ? 'GRAND PRIX WHITE' : 'MIDNIGHT BLACK'}
      </div>
    </div>
  );
};

export default PorscheCanvas;
