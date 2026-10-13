import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './CodeLuxuryRoom.css';

/**
 * Procedural Canvas Texture Generators (100% Code, Zero External Assets)
 */

// 1. European White Oak Hardwood Flooring
function createWoodFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base warm honey oak
  ctx.fillStyle = '#ad967d';
  ctx.fillRect(0, 0, 1024, 1024);

  const numPlanksY = 16;
  const plankH = 1024 / numPlanksY;

  for (let i = 0; i < numPlanksY; i++) {
    const y = i * plankH;
    const toneOffset = (Math.sin(i * 3.7) + Math.cos(i * 2.1)) * 14;
    const r = Math.min(255, Math.max(0, 175 + toneOffset));
    const g = Math.min(255, Math.max(0, 150 + toneOffset));
    const b = Math.min(255, Math.max(0, 122 + toneOffset));

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, y, 1024, plankH);

    // Subtle grain lines
    for (let gIdx = 0; gIdx < 9; gIdx++) {
      ctx.strokeStyle = `rgba(${r - 28},${g - 28},${b - 24},0.2)`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, y + (gIdx * plankH) / 9 + Math.random() * 3);
      ctx.bezierCurveTo(
        340, y + (gIdx * plankH) / 9 + Math.random() * 8 - 4,
        680, y + (gIdx * plankH) / 9 + Math.random() * 8 - 4,
        1024, y + (gIdx * plankH) / 9 + Math.random() * 4
      );
      ctx.stroke();
    }

    // Plank seams
    ctx.strokeStyle = 'rgba(40, 28, 18, 0.45)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();

    // Staggered end joints
    const numJoints = 3;
    for (let j = 1; j <= numJoints; j++) {
      const stagger = ((i % 4) * 0.25) * 1024;
      const jx = (stagger + (j * 1024) / numJoints) % 1024;
      ctx.beginPath();
      ctx.moveTo(jx, y);
      ctx.lineTo(jx, y + plankH);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// 2. Italian Calacatta Gold Marble Slab
function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8f6f2';
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft smoky mineral clouds
  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1024;
    const rad = 90 + Math.random() * 220;
    const grad = ctx.createRadialGradient(rx, ry, 10, rx, ry, rad);
    grad.addColorStop(0, 'rgba(215, 208, 198, 0.35)');
    grad.addColorStop(1, 'rgba(248, 246, 242, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Elegant flowing mineral veins (Grey & Warm Gold)
  ctx.lineWidth = 3.5;
  for (let v = 0; v < 7; v++) {
    ctx.strokeStyle = v % 2 === 0 ? 'rgba(115, 110, 102, 0.35)' : 'rgba(182, 148, 96, 0.38)';
    ctx.beginPath();
    let cx = 150 + Math.random() * 700;
    let cy = 0;
    ctx.moveTo(cx, cy);
    while (cy < 1024) {
      cx += Math.sin(cy * 0.018) * 55 + (Math.random() - 0.5) * 35;
      cy += 28 + Math.random() * 38;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

// 3. Fluted Dark American Walnut Wood Panels
function createFlutedWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const slats = 16;
  const slatW = 512 / slats;

  for (let i = 0; i < slats; i++) {
    const x = i * slatW;
    const grad = ctx.createLinearGradient(x, 0, x + slatW, 0);
    grad.addColorStop(0, '#1a1109');
    grad.addColorStop(0.22, '#382518');
    grad.addColorStop(0.5, '#4b3320');
    grad.addColorStop(0.82, '#382518');
    grad.addColorStop(1, '#120b06');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, slatW, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

// 4. Textured Wool Area Rug
function createRugTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#eee8dc';
  ctx.fillRect(0, 0, 512, 512);

  // Crosshatch weave
  ctx.strokeStyle = 'rgba(80, 70, 60, 0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 5) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Modern geometric border
  ctx.strokeStyle = 'rgba(70, 58, 48, 0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, 440, 440);
  ctx.beginPath();
  ctx.moveTo(36, 256);
  ctx.lineTo(476, 256);
  ctx.moveTo(256, 36);
  ctx.lineTo(256, 476);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

// 5. Dynamic City Skyline Panorama Canvas (Morning, Night, Twilight)
function updateSkylineCanvas(canvas, sceneType) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isMorning = sceneType === 'morning';
  const isNight = sceneType === 'night';

  if (isMorning) {
    // 1. Crisp Golden Sunrise Morning Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    skyGrad.addColorStop(0, '#1c4974');
    skyGrad.addColorStop(0.3, '#357ebd');
    skyGrad.addColorStop(0.6, '#72b6e4');
    skyGrad.addColorStop(0.8, '#f7d18a');
    skyGrad.addColorStop(0.92, '#fba56b');
    skyGrad.addColorStop(1, '#ffc785');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Radiant Morning Sun Disc
    const sunGrad = ctx.createRadialGradient(1420, 680, 20, 1420, 680, 280);
    sunGrad.addColorStop(0, 'rgba(255, 255, 240, 1.0)');
    sunGrad.addColorStop(0.25, 'rgba(255, 235, 170, 0.85)');
    sunGrad.addColorStop(0.6, 'rgba(255, 195, 120, 0.35)');
    sunGrad.addColorStop(1, 'rgba(255, 180, 90, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(1420, 680, 280, 0, Math.PI * 2);
    ctx.fill();

    // Morning Mist Horizon Glow
    const mistGrad = ctx.createLinearGradient(0, 650, 0, 850);
    mistGrad.addColorStop(0, 'rgba(255, 220, 160, 0)');
    mistGrad.addColorStop(0.6, 'rgba(255, 235, 190, 0.45)');
    mistGrad.addColorStop(1, 'rgba(255, 245, 215, 0.7)');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, 650, 2048, 200);

    // Mountain silhouettes in morning haze
    ctx.fillStyle = '#4c5770';
    ctx.beginPath();
    ctx.moveTo(0, 770);
    for (let m = 0; m <= 2048; m += 90) {
      const my = 750 + Math.sin(m * 0.005) * 35 + Math.cos(m * 0.012) * 22;
      ctx.lineTo(m, my);
    }
    ctx.lineTo(2048, 1024);
    ctx.lineTo(0, 1024);
    ctx.fill();

    // Morning City Skyline with Daylight Reflections
    const numBuildings = 75;
    for (let b = 0; b < numBuildings; b++) {
      const bx = b * 29 + (b % 4) * 2;
      const bw = 18 + (b % 5) * 4;
      const bh = 140 + ((b * 37) % 310);
      const by = 840 - bh;

      // Modern glass & stone facade colors in morning light
      ctx.fillStyle = b % 2 === 0 ? '#333f54' : '#2b3648';
      ctx.fillRect(bx, by, bw, bh);

      // Morning architectural edge sun highlight
      ctx.fillStyle = 'rgba(255, 235, 190, 0.55)';
      ctx.fillRect(bx, by, 2.5, bh);

      // Morning window reflections
      ctx.fillStyle = 'rgba(255, 248, 220, 0.85)';
      const floors = Math.floor(bh / 9);
      const cols = Math.floor(bw / 6.5);
      for (let f = 1; f < floors; f++) {
        for (let c = 1; c < cols; c++) {
          if ((f + c) % 3 !== 0) {
            ctx.fillRect(bx + c * 6, by + f * 9, 3, 4.5);
          }
        }
      }
    }
  } else if (isNight) {
    // 2. Deep Midnight Nocturnal Starry Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    skyGrad.addColorStop(0, '#02040a');
    skyGrad.addColorStop(0.4, '#060a16');
    skyGrad.addColorStop(0.7, '#0c1328');
    skyGrad.addColorStop(0.9, '#121a36');
    skyGrad.addColorStop(1, '#182245');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Brilliant Twinkling Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    for (let s = 0; s < 240; s++) {
      const sx = ((s * 137) + 50) % 2048;
      const sy = ((s * 89) + 20) % 520;
      const sr = (s % 3 === 0) ? 1.8 : 1.0;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();

      // Occasional diffraction spike star
      if (s % 18 === 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(sx - 5, sy);
        ctx.lineTo(sx + 5, sy);
        ctx.moveTo(sx, sy - 5);
        ctx.lineTo(sx, sy + 5);
        ctx.stroke();
      }
    }

    // Distant mountain silhouette in moonlight
    ctx.fillStyle = '#080c16';
    ctx.beginPath();
    ctx.moveTo(0, 770);
    for (let m = 0; m <= 2048; m += 90) {
      const my = 750 + Math.sin(m * 0.005) * 35 + Math.cos(m * 0.012) * 22;
      ctx.lineTo(m, my);
    }
    ctx.lineTo(2048, 1024);
    ctx.lineTo(0, 1024);
    ctx.fill();

    // Night Skyscraper Skyline with Sparkling City Windows
    const numBuildings = 75;
    for (let b = 0; b < numBuildings; b++) {
      const bx = b * 29 + (b % 4) * 2;
      const bw = 18 + (b % 5) * 4;
      const bh = 140 + ((b * 37) % 310);
      const by = 840 - bh;

      // Dark nocturnal building silhouette
      ctx.fillStyle = `rgb(${10 + (b % 3) * 2}, ${12 + (b % 4) * 2}, ${20 + (b % 5) * 3})`;
      ctx.fillRect(bx, by, bw, bh);

      // Rooftop Aviation Obstruction Beacon (Red or Cyan flashing dot)
      if (b % 4 === 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(bx + bw / 2, by - 3, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparkling warm gold & cyan office windows
      const floors = Math.floor(bh / 8.5);
      const cols = Math.floor(bw / 6.5);
      for (let f = 1; f < floors; f++) {
        for (let c = 1; c < cols; c++) {
          if ((f * 7 + c * 13 + b) % 5 > 1) {
            ctx.fillStyle = ((f + c + b) % 3 === 0)
              ? 'rgba(255, 220, 130, 0.95)' // Warm incandescent window
              : 'rgba(140, 215, 255, 0.85)'; // Modern cyan architectural glow
            ctx.fillRect(bx + c * 6, by + f * 8.5, 3.2, 4.2);
          }
        }
      }
    }
  } else {
    // 3. Dusk / Sunset / Living-On Showcase (Warm Golden Hour & Evening Twilight)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    skyGrad.addColorStop(0, '#0a0e22');
    skyGrad.addColorStop(0.35, '#1e1b38');
    skyGrad.addColorStop(0.65, '#5c2c4d');
    skyGrad.addColorStop(0.82, '#b84a3e');
    skyGrad.addColorStop(0.95, '#e5824c');
    skyGrad.addColorStop(1, '#ffaa62');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Twinkling dusk stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let s = 0; s < 180; s++) {
      const sx = ((s * 137) + 50) % 2048;
      const sy = ((s * 89) + 20) % 400;
      const sr = (s % 4 === 0) ? 1.5 : 0.9;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mountain silhouette
    ctx.fillStyle = '#171424';
    ctx.beginPath();
    ctx.moveTo(0, 760);
    for (let m = 0; m <= 2048; m += 90) {
      const my = 740 + Math.sin(m * 0.005) * 35 + Math.cos(m * 0.012) * 20;
      ctx.lineTo(m, my);
    }
    ctx.lineTo(2048, 1024);
    ctx.lineTo(0, 1024);
    ctx.fill();

    // Skyscraper skyline
    const numBuildings = 75;
    for (let b = 0; b < numBuildings; b++) {
      const bx = b * 29 + (b % 4) * 2;
      const bw = 18 + (b % 5) * 4;
      const bh = 150 + ((b * 37) % 310);
      const by = 840 - bh;

      ctx.fillStyle = `rgb(${16 + (b % 5) * 3}, ${18 + (b % 4) * 2}, ${30 + (b % 6) * 3})`;
      ctx.fillRect(bx, by, bw, bh);

      const floors = Math.floor(bh / 8.5);
      const cols = Math.floor(bw / 6.5);
      for (let f = 1; f < floors; f++) {
        for (let c = 1; c < cols; c++) {
          if ((f * 7 + c * 11 + b) % 4 > 1) {
            ctx.fillStyle = (b % 3 === 0) ? 'rgba(255, 225, 140, 0.9)' : 'rgba(155, 225, 255, 0.75)';
            ctx.fillRect(bx + c * 6, by + f * 8.5, 3.2, 4.2);
          }
        }
      }
    }
  }
}

// 6. Gallery Minimalist Textured Artwork
function createArtTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#e2ddd3';
  ctx.fillRect(0, 0, 512, 512);

  // Plaster layered strokes
  ctx.fillStyle = '#b8aea4';
  ctx.fillRect(70, 50, 250, 380);

  ctx.fillStyle = '#48413b';
  ctx.fillRect(150, 110, 270, 290);

  ctx.fillStyle = '#cca163';
  ctx.fillRect(200, 190, 150, 230);

  ctx.fillStyle = '#f5f0e9';
  ctx.fillRect(120, 170, 190, 170);

  return new THREE.CanvasTexture(canvas);
}

// 7. AC Digital Display Dynamic Canvas Texture
function updateACCanvas(canvas, temp, mode, isOn) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0b1329';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!isOn) {
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('--', canvas.width / 2, canvas.height / 2);
    return;
  }

  // Glowing Cyan LED Matrix
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#0284c7';
  ctx.shadowBlur = 14;
  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const modeIcon = mode === 'cool' ? '❄' : mode === 'dry' ? '💧' : '💨';
  ctx.fillText(`${temp}°C ${modeIcon}`, canvas.width / 2, canvas.height / 2);
}

// 8. Circular AC Airflow Wave Texture (Luminous Concentric Ripple with Feathered Tips)
function createAirflowWaveTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const imgData = ctx.createImageData(512, 64);
  for (let y = 0; y < 64; y++) {
    const ny = (y / 63) * 2 - 1; // -1 to +1 across the arc thickness
    const distY = Math.abs(ny);
    // Crisp glowing center core line + soft ambient aura
    const coreLine = Math.exp(-Math.pow(distY * 4.5, 2));
    const softHalo = Math.max(0, 1 - distY);
    const radialProfile = coreLine * 0.82 + softHalo * 0.18;

    for (let x = 0; x < 512; x++) {
      const nx = (x / 511) * 2 - 1; // -1 to +1 along arc length
      // Feathered tips: smooth falloff at ends of the curved arc
      const tipFade = Math.pow(Math.max(0, Math.cos(nx * Math.PI * 0.5)), 1.35);

      const alpha = Math.min(255, Math.floor(radialProfile * tipFade * 255));
      const idx = (y * 512 + x) * 4;
      imgData.data[idx] = 200;     // R
      imgData.data[idx + 1] = 240; // G
      imgData.data[idx + 2] = 255; // B (luminous ice-cyan core)
      imgData.data[idx + 3] = alpha;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

// 9. Curved Airflow Wave Arc Geometry (Polar Mesh Strip)
function createAirflowArcGeometry(innerR = 0.96, outerR = 1.04, angleSpan = Math.PI * 0.74, segments = 64) {
  const geom = new THREE.BufferGeometry();
  const positions = [];
  const uvs = [];
  const indices = [];

  const halfAngle = angleSpan / 2;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments; // 0 to 1 along the arc
    const angle = -halfAngle + t * angleSpan;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    // Inner edge vertex (X = lateral spread, Z = forward direction)
    positions.push(innerR * sinA, 0, innerR * cosA);
    uvs.push(t, 0);

    // Outer edge vertex
    positions.push(outerR * sinA, 0, outerR * cosA);
    uvs.push(t, 1);
  }

  for (let i = 0; i < segments; i++) {
    const v0 = i * 2;
    const v1 = i * 2 + 1;
    const v2 = (i + 1) * 2;
    const v3 = (i + 1) * 2 + 1;
    indices.push(v0, v1, v2);
    indices.push(v2, v1, v3);
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  return geom;
}

/**
 * CodeLuxuryRoom — 3D Smart Luxury Architectural Living Room (Three.js WebGL)
 * 100% Procedural 3D Environment with Zero External Images.
 * All smart-home elements are clearly visible and unoccluded in the primary view:
 * - Ceiling Fan: Centered in left living space, spinning with physics inertia & cyan hub LED
 * - Wall AC: Mounted on left wall angled into room, glowing display, opening louver, airflow ribbons
 * - Panoramic Window & Motorized Curtains: Rear-left wall directly in front of camera
 * - Luxury Marble Feature Wall: Calacatta marble slab & art credenza (NO FIREPLACE)
 * - Crystal & Brass Chandelier: Suspended over coffee table, 2.7m away from fan (ZERO OVERLAP)
 * - 5 Recessed Ceiling Spotlights: With visible volumetric architectural light beams
 * - Perimeter Cove Lighting: Seamless amber/gold halo around ceiling tray
 */
export default function CodeLuxuryRoom({
  circuits = {},
  dimmers = {
    'main-light': 100,
    'ceiling': 100,
    'chandelier': 100,
    'spotlights': 100,
    'cove': 100,
  },
  activeScene = 'living-off',
  fanState = { on: true, speed: 3 },
  acState = { on: true, temp: 22, mode: 'cool' },
  curtainState = { position: 100, isOpen: true },
  onToggleDevice,
  onToggleFixture,
}) {
  const mountRef = useRef(null);

  // Three.js Core Refs
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  // Dynamic state refs for 60 FPS animation loop (no closure staleness)
  const fanStateRef = useRef(fanState);
  const acStateRef = useRef(acState);
  const curtainStateRef = useRef(curtainState);

  useEffect(() => {
    fanStateRef.current = fanState;
    acStateRef.current = acState;
    curtainStateRef.current = curtainState;
  }, [fanState, acState, curtainState]);

  // Mesh & Physics Refs
  const fanRotorRef = useRef(null);
  const fanVelocityRef = useRef(0);
  const fanAngleRef = useRef(0);
  const fanLedMeshRef = useRef(null);

  const acLouverRef = useRef(null);
  const acAirflowGroupRef = useRef(null);
  const acCanvasRef = useRef(null);
  const acTextureRef = useRef(null);

  const curtainLeftRef = useRef(null);
  const curtainRightRef = useRef(null);

  // Skyline Dynamic Canvas Refs
  const skylineCanvasRef = useRef(null);
  const skylineTextureRef = useRef(null);

  // Lighting Refs
  const chandelierLightRef = useRef(null);
  const chandelierMeshRef = useRef(null);
  const coveLightsRef = useRef([]);
  const coveMeshRef = useRef(null);
  const spotLightsRef = useRef([]);
  const spotLensesRef = useRef([]);
  const spotHalosRef = useRef([]);
  const mainAmbientRef = useRef(null);
  const ceilingWashRef = useRef(null);
  const relaxLightRef = useRef(null);
  const twilightDirLightRef = useRef(null);

  // Camera targets for smooth cinematic gliding
  const targetCamPosRef = useRef(new THREE.Vector3(0.0, 1.95, 5.4));
  const targetCamLookRef = useRef(new THREE.Vector3(-0.15, 1.35, -1.0));

  // HUD & Tooltip state
  const [hoveredObject, setHoveredObject] = useState(null);
  const [activeCameraView, setActiveCameraView] = useState('overview');

  // Lighting Brightness Ratios (0.0 to 1.0)
  const isMorning = activeScene === 'morning' || Boolean(circuits['morning']);
  const isNight = activeScene === 'night' || Boolean(circuits['night']);
  const isMasterOn = activeScene === 'living-on' || Boolean(circuits['living-on']);
  const isStandby = activeScene === 'living-off' || (Boolean(circuits['living-off']) && !isMasterOn && !isMorning && !isNight);
  const isRelax = Boolean(circuits['relax']);

  // Spotlights circuit: strictly controlled by circuits['spotlights'] (INDEPENDENT circuit!)
  const spotIsOn = Boolean(circuits['spotlights']);
  const spotBright = spotIsOn ? (dimmers['spotlights'] || 100) / 100 : 0;

  // Living Room Fixtures: Chandelier, Cove, Main Light, Ceiling (controlled by Living On or individual toggles)
  const chandelierBright = circuits['chandelier'] || isMasterOn || isRelax || isNight || isMorning
    ? isNight ? 0.35 : isMorning ? 0.35 : (dimmers['chandelier'] || 100) / 100
    : 0;
  const coveBright = circuits['cove'] || isMasterOn || isRelax || isNight || isMorning
    ? isNight ? 0.45 : isMorning ? 0.35 : (dimmers['cove'] || 100) / 100
    : 0;
  const mainBright = circuits['main-light'] || isMasterOn ? (dimmers['main-light'] || 100) / 100 : 0;
  const ceilingBright = circuits['ceiling'] || isMasterOn || isMorning
    ? isMorning ? 0.4 : (dimmers['ceiling'] || 100) / 100
    : 0;

  // 1. INITIALIZE THREE.JS SCENE ON MOUNT
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0d18);

    // 54° FOV gives optimal wide framing of all elements simultaneously
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 100);
    camera.position.copy(targetCamPosRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // --- Orbit Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.copy(targetCamLookRef.current);
    controls.minDistance = 2.4;
    controls.maxDistance = 6.8;
    controls.minPolarAngle = Math.PI / 4.4;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Never dip beneath floor
    controls.minAzimuthAngle = -Math.PI / 3.0;
    controls.maxAzimuthAngle = Math.PI / 3.0;
    controlsRef.current = controls;

    // --- Shared Textures ---
    const floorTex = createWoodFloorTexture();
    const marbleTex = createMarbleTexture();
    const flutedWoodTex = createFlutedWoodTexture();
    const rugTex = createRugTexture();

    // Dynamic Procedural Canvas Skyline
    const skylineCanvas = document.createElement('canvas');
    skylineCanvas.width = 2048;
    skylineCanvas.height = 1024;
    skylineCanvasRef.current = skylineCanvas;
    updateSkylineCanvas(skylineCanvas, 'living-off');
    const skylineTex = new THREE.CanvasTexture(skylineCanvas);
    skylineTextureRef.current = skylineTex;

    const artTex = createArtTexture();

    // =========================================================================
    // A. ARCHITECTURAL ROOM ENVELOPE (8.6m Wide x 7.2m Deep x 3.5m High)
    // =========================================================================

    // 1. Floor (Hardwood White Oak)
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.35,
      metalness: 0.06,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 7.2), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // 2. Ceiling (Luxury Architectural Off-White Plaster for high contrast)
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0xf2eee8,
      roughness: 0.85,
    });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(8.6, 7.2), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 3.48, 0);
    scene.add(ceiling);

    // 3. Recessed Ceiling Tray & Perimeter Cove Channel
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0xeae5dc,
      roughness: 0.8,
    });
    const trayBox = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.16, 5.2), trayMat);
    trayBox.position.set(0, 3.40, -0.4);
    scene.add(trayBox);

    // Cove Light Channel Glow Mesh
    const coveGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffe2a4,
      transparent: true,
      opacity: 0.9,
    });
    const coveMesh = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.04, 5.0), coveGlowMat);
    coveMesh.position.set(0, 3.44, -0.4);
    scene.add(coveMesh);
    coveMeshRef.current = coveMesh;

    // 4. Back Wall - Split into Right Section and Header (Opening for Window)
    // Back Wall Right Section (behind marble wall: X = -0.6 to +4.3)
    const backWallMat = new THREE.MeshStandardMaterial({ color: 0x1f232d, roughness: 0.85 });
    const backWallRight = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 3.5), backWallMat);
    backWallRight.position.set(1.85, 1.75, -3.65);
    scene.add(backWallRight);

    // Back Wall Left Header (above window: Y = 3.15 to 3.5)
    const backWallHeader = new THREE.Mesh(new THREE.PlaneGeometry(3.7, 0.35), backWallMat);
    backWallHeader.position.set(-2.45, 3.325, -3.65);
    scene.add(backWallHeader);

    // 5. Left Wall Envelope (X = -4.3) with Fluted Walnut
    const leftWallMat = new THREE.MeshStandardMaterial({
      map: flutedWoodTex,
      roughness: 0.65,
      metalness: 0.05,
    });
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 3.5), leftWallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-4.3, 1.75, 0);
    scene.add(leftWall);

    // 6. Right Wall Envelope (X = +4.3)
    const rightWallMat = new THREE.MeshStandardMaterial({ color: 0x222631, roughness: 0.9 });
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 3.5), rightWallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(4.3, 1.75, 0);
    scene.add(rightWall);

    // =========================================================================
    // B. FLOOR-TO-CEILING PANORAMIC WINDOW & MOTORIZED CURTAINS (REAR-LEFT WALL)
    // Directly in front of camera, fully visible from floor to ceiling!
    // =========================================================================

    const windowGroup = new THREE.Group();
    windowGroup.position.set(-2.45, 1.55, -3.65);

    // Backdrop Skyline Plane (Directly visible outside window)
    const skylineMat = new THREE.MeshBasicMaterial({ map: skylineTex });
    const skylinePlane = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 3.4), skylineMat);
    skylinePlane.position.set(0, 0, -0.2);
    windowGroup.add(skylinePlane);

    // Terrace Balcony Decking outside Glass
    const balconyMat = new THREE.MeshStandardMaterial({ color: 0x3b4352, roughness: 0.7 });
    const balconyFloor = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.2), balconyMat);
    balconyFloor.rotation.x = -Math.PI / 2;
    balconyFloor.position.set(0, -1.55, -0.6);
    windowGroup.add(balconyFloor);

    // Balcony Glass Railing
    const balustradeMat = new THREE.MeshPhysicalMaterial({
      color: 0x94b4cf,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
    });
    const balustrade = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.0), balustradeMat);
    balustrade.position.set(0, -1.05, -1.1);
    windowGroup.add(balustrade);

    // Ultra-clear Architectural Window Glass
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd6e5f3,
      transparent: true,
      opacity: 0.15,
      roughness: 0.04,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
    });
    const windowGlass = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.1), glassMat);
    windowGlass.position.set(0, 0, 0);
    windowGroup.add(windowGlass);

    // Dark Bronze Thin Architectural Mullions
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x141822, metalness: 0.85, roughness: 0.25 });
    // Border frame
    const borderTop = new THREE.Mesh(new THREE.BoxGeometry(3.64, 0.05, 0.05), frameMat);
    borderTop.position.set(0, 1.55, 0.02);
    windowGroup.add(borderTop);

    const borderBottom = new THREE.Mesh(new THREE.BoxGeometry(3.64, 0.05, 0.05), frameMat);
    borderBottom.position.set(0, -1.55, 0.02);
    windowGroup.add(borderBottom);

    const borderLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.14, 0.05), frameMat);
    borderLeft.position.set(-1.8, 0, 0.02);
    windowGroup.add(borderLeft);

    const borderRight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.14, 0.05), frameMat);
    borderRight.position.set(1.8, 0, 0.02);
    windowGroup.add(borderRight);

    // 2 Vertical Interior Mullions
    const mull1 = new THREE.Mesh(new THREE.BoxGeometry(0.035, 3.1, 0.035), frameMat);
    mull1.position.set(-0.6, 0, 0.02);
    windowGroup.add(mull1);

    const mull2 = new THREE.Mesh(new THREE.BoxGeometry(0.035, 3.1, 0.035), frameMat);
    mull2.position.set(0.6, 0, 0.02);
    windowGroup.add(mull2);

    scene.add(windowGroup);

    // --- Motorized Ripple-Fold Drapery Panels ---
    const curtainGroup = new THREE.Group();
    curtainGroup.position.set(-2.45, 1.55, -3.52);
    curtainGroup.name = 'Motorized Curtains';

    // Recessed ceiling track
    const track = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.04, 0.06), frameMat);
    track.position.set(0, 1.58, 0);
    curtainGroup.add(track);

    // Luxury Ivory/Champagne Bouclé Fabric Material
    const drapeMat = new THREE.MeshStandardMaterial({
      color: 0xe2dcce,
      roughness: 0.88,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    const createRipplePanel = (width) => {
      const geom = new THREE.PlaneGeometry(width, 3.12, 32, 1);
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const wave = Math.sin(u * 20.0) * 0.05;
        pos.setZ(i, wave);
      }
      geom.computeVertexNormals();
      return geom;
    };

    // Left drape panel (anchored on left edge)
    const leftPanel = new THREE.Mesh(createRipplePanel(1.8), drapeMat);
    leftPanel.position.set(-1.45, 0, 0.02);
    leftPanel.scale.x = 0.28; // Retracted open
    curtainGroup.add(leftPanel);
    curtainLeftRef.current = leftPanel;

    // Right drape panel (anchored on right edge)
    const rightPanel = new THREE.Mesh(createRipplePanel(1.8), drapeMat);
    rightPanel.position.set(1.45, 0, 0.02);
    rightPanel.scale.x = 0.28; // Retracted open
    curtainGroup.add(rightPanel);
    curtainRightRef.current = rightPanel;

    scene.add(curtainGroup);

    // =========================================================================
    // C. LUXURY MARBLE FEATURE WALL & ART CREDENZA (REAR-RIGHT WALL)
    // NO FIREPLACE. Exquisite Calacatta Marble & Contemporary Gallery Art.
    // =========================================================================
    const featureWallGroup = new THREE.Group();
    featureWallGroup.position.set(1.65, 1.75, -3.6);

    // 1. Italian Calacatta Gold Marble Slab (2.7m x 2.85m)
    const marbleMat = new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.22,
      metalness: 0.08,
    });
    const marbleSlab = new THREE.Mesh(new THREE.BoxGeometry(2.7, 2.85, 0.08), marbleMat);
    marbleSlab.position.set(0, 0.1, 0);
    marbleSlab.receiveShadow = true;
    featureWallGroup.add(marbleSlab);

    // 2. Fluted Walnut Flank Panels
    const flankLeft = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.2, 0.06), leftWallMat);
    flankLeft.position.set(-1.7, 0, 0);
    featureWallGroup.add(flankLeft);

    const flankRight = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.2, 0.06), leftWallMat);
    flankRight.position.set(1.7, 0, 0);
    featureWallGroup.add(flankRight);

    // 3. Floating Walnut Art Credenza / Console
    const credenzaMat = new THREE.MeshStandardMaterial({ color: 0x22170f, roughness: 0.45, metalness: 0.1 });
    const credenza = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.42, 0.46), credenzaMat);
    credenza.position.set(0, -1.3, 0.24);
    credenza.castShadow = true;
    credenza.receiveShadow = true;
    featureWallGroup.add(credenza);

    // Brass Plinth Trim on Credenza
    const brassTrimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    const credenzaTrim = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.02, 0.47), brassTrimMat);
    credenzaTrim.position.set(0, -1.08, 0.24);
    featureWallGroup.add(credenzaTrim);

    // Minimalist Sculptural Decor on Credenza
    const vaseMat = new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.2 });
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 0.36, 24), vaseMat);
    vase.position.set(-0.85, -0.9, 0.24);
    vase.castShadow = true;
    featureWallGroup.add(vase);

    const torusSculpture = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 16, 36), brassTrimMat);
    torusSculpture.position.set(0.85, -0.92, 0.24);
    torusSculpture.rotation.y = 0.4;
    torusSculpture.castShadow = true;
    featureWallGroup.add(torusSculpture);

    // 4. Contemporary Gallery Artwork on Marble Slab
    const artMat = new THREE.MeshStandardMaterial({ map: artTex, roughness: 0.45 });
    const artCanvas = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.15, 0.04), artMat);
    artCanvas.position.set(0, 0.42, 0.06);
    featureWallGroup.add(artCanvas);

    // Thin Black Art Frame
    const artFrameMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.3 });
    const artFrame = new THREE.Mesh(new THREE.BoxGeometry(1.84, 1.19, 0.02), artFrameMat);
    artFrame.position.set(0, 0.42, 0.04);
    featureWallGroup.add(artFrame);

    scene.add(featureWallGroup);

    // =========================================================================
    // D. SMART WALL AC UNIT (PROMINENTLY MOUNTED ON LEFT WALL)
    // Height: Y = 2.45, X = -3.7, Z = -1.2. Angled into room for clear visibility!
    // =========================================================================
    const acGroup = new THREE.Group();
    acGroup.position.set(-3.7, 2.45, -1.2);
    // Angled at 54° so the front digital display directly faces the camera!
    acGroup.rotation.y = Math.PI / 3.3;
    acGroup.name = 'Wall AC';

    // AC Main Body / Chassis
    const acChassisMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.08 });
    const acBody = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.36, 0.24), acChassisMat);
    acBody.castShadow = true;
    acGroup.add(acBody);

    // Brushed Brass Trim Band
    const acTrim = new THREE.Mesh(new THREE.BoxGeometry(1.19, 0.015, 0.245), brassTrimMat);
    acTrim.position.set(0, -0.06, 0);
    acGroup.add(acTrim);

    // Front Digital LED Matrix Display Screen
    const acCanvas = document.createElement('canvas');
    acCanvas.width = 256;
    acCanvas.height = 64;
    acCanvasRef.current = acCanvas;
    updateACCanvas(acCanvas, acStateRef.current.temp, acStateRef.current.mode, acStateRef.current.on);

    const acTex = new THREE.CanvasTexture(acCanvas);
    acTextureRef.current = acTex;
    const acDisplayMat = new THREE.MeshBasicMaterial({ map: acTex });
    const acDisplayMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.095), acDisplayMat);
    acDisplayMesh.position.set(0, 0.04, 0.124);
    acGroup.add(acDisplayMesh);

    // Motorized Bottom Air Louver Vane
    const louverMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35 });
    const louver = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.018, 0.085), louverMat);
    louver.position.set(0, -0.15, 0.07);
    acGroup.add(louver);
    acLouverRef.current = louver;

    // =========================================================================
    // D.2. CIRCULAR CONCENTRIC AIRFLOW WAVE SYSTEM (SMART HOME AUTOMATION EFFECT)
    // Continuous train of smooth circular wavefront ripple arcs propagating into room
    // =========================================================================
    const airflowGroup = new THREE.Group();
    // Positioned right at bottom louver vane opening
    airflowGroup.position.set(0, -0.16, 0.08);
    // Tilted forward-downward at ~26° into room living zone
    airflowGroup.rotation.x = Math.PI / 6.8;

    const waveTex = createAirflowWaveTexture();
    const arcGeom = createAirflowArcGeometry(0.96, 1.04, Math.PI * 0.74, 64);
    const fineArcGeom = createAirflowArcGeometry(0.985, 1.015, Math.PI * 0.74, 64);

    // 6 primary concentric expanding circular wavefront arcs
    const arcCount = 6;
    for (let i = 0; i < arcCount; i++) {
      const arcMat = new THREE.MeshBasicMaterial({
        map: waveTex,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const arcMesh = new THREE.Mesh(arcGeom, arcMat);
      arcMesh.userData = {
        phaseOffset: i / arcCount, // Evenly staggered phases
        isFine: false,
      };
      arcMesh.scale.set(0.1, 1, 0.1);
      airflowGroup.add(arcMesh);
    }

    // 6 fine accent crest ripples interleaved between main waves (matching reference image)
    for (let i = 0; i < arcCount; i++) {
      const fineMat = new THREE.MeshBasicMaterial({
        map: waveTex,
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const fineMesh = new THREE.Mesh(fineArcGeom, fineMat);
      fineMesh.userData = {
        phaseOffset: (i + 0.5) / arcCount,
        isFine: true,
      };
      fineMesh.scale.set(0.1, 1, 0.1);
      airflowGroup.add(fineMesh);
    }

    airflowGroup.visible = Boolean(acStateRef.current.on);
    acGroup.add(airflowGroup);
    acAirflowGroupRef.current = airflowGroup;

    scene.add(acGroup);

    // =========================================================================
    // E. CEILING FAN (CENTER-LEFT CEILING, CLEAR FROM CHANDELIER)
    // Position: X = -1.4, Y = 3.32, Z = -0.5. 2.7 meters away from chandelier!
    // =========================================================================
    const fanGroup = new THREE.Group();
    fanGroup.position.set(-1.4, 3.32, -0.5);
    fanGroup.name = 'Ceiling Fan';

    const fanMat = new THREE.MeshStandardMaterial({ color: 0x161a22, metalness: 0.7, roughness: 0.3 });

    // Ceiling Mount Canopy (Brushed Brass)
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.08, 32), brassTrimMat);
    canopy.position.y = -0.04;
    fanGroup.add(canopy);

    // Downrod (Brushed Brass)
    const downrod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.36, 16), brassTrimMat);
    downrod.position.y = -0.22;
    fanGroup.add(downrod);

    // Motor Hub Housing
    const motorHub = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.13, 32), fanMat);
    motorHub.position.y = -0.44;
    fanGroup.add(motorHub);

    // Motor Hub Cyan LED Status Dot
    const hubLedMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const hubLed = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 16), hubLedMat);
    hubLed.position.set(0, -0.51, 0);
    fanGroup.add(hubLed);
    fanLedMeshRef.current = hubLed;

    // 4 Aerodynamic Sculpted Blades Assembly
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = -0.44;

    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x181513,
      roughness: 0.38,
      metalness: 0.4,
    });

    for (let b = 0; b < 4; b++) {
      const bladeArm = new THREE.Group();
      bladeArm.rotation.y = (b * Math.PI) / 2;

      const bladeGeom = new THREE.BoxGeometry(0.13, 0.015, 0.65);
      const bladeMesh = new THREE.Mesh(bladeGeom, bladeMat);
      bladeMesh.position.set(0, 0, 0.42);
      bladeMesh.rotation.x = 0.12; // Aerodynamic pitch angle

      bladeArm.add(bladeMesh);
      rotorGroup.add(bladeArm);
    }

    fanGroup.add(rotorGroup);
    fanRotorRef.current = rotorGroup;
    scene.add(fanGroup);

    // =========================================================================
    // F. LUXURY BRASS & CRYSTAL CHANDELIER (CENTER-RIGHT SEATING ZONE)
    // Position: X = +1.3, Y = 2.72, Z = -0.5. Offset from Fan, ZERO overlap!
    // =========================================================================
    const chandeGroup = new THREE.Group();
    chandeGroup.position.set(1.3, 2.72, -0.5);
    chandeGroup.name = 'Chandelier';

    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      roughness: 0.08,
      transmission: 0.82,
      ior: 1.6,
    });

    // Suspension Rod down from ceiling
    const chandeRod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.62, 16), brassTrimMat);
    chandeRod.position.y = 0.31;
    chandeGroup.add(chandeRod);

    // Tier 1 Outer Ring
    const ring1 = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.04, 32), brassTrimMat);
    chandeGroup.add(ring1);

    // Tier 1 Crystal Cylinders
    const crystalCount1 = 28;
    for (let c = 0; c < crystalCount1; c++) {
      const ca = (c * Math.PI * 2) / crystalCount1;
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.34, 12), crystalMat);
      cyl.position.set(Math.cos(ca) * 0.44, -0.16, Math.sin(ca) * 0.44);
      chandeGroup.add(cyl);
    }

    // Tier 2 Inner Lower Ring
    const ring2 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 24), brassTrimMat);
    ring2.position.y = -0.16;
    chandeGroup.add(ring2);

    const crystalCount2 = 18;
    for (let c = 0; c < crystalCount2; c++) {
      const ca = (c * Math.PI * 2) / crystalCount2;
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.28, 12), crystalMat);
      cyl.position.set(Math.cos(ca) * 0.28, -0.28, Math.sin(ca) * 0.28);
      chandeGroup.add(cyl);
    }

    // Warm Internal 2700K PointLight
    const chandeLight = new THREE.PointLight(0xffd175, 3.8, 8.5, 2.0);
    chandeLight.position.set(0, -0.18, 0);
    chandeLight.castShadow = true;
    chandeLight.shadow.bias = -0.001;
    chandeGroup.add(chandeLight);
    chandelierLightRef.current = chandeLight;
    chandelierMeshRef.current = crystalMat;

    scene.add(chandeGroup);

    // =========================================================================
    // G. 5 RECESSED CEILING SPOTLIGHT FIXTURES (CLEARLY VISIBLE AT LIGHT ORIGIN)
    // Mounted on underside of ceiling tray (Y = 3.32)
    // =========================================================================
    const spotCoords = [
      { x: -3.0, z: -1.2, targetY: 2.2, name: 'Spotlight 1 (AC Zone)' },
      { x: -2.1, z: -1.8, targetY: 1.5, name: 'Spotlight 2 (Window & Curtains)' },
      { x: -0.4, z: -0.8, targetY: 0.1, name: 'Spotlight 3 (Lounge Center)' },
      { x: 2.2, z: -0.8, targetY: 0.35, name: 'Spotlight 4 (Sofa Zone)' },
      { x: 1.65, z: -2.5, targetY: 1.8, name: 'Spotlight 5 (Art & Marble Wall)' },
    ];

    const spotFixtureMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.22,
    });
    const spotBaffleMat = new THREE.MeshStandardMaterial({
      color: 0x181a22,
      metalness: 0.8,
      roughness: 0.35,
    });

    const spotLightsList = [];
    const spotLensesList = [];
    const spotHalosList = [];

    spotCoords.forEach(({ x, z, targetY, name }) => {
      const fixtureGroup = new THREE.Group();
      fixtureGroup.position.set(x, 3.32, z);
      fixtureGroup.name = name;

      // 1. Brushed Brass Outer Trim Bezel Flange (mounted flush on ceiling underside)
      const bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.028, 32), spotFixtureMat);
      bezel.position.y = -0.014;
      fixtureGroup.add(bezel);

      // 2. Dark Stepped Antiglare Inner Baffle Canister
      const baffle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.022, 24), spotBaffleMat);
      baffle.position.y = -0.016;
      fixtureGroup.add(baffle);

      // 3. High-Intensity COB LED Center Lens (Facing downward)
      const lensMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: new THREE.Color(0xffeed1),
        emissiveIntensity: 0,
        roughness: 0.1,
      });
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.01, 24), lensMat);
      lens.position.y = -0.024;
      fixtureGroup.add(lens);
      spotLensesList.push(lensMat);

      // 4. Optical Golden Corona Halo Ring around lens
      const haloMat = new THREE.MeshStandardMaterial({
        color: 0xffeed1,
        emissive: new THREE.Color(0xffd68a),
        emissiveIntensity: 0,
        roughness: 0.2,
      });
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.01, 16, 32), haloMat);
      halo.rotation.x = Math.PI / 2;
      halo.position.y = -0.024;
      fixtureGroup.add(halo);
      spotHalosList.push(haloMat);

      scene.add(fixtureGroup);

      // 5. Directional Three.js SpotLight Originating EXACTLY at the Lens Surface (y = 3.285)
      const spotLight = new THREE.SpotLight(0xfff5e6, 3.8, 8.5, Math.PI / 5.5, 0.45, 1.6);
      spotLight.position.set(x, 3.285, z);
      spotLight.target.position.set(x, targetY, z);
      spotLight.castShadow = true;
      spotLight.shadow.bias = -0.001;
      scene.add(spotLight);
      scene.add(spotLight.target);
      spotLightsList.push(spotLight);
    });

    spotLightsRef.current = spotLightsList;
    spotLensesRef.current = spotLensesList;
    spotHalosRef.current = spotHalosList;

    // =========================================================================
    // H. AMBIENT & SCENE LIGHTING RIG
    // =========================================================================

    // 1. Main Daylight 4000K Neutral Ambient
    const mainAmbient = new THREE.HemisphereLight(0xf5f8ff, 0x1a2130, 0.65);
    scene.add(mainAmbient);
    mainAmbientRef.current = mainAmbient;

    // 2. Ceiling Indirect 3000K Wash
    const ceilingWash = new THREE.DirectionalLight(0xffeed1, 1.0);
    ceilingWash.position.set(0, 0.5, 0);
    ceilingWash.target.position.set(0, 3.48, 0);
    scene.add(ceilingWash);
    scene.add(ceilingWash.target);
    ceilingWashRef.current = ceilingWash;

    // 3. Relax 2200K Amber Sanctuary Ambience
    const relaxLight = new THREE.AmbientLight(0xff9e3b, 0);
    scene.add(relaxLight);
    relaxLightRef.current = relaxLight;

    // 4. Dusk Window Directional Light
    const twilightLight = new THREE.DirectionalLight(0x4a6fa5, 0.75);
    twilightLight.position.set(-3.5, 3.2, -4.5);
    twilightLight.target.position.set(0, 1.0, 0);
    twilightLight.castShadow = true;
    twilightLight.shadow.mapSize.width = 1024;
    twilightLight.shadow.mapSize.height = 1024;
    scene.add(twilightLight);
    scene.add(twilightLight.target);
    twilightDirLightRef.current = twilightLight;

    // 5. Perimeter Tray Cove PointLights (4 points)
    const coveLightList = [];
    const covePoints = [
      { x: -2.4, z: -0.4 },
      { x: 2.4, z: -0.4 },
      { x: 0.0, z: -2.6 },
      { x: 0.0, z: 1.8 },
    ];
    covePoints.forEach((pt) => {
      const cl = new THREE.PointLight(0xffe2a4, 1.6, 5.5, 2.0);
      cl.position.set(pt.x, 3.42, pt.z);
      scene.add(cl);
      coveLightList.push(cl);
    });
    coveLightsRef.current = coveLightList;

    // =========================================================================
    // I. LOW-PROFILE LUXURY FURNITURE (OPEN SIGHTLINES, ZERO OCCLUSION)
    // Low-slung seating positioned to keep floor, window, AC, wall 100% visible!
    // =========================================================================

    // 1. Large Wool Area Rug
    const rugMat = new THREE.MeshStandardMaterial({ map: rugTex, roughness: 0.85, metalness: 0.02 });
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 3.6), rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0.1, 0.008, -0.4);
    rug.receiveShadow = true;
    scene.add(rug);

    // 2. Low-Profile Italian Sectional Sofa (Right Side, Open Facing Room)
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(1.5, 0, 0.2);

    const sofaMat = new THREE.MeshStandardMaterial({ color: 0xd9d5cc, roughness: 0.82, metalness: 0.04 });
    const sofaPlinthMat = new THREE.MeshStandardMaterial({ color: 0x1f1915, metalness: 0.6, roughness: 0.4 });

    // Base Plinth (Low height: 0.08m)
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 1.2), sofaPlinthMat);
    plinth.position.set(0, 0.04, 0);
    sofaGroup.add(plinth);

    // Seat Cushion (Low height: 0.28m)
    const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.26, 1.15), sofaMat);
    seatCushion.position.set(0, 0.21, 0);
    seatCushion.castShadow = true;
    sofaGroup.add(seatCushion);

    // Low Backrest (Total height only 0.55m from floor, NEVER blocks anything behind!)
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.32, 0.22), sofaMat);
    backrest.position.set(0, 0.45, 0.46);
    backrest.castShadow = true;
    sofaGroup.add(backrest);

    // Throw Pillows
    const pillowMat1 = new THREE.MeshStandardMaterial({ color: 0x2b303c, roughness: 0.85 });
    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.12), pillowMat1);
    pillow1.position.set(0.65, 0.46, 0.38);
    pillow1.rotation.y = -0.2;
    sofaGroup.add(pillow1);

    const pillowMat2 = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.8 });
    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.12), pillowMat2);
    pillow2.position.set(-0.25, 0.44, 0.38);
    pillow2.rotation.y = 0.15;
    sofaGroup.add(pillow2);

    scene.add(sofaGroup);

    // 3. Low Sculptural Smoked Oak Coffee Table (Height: 0.32m)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0.5, 0, -0.6);

    const tableMat = new THREE.MeshStandardMaterial({ color: 0x1f1914, roughness: 0.45, metalness: 0.1 });
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.8), tableMat);
    tableTop.position.set(0, 0.31, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    const tableBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.26, 0.6), tableMat);
    tableBase.position.set(0, 0.14, 0);
    tableGroup.add(tableBase);

    // Architectural Coffee Table Books
    const bookMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const book = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 0.34), bookMat);
    book.position.set(-0.3, 0.36, 0.05);
    tableGroup.add(book);

    scene.add(tableGroup);

    // 4. Low Sculptural Lounge Armchair (Left Side, Angled Inward, Low Height: 0.62m)
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-2.2, 0, 0.6);
    chairGroup.rotation.y = -Math.PI / 5;

    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.2, 0.7), sofaMat);
    chairSeat.position.set(0, 0.25, 0);
    chairSeat.castShadow = true;
    chairGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.38, 0.14), sofaMat);
    chairBack.position.set(0, 0.48, -0.28);
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    // Chair Walnut Legs
    const legGeom = new THREE.CylinderGeometry(0.022, 0.018, 0.28, 12);
    const chairLegMat = new THREE.MeshStandardMaterial({ color: 0x3d2618, roughness: 0.4 });
    const l1 = new THREE.Mesh(legGeom, chairLegMat);
    l1.position.set(-0.3, 0.14, 0.28);
    chairGroup.add(l1);

    const l2 = new THREE.Mesh(legGeom, chairLegMat);
    l2.position.set(0.3, 0.14, 0.28);
    chairGroup.add(l2);

    const l3 = new THREE.Mesh(legGeom, chairLegMat);
    l3.position.set(-0.3, 0.14, -0.28);
    chairGroup.add(l3);

    const l4 = new THREE.Mesh(legGeom, chairLegMat);
    l4.position.set(0.3, 0.14, -0.28);
    chairGroup.add(l4);

    scene.add(chairGroup);

    // =========================================================================
    // J. 60 FPS ANIMATION LOOP (Physics, Fan Inertia, Louver, Curtains, Camera)
    // =========================================================================
    let lastTime = performance.now();
    let animId = null;

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth camera gliding
      camera.position.lerp(targetCamPosRef.current, 0.06);
      controls.target.lerp(targetCamLookRef.current, 0.06);
      controls.update();

      // --- 1. Fan Rotation & Physics Inertia (Using Real-Time fanStateRef) ---
      const activeFanState = fanStateRef.current;
      const targetSpeed = activeFanState.on ? (activeFanState.speed || 3) * 160 : 0;
      const curSpeed = fanVelocityRef.current;

      if (curSpeed < targetSpeed) {
        fanVelocityRef.current = Math.min(targetSpeed, curSpeed + 420 * dt);
      } else if (curSpeed > targetSpeed) {
        fanVelocityRef.current = Math.max(targetSpeed, curSpeed - 220 * dt);
      }

      if (fanRotorRef.current && fanVelocityRef.current > 0.1) {
        fanAngleRef.current += THREE.MathUtils.degToRad(fanVelocityRef.current * dt);
        fanRotorRef.current.rotation.y = fanAngleRef.current;
      }

      // --- 2. Motorized AC Louver Vane Angle (Using Real-Time acStateRef) ---
      const activeAcState = acStateRef.current;
      if (acLouverRef.current) {
        const targetLouverRot = activeAcState.on ? 0.68 : 0; // ~38° open
        acLouverRef.current.rotation.x = THREE.MathUtils.lerp(acLouverRef.current.rotation.x, targetLouverRot, 0.08);
      }

      // --- 3. Circular Concentric AC Airflow Wave Propagation ---
      if (acAirflowGroupRef.current) {
        acAirflowGroupRef.current.visible = Boolean(activeAcState.on);
        if (activeAcState.on) {
          // Dynamic air velocity: lower temperature = faster cooling velocity
          const targetTemp = activeAcState.temp || 22;
          const tempSpeedFactor = Math.max(0.65, Math.min(1.4, 1.0 + (22 - targetTemp) * 0.05));
          const flowSpeed = 0.36 * tempSpeedFactor;

          // Color tint by AC mode
          let waveColor = 0x38bdf8; // Cool mode: glacial ice cyan
          if (activeAcState.mode === 'dry') {
            waveColor = 0x2dd4bf; // Dry mode: soft seafoam teal
          } else if (activeAcState.mode === 'fan') {
            waveColor = 0xbfeaff; // Fan mode: crisp airy light blue
          }

          acAirflowGroupRef.current.children.forEach((arcMesh) => {
            const phase = ((now * 0.001 * flowSpeed) + arcMesh.userData.phaseOffset) % 1.0;

            // Radius expands smoothly from 0.15m at louver to 3.2m across the room
            const radius = 0.15 + phase * 3.05;

            // Natural gravity descent: cool air gently sinks downward as it travels
            const sinkY = -Math.pow(phase, 1.25) * 0.42;

            arcMesh.scale.set(radius, 1, radius);
            arcMesh.position.y = sinkY;

            // Opacity envelope: rapid emergence, luminous peak, smooth atmospheric dissipation
            let alpha = 0;
            if (phase < 0.12) {
              alpha = (phase / 0.12);
            } else {
              alpha = Math.pow(1 - (phase - 0.12) / 0.88, 1.45);
            }

            const baseMaxAlpha = arcMesh.userData.isFine ? 0.45 : 0.78;
            arcMesh.material.opacity = alpha * baseMaxAlpha;
            arcMesh.material.color.setHex(waveColor);
          });
        }
      }

      // --- 4. Motorized Curtains Travel (Using Real-Time curtainStateRef) ---
      const activeCurtainState = curtainStateRef.current;
      if (curtainLeftRef.current && curtainRightRef.current) {
        // position 100% = fully open, 0% = fully closed
        const openFrac = (activeCurtainState.position ?? 100) / 100;

        // When closed (openFrac = 0): scale.x = 1.0 (covers 1.8m), posX = -0.9 and +0.9
        // When open (openFrac = 1.0): scale.x = 0.28 (bunches tightly), posX = -1.45 and +1.45
        const targetScaleX = THREE.MathUtils.lerp(1.0, 0.28, openFrac);
        const targetLeftX = THREE.MathUtils.lerp(-0.9, -1.45, openFrac);
        const targetRightX = THREE.MathUtils.lerp(0.9, 1.45, openFrac);

        curtainLeftRef.current.scale.x = THREE.MathUtils.lerp(curtainLeftRef.current.scale.x, targetScaleX, 0.08);
        curtainRightRef.current.scale.x = THREE.MathUtils.lerp(curtainRightRef.current.scale.x, targetScaleX, 0.08);

        curtainLeftRef.current.position.x = THREE.MathUtils.lerp(curtainLeftRef.current.position.x, targetLeftX, 0.08);
        curtainRightRef.current.position.x = THREE.MathUtils.lerp(curtainRightRef.current.position.x, targetRightX, 0.08);
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // --- Window Resize Listener ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. DYNAMIC LIGHTING & SMART CONTROLS SYNC
  useEffect(() => {
    // 0. Dynamic Procedural Skyline Update
    if (skylineCanvasRef.current && skylineTextureRef.current) {
      updateSkylineCanvas(skylineCanvasRef.current, activeScene);
      skylineTextureRef.current.needsUpdate = true;
    }

    // 1. Chandelier Lighting
    if (chandelierLightRef.current) {
      chandelierLightRef.current.intensity = chandelierBright * 3.8;
    }
    if (chandelierMeshRef.current) {
      chandelierMeshRef.current.emissive = new THREE.Color(0xffd175);
      chandelierMeshRef.current.emissiveIntensity = chandelierBright * 0.85;
    }

    // 2. Perimeter Tray Cove
    coveLightsRef.current.forEach((cl) => {
      cl.intensity = coveBright * 1.6;
    });
    if (coveMeshRef.current) {
      coveMeshRef.current.material.opacity = coveBright * 0.95;
    }

    // 3. 5 Recessed Spotlights & Visible Fixture Lenses (Originating from ceiling fixtures)
    spotLightsRef.current.forEach((sl) => {
      sl.intensity = spotBright * 3.8;
    });
    spotLensesRef.current.forEach((lensMat) => {
      lensMat.emissiveIntensity = spotBright * 3.5;
      lensMat.color.setHex(spotBright > 0 ? 0xffffff : 0x334155);
    });
    spotHalosRef.current.forEach((haloMat) => {
      haloMat.emissiveIntensity = spotBright * 2.5;
      haloMat.color.setHex(spotBright > 0 ? 0xffeed1 : 0x222631);
    });

    // 4. Main Neutral Ambient Light
    if (mainAmbientRef.current) {
      if (isMorning) {
        mainAmbientRef.current.color.setHex(0xfff6ea);
        mainAmbientRef.current.groundColor.setHex(0x8294a5);
        mainAmbientRef.current.intensity = 0.95;
      } else if (isNight) {
        mainAmbientRef.current.color.setHex(0x0e1728);
        mainAmbientRef.current.groundColor.setHex(0x080d16);
        mainAmbientRef.current.intensity = 0.22;
      } else if (isMasterOn) {
        mainAmbientRef.current.color.setHex(0xf5f8ff);
        mainAmbientRef.current.groundColor.setHex(0x1a2130);
        mainAmbientRef.current.intensity = 0.4 + mainBright * 0.65;
      } else {
        // Standby / living-off
        mainAmbientRef.current.color.setHex(0x101622);
        mainAmbientRef.current.intensity = 0.15;
      }
    }

    // 5. Ceiling Canopy Wash
    if (ceilingWashRef.current) {
      ceilingWashRef.current.intensity = ceilingBright * 1.2;
    }

    // 6. Relax 2200K Amber Sanctuary
    if (relaxLightRef.current) {
      relaxLightRef.current.intensity = isRelax ? 0.95 : 0;
    }

    // 7. Panoramic Window Sun / Moon Directional Light
    if (twilightDirLightRef.current) {
      if (isMorning) {
        twilightDirLightRef.current.color.setHex(0xffecd1);
        twilightDirLightRef.current.intensity = 1.95;
        twilightDirLightRef.current.position.set(-3.8, 2.7, -4.5);
      } else if (isNight) {
        twilightDirLightRef.current.color.setHex(0x283b5c);
        twilightDirLightRef.current.intensity = 0.35;
        twilightDirLightRef.current.position.set(-3.5, 3.2, -4.5);
      } else if (isMasterOn) {
        twilightDirLightRef.current.color.setHex(0x4a6fa5);
        twilightDirLightRef.current.intensity = 0.75;
        twilightDirLightRef.current.position.set(-3.5, 3.2, -4.5);
      } else {
        // Standby / living-off
        twilightDirLightRef.current.color.setHex(0x1a2436);
        twilightDirLightRef.current.intensity = 0.25;
        twilightDirLightRef.current.position.set(-3.5, 3.2, -4.5);
      }
    }

    // 8. Fan LED Hub Status Indicator
    if (fanLedMeshRef.current) {
      fanLedMeshRef.current.material.color.setHex(fanState.on ? 0x38bdf8 : 0x334155);
    }

    // 9. AC Digital Display & Airflow Streamlines
    if (acCanvasRef.current && acTextureRef.current) {
      updateACCanvas(acCanvasRef.current, acState.temp, acState.mode, acState.on);
      acTextureRef.current.needsUpdate = true;
    }
    if (acAirflowGroupRef.current) {
      acAirflowGroupRef.current.visible = Boolean(acState.on);
    }
  }, [
    activeScene,
    isMorning,
    isNight,
    isMasterOn,
    circuits,
    dimmers,
    chandelierBright,
    coveBright,
    spotBright,
    mainBright,
    ceilingBright,
    isStandby,
    isRelax,
    fanState.on,
    fanState.speed,
    acState.on,
    acState.temp,
    acState.mode,
  ]);

  // 3. INTERACTIVE RAYCASTING (Clicking 3D Object Toggles Keypad Control)
  const handleCanvasClick = useCallback((event) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj && !obj.name && obj.parent) {
        obj = obj.parent;
      }

      if (obj && obj.name) {
        if (obj.name.includes('Fan')) {
          onToggleDevice?.('fan');
        } else if (obj.name.includes('AC')) {
          onToggleDevice?.('ac');
        } else if (obj.name.includes('Curtains') || obj.name.includes('Drapes')) {
          onToggleDevice?.('curtain');
        } else if (obj.name.includes('Spot')) {
          onToggleFixture?.('spotlights');
        } else if (obj.name.includes('Window') || obj.name.includes('Skyline')) {
          onToggleFixture?.(isMorning ? 'night' : 'morning');
        }
      }
    }
  }, [onToggleDevice, onToggleFixture, isMorning]);

  // Mouse Move Raycasting for Hover Tooltips
  const handleMouseMove = useCallback((event) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

    let foundName = null;
    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj && !obj.name && obj.parent) {
        obj = obj.parent;
      }
      if (obj && obj.name) {
        foundName = obj.name;
      }
    }
    setHoveredObject(foundName);
  }, []);

  // 4. CINEMATIC CAMERA PRESETS
  const setCameraView = (viewKey) => {
    setActiveCameraView(viewKey);
    if (viewKey === 'overview') {
      // Primary master architectural wide view (all elements in direct view)
      targetCamPosRef.current.set(0.0, 1.95, 5.4);
      targetCamLookRef.current.set(-0.15, 1.35, -1.0);
    } else if (viewKey === 'fan') {
      // Focused ceiling fan view
      targetCamPosRef.current.set(-1.4, 2.2, 1.2);
      targetCamLookRef.current.set(-1.4, 3.1, -0.5);
    } else if (viewKey === 'ac') {
      // Focused wall AC view
      targetCamPosRef.current.set(-2.2, 2.3, 0.4);
      targetCamLookRef.current.set(-3.7, 2.45, -1.2);
    } else if (viewKey === 'window') {
      // Focused panoramic window & drapes view
      targetCamPosRef.current.set(-1.6, 1.6, 0.4);
      targetCamLookRef.current.set(-2.45, 1.6, -3.65);
    } else if (viewKey === 'art') {
      // Focused chandelier & marble feature wall view
      targetCamPosRef.current.set(1.1, 1.9, 1.5);
      targetCamLookRef.current.set(1.65, 2.0, -2.0);
    }
  };

  return (
    <div
      className={`luxury-3d-room-container ${isStandby ? 'mode-standby' : 'mode-active'} ${isRelax ? 'mode-relax' : ''}`}
      aria-label="3D Procedural Smart Luxury Living Room Simulator"
    >
      {/* Three.js WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="webgl-canvas-mount"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
      />

      {/* Interactive 3D HUD Tooltip on Hover */}
      {hoveredObject && (
        <div className="hud-3d-tooltip" aria-live="polite">
          <span className="tooltip-icon">✦</span>
          <span>Tap to toggle {hoveredObject}</span>
        </div>
      )}



      {/* Camera Preset Navigation Bar */}
      <nav className="camera-presets-bar" aria-label="3D Camera Views">
        <button
          type="button"
          className={`cam-pill ${activeCameraView === 'overview' ? 'active' : ''}`}
          onClick={() => setCameraView('overview')}
        >
          👁️ Overview
        </button>
        <button
          type="button"
          className={`cam-pill ${activeCameraView === 'fan' ? 'active' : ''}`}
          onClick={() => setCameraView('fan')}
        >
          🌀 Fan
        </button>
        <button
          type="button"
          className={`cam-pill ${activeCameraView === 'ac' ? 'active' : ''}`}
          onClick={() => setCameraView('ac')}
        >
          ❄️ AC
        </button>
        <button
          type="button"
          className={`cam-pill ${activeCameraView === 'window' ? 'active' : ''}`}
          onClick={() => setCameraView('window')}
        >
          🪟 Window & Drapes
        </button>
        <button
          type="button"
          className={`cam-pill ${activeCameraView === 'art' ? 'active' : ''}`}
          onClick={() => setCameraView('art')}
        >
          💎 Chandelier & Art
        </button>
      </nav>
    </div>
  );
}
