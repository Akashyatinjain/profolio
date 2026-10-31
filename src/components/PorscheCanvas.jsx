// src/components/PorscheCanvas.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './PorscheCanvas.css';

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

function downsampleTextures(root, maxSize) {
  const textures = new Set();
  root.traverse((node) => {
    if (!node.isMesh || !node.visible || !node.material) return;
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.forEach((material) => Object.values(material).forEach((value) => {
      if (value?.isTexture) textures.add(value);
    }));
  });

  textures.forEach((texture) => {
    const image = texture.image;
    if (!image?.width || !image?.height || Math.max(image.width, image.height) <= maxSize) return;
    const scale = maxSize / Math.max(image.width, image.height);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    texture.image = canvas;
    texture.generateMipmaps = true;
    texture.anisotropy = 1;
    texture.needsUpdate = true;
  });
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

const PorscheCanvas = ({ onReady }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowEndDevice = (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || window.innerWidth <= 768;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, lowEndDevice ? 1.25 : 1.5);

    // ── 1. Renderer, Camera, Scene Setup ──────────────────────────────────
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !lowEndDevice,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL init failed:', e);
      setWebglSupported(false);
      return;
    }

    renderer.setPixelRatio(pixelRatio);
    const initialRect = containerRef.current.getBoundingClientRect();
    renderer.setSize(initialRect.width || window.innerWidth, initialRect.height || window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;

    const scene = new THREE.Scene();
    window.__scene = scene;
    window.__THREE = THREE;
    // Set 100% opaque seamless studio background and linear fog
    const STUDIO_BG = 0x0e1012;
    scene.background = new THREE.Color(STUDIO_BG);
    scene.fog = new THREE.Fog(STUDIO_BG, 7.5, 20.0);

    // Cinematic Automotive Studio Lens (26° FOV for authentic telephoto compression)
    // Camera is placed at eye/hood height (0.95m) for a powerful, full-sized automotive stance
    const camera = new THREE.PerspectiveCamera(
      26,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    const mobileViewport = window.innerWidth <= 768;
    camera.position.set(0, mobileViewport ? 2.35 : 0.95, 11.2);
    camera.lookAt(0, mobileViewport ? 2.05 : 0.65, 0);
    window.__camera = camera;

    // ── 2. Procedural Automotive Studio Environment (Continuous IBL) ──────
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const studioScene = new THREE.Scene();
    studioScene.background = new THREE.Color(STUDIO_BG);

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

    // ── 4. Professional Studio Lighting Rig ───────────────────────────────
    // 1. Soft forest green ambient fill - guarantees curves & body never drop to pitch black
    const ambientLight = new THREE.AmbientLight(0x192e22, 1.85);
    scene.add(ambientLight);

    // 2. Large soft key light (Front-Left Studio Softbox)
    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.7);
    keyLight.position.set(-5.5, 5.0, 6.2);
    scene.add(keyLight);

    // 3. Secondary fill light (Front-Right)
    const fillLight = new THREE.DirectionalLight(0xe4eff7, 1.75);
    fillLight.position.set(5.5, 4.2, 5.2);
    scene.add(fillLight);

    // 4. Overhead strip lighting (runs along car roofline)
    const overheadLight = new THREE.DirectionalLight(0xffffff, 1.85);
    overheadLight.position.set(0, 8.5, 0);
    scene.add(overheadLight);

    // 5. Dual subtle rim lights for flared rear turbo arches & whale tail
    const rearRimLeft = new THREE.DirectionalLight(0xcdeee0, 1.45);
    rearRimLeft.position.set(-4.5, 3.2, -5.5);
    scene.add(rearRimLeft);

    const rearRimRight = new THREE.DirectionalLight(0xcdeee0, 1.45);
    rearRimRight.position.set(4.5, 3.2, -5.5);
    scene.add(rearRimRight);

    // 6. Subtle upward underbody fill to soften chassis shadows
    const underbodyFill = new THREE.DirectionalLight(0x16241b, 0.65);
    underbodyFill.position.set(0, -2, 0);
    scene.add(underbodyFill);

    // ── 5. Vehicle Root & Ground Anchor ───────────────────────────────────
    const carRoot = new THREE.Group();
    carRoot.position.set(1.65, 0, 0.1);
    scene.add(carRoot);

    // Soft radial showroom floor reflection pool (strictly under car, ZERO horizon line)
    const groundGeo = new THREE.PlaneGeometry(8, 8);
    const groundAlphaMap = createGroundAlphaTexture();
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c0e,
      roughness: 0.92,
      metalness: 0.04,
      envMapIntensity: 0.08,
      alphaMap: groundAlphaMap,
      transparent: true,
      opacity: 0.4,
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

    // Taillight point lights
    const tailLight1 = new THREE.PointLight(0xaa1818, 0.4, 8, 1.8);
    const tailLight2 = new THREE.PointLight(0xaa1818, 0.4, 8, 1.8);
    carRoot.add(tailLight1);
    carRoot.add(tailLight2);

    const taillightMeshes = [];
    let paintMeshes = [];

    const loader = new GLTFLoader();
    let loadedModel = null;
    let loadCancelled = false;
    let loadTimer;
    let idleHandle;
    const loadModel = () => {
      if (loadCancelled) return;
      loader.load(
      '/models/porsche_911.glb?v=3',
      (gltf) => {
        if (loadCancelled) {
          disposeModel(gltf.scene);
          return;
        }
        const porsche = gltf.scene;
        loadedModel = porsche;

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

          // 2. REAR TAILLIGHTS: Strictly Circle006, Circle035, Circle036 (Porsche Guards Red #991818)
          const isRearTaillight =
            cleanName.includes('circle006') ||
            cleanName.includes('circle035') ||
            (cleanName.includes('circle036') && !matName.includes('sticker'));

          if (isRearTaillight) {
            child.material = child.material.clone();
            child.material.color = new THREE.Color(0x991818);
            child.material.emissive = new THREE.Color(0xaa1515);
            child.material.emissiveIntensity = 0.55;
            child.material.roughness = 0.18;
            child.material.metalness = 0.25;
            child.material.clearcoat = 0.95;
            child.material.clearcoatRoughness = 0.05;
            child.material.envMapIntensity = 2.2;
            taillightMeshes.push(child);
            return;
          }

          // 3. FRONT TURN SIGNALS (Bumper amber lenses: Cube003)
          const isTurnSignal = cleanName.includes('cube003');
          if (isTurnSignal) {
            child.material = child.material.clone();
            child.material.color = new THREE.Color(0xee8822); // Vintage amber signal lens
            child.material.emissive = new THREE.Color(0xee8822);
            child.material.emissiveIntensity = 0.35;
            child.material.roughness = 0.15;
            child.material.clearcoat = 0.85;
            return;
          }

          // 4. FRONT HEADLIGHTS & REFLECTORS (Bosch H4 fluted lens + halogen bulb glow)
          const isFrontHeadlight =
            cleanName.includes('circle017') ||
            cleanName.includes('circle011') ||
            cleanName.includes('circle008') ||
            cleanName.includes('circle007') ||
            cleanName.includes('circle025') ||
            cleanName.includes('plane009') ||
            (matName.includes('light') && !isRearTaillight);

          if (isFrontHeadlight) {
            child.material = child.material.clone();
            // Main fluted Bosch H4 glass lens (Circle017 & Circle011)
            if (cleanName.includes('circle017') || cleanName.includes('circle011')) {
              child.material.color = new THREE.Color(0xffffff);
              child.material.transparent = true;
              child.material.opacity = 0.52;
              child.material.roughness = 0.04;
              child.material.metalness = 0.08;
              child.material.clearcoat = 1.0;
              child.material.clearcoatRoughness = 0.02;
              child.material.emissive = new THREE.Color(0x000000);
              child.material.envMapIntensity = 3.2;
            } else if (cleanName.includes('circle008')) {
              // Chrome dish parabolic reflector behind the lens
              child.material.color = new THREE.Color(0xffffff);
              child.material.metalness = 0.98;
              child.material.roughness = 0.03;
              child.material.emissive = new THREE.Color(0xffeedd);
              child.material.emissiveIntensity = 0.45;
              child.material.envMapIntensity = 3.5;
            } else {
              // Auxiliary fog light / reflector
              child.material.color = new THREE.Color(0xffffff);
              child.material.roughness = 0.12;
              child.material.metalness = 0.85;
              child.material.emissive = new THREE.Color(0xffeedd);
              child.material.emissiveIntensity = 0.25;
              child.material.envMapIntensity = 2.5;
            }
            return;
          }

          // 5. Rich British Racing Green / Oak Green Metallic Body Paint
          if (matName.includes('paint')) {
            const origNorm = child.material.normalMap;
            const origRough = child.material.roughnessMap;

            // Authentic British Racing Green / Oak Green Metallic automotive lacquer
            child.material = new THREE.MeshPhysicalMaterial({
              color: new THREE.Color('#14452f'), // Rich, saturated British Racing Green
              metalness: 0.38,                  // Metallic flake feel without crushing green into black
              roughness: 0.22,                  // Smooth automotive surface
              clearcoat: 1.0,                   // Wet-look clear lacquer layer
              clearcoatRoughness: 0.04,         // Mirror clearcoat shine
              reflectivity: 0.88,
              envMapIntensity: 2.2,
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

        if (lowEndDevice) downsampleTextures(porsche, 1024);
        carRoot.add(porsche);
        setIsLoaded(true);
        onReadyRef.current?.();
        if (prefersReducedMotion) renderer.render(scene, camera);
      },
      undefined,
      (err) => {
        if (loadCancelled) return;
        console.warn('Porsche model could not be loaded; keeping the lightweight hero fallback.', err);
        setLoadFailed(true);
      }
      );
    };
    const startWhenIdle = () => {
      if (loadCancelled) return;
      if ('requestIdleCallback' in window) idleHandle = window.requestIdleCallback(loadModel, { timeout: 1800 });
      else loadTimer = window.setTimeout(loadModel, 250);
    };
    // Let text, navigation, and the poster surface paint before requesting the large model.
    loadTimer = window.setTimeout(startWhenIdle, 500);

    // ── 6. Mouse Parallax (Refined & Subtle) ───────────────────────────────
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.25;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.15;
    };

    if (!prefersReducedMotion && !lowEndDevice) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // ── 7. Scroll Choreography (ALL STAGES GROUNDED AT Y = 0) ──────────────
    const getChoreographyTarget = () => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth < 1024;

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

      if (isMobile) target.scale *= window.innerWidth < 360 ? 0.76 : 0.9;

      return target;
    };

    let choreographyTarget = getChoreographyTarget();
    const updateChoreographyTarget = () => {
      choreographyTarget = getChoreographyTarget();
    };
    window.addEventListener('scroll', updateChoreographyTarget, { passive: true });

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
    let animationTimerId;
    let stageVisible = true;
    let motionStart = null;
    const frameInterval = lowEndDevice ? 1000 / 24 : 1000 / 30;

    const scheduleAnimation = () => {
      if (document.hidden || prefersReducedMotion || !stageVisible || animationTimerId !== undefined || animationFrameId !== undefined) return;
      animationTimerId = window.setTimeout(() => {
        animationTimerId = undefined;
        animationFrameId = requestAnimationFrame(animate);
      }, frameInterval);
    };

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
      scheduleAnimation();
    };

    if (prefersReducedMotion) renderer.render(scene, camera);
    else scheduleAnimation();

    // ── 9. Window Resize Handler ──────────────────────────────────────────
    const handleResize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || window.innerWidth;
      const height = rect?.height || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(pixelRatio);
      updateChoreographyTarget();
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    let mobileStage = window.innerWidth <= 768;
    const pauseAnimation = () => {
      cancelAnimationFrame(animationFrameId);
      window.clearTimeout(animationTimerId);
      animationFrameId = undefined;
      animationTimerId = undefined;
    };
    const stageObserver = new IntersectionObserver(([entry]) => {
      if (mobileStage) return;
      stageVisible = entry.isIntersecting;
      if (!stageVisible) {
        pauseAnimation();
      } else scheduleAnimation();
    });
    const heroObserver = new IntersectionObserver(([entry]) => {
      if (!mobileStage) return;
      stageVisible = entry.isIntersecting;
      containerRef.current?.classList.toggle('is-offstage', !stageVisible);
      if (!stageVisible) pauseAnimation();
      else scheduleAnimation();
    });
    const homeSection = document.getElementById('home');
    if (mobileStage && homeSection) {
      containerRef.current.classList.add('is-offstage');
      heroObserver.observe(homeSection);
    } else {
      stageObserver.observe(containerRef.current);
    }
    const updateStageObserver = () => {
      const nextIsMobile = window.innerWidth <= 768;
      if (nextIsMobile === mobileStage) return;
      mobileStage = nextIsMobile;
      if (mobileStage && homeSection) {
        stageObserver.unobserve(containerRef.current);
        containerRef.current.classList.add('is-offstage');
        stageVisible = false;
        heroObserver.observe(homeSection);
      } else {
        heroObserver.unobserve(homeSection);
        containerRef.current.classList.remove('is-offstage');
        stageVisible = true;
        stageObserver.observe(containerRef.current);
        scheduleAnimation();
      }
    };
    window.addEventListener('resize', updateStageObserver);
    const handleVisibility = () => {
      if (document.hidden) {
        pauseAnimation();
      } else {
        if (prefersReducedMotion) renderer.render(scene, camera);
        else scheduleAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.clearTimeout(animationTimerId);
      loadCancelled = true;
      window.clearTimeout(loadTimer);
      if (idleHandle !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', updateStageObserver);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', updateChoreographyTarget);
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver.disconnect();
      stageObserver.disconnect();
      heroObserver.disconnect();
      renderer.renderLists.dispose();
      if (loadedModel) disposeModel(loadedModel);
      renderer.dispose();
      pmremGenerator.dispose();
      studioEnvMap.dispose();
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
      className={`porsche-canvas-container ${isLoaded || loadFailed ? 'is-ready' : 'is-loading'}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="porsche-gl-canvas" />

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
