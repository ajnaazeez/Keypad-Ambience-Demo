import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
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

// 4. Luxury Bouclé & Woven Fabric Texture (High-Res Albedo & Bump Maps)
function createFabricTextures() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base luxury bouclé warm oatmeal ivory
  ctx.fillStyle = '#eae5dc';
  ctx.fillRect(0, 0, 1024, 1024);

  // Woven micro-fiber grid with tactile loops
  const step = 8;
  for (let x = 0; x < 1024; x += step) {
    for (let y = 0; y < 1024; y += step) {
      const isAlt = (Math.floor(x / step) + Math.floor(y / step)) % 2 === 0;
      const shade = isAlt ? 236 : 222;
      const variation = (Math.random() - 0.5) * 14;
      const v = Math.min(255, Math.max(0, shade + variation));
      ctx.fillStyle = `rgb(${v},${v - 4},${v - 11})`;
      ctx.fillRect(x, y, step, step);

      // Micro yarn twist loop
      if (Math.random() > 0.35) {
        ctx.strokeStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.4)' : 'rgba(175,165,152,0.28)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(x + step * 0.5, y + step * 0.5, step * 0.36, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // Soft directional fabric weave lines
  ctx.strokeStyle = 'rgba(150, 140, 128, 0.09)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 1024; i += 4) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Fine bump map for tactile relief
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d');
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 4) {
    for (let y = 0; y < 512; y += 4) {
      const val = Math.floor(128 + (Math.random() - 0.5) * 65);
      bCtx.fillStyle = `rgb(${val},${val},${val})`;
      bCtx.fillRect(x, y, 4, 4);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(6, 6);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(12, 12);

  return { map, bumpMap };
}

// 4.b High-End Ribbed Boucle & Wool Area Rug Texture
function createRugTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base warm woven wool cream
  ctx.fillStyle = '#f2eee5';
  ctx.fillRect(0, 0, 1024, 1024);

  // Sheared linear ribs
  const ribHeight = 12;
  for (let y = 0; y < 1024; y += ribHeight) {
    const grad = ctx.createLinearGradient(0, y, 0, y + ribHeight);
    grad.addColorStop(0, 'rgba(215, 207, 194, 0.45)');
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(0.7, 'rgba(235, 229, 218, 0.3)');
    grad.addColorStop(1, 'rgba(185, 175, 160, 0.55)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, 1024, ribHeight);

    // Deep rib valley shadow line
    ctx.fillStyle = 'rgba(150, 138, 122, 0.4)';
    ctx.fillRect(0, y + ribHeight - 2, 1024, 2);
  }

  // Cross-texture micro-loops
  for (let i = 0; i < 1800; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1024;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.45)' : 'rgba(195,185,170,0.35)';
    ctx.fillRect(rx, ry, 2.5, 2.5);
  }

  // Architectural Charcoal Border Frame
  ctx.strokeStyle = '#2d2824';
  ctx.lineWidth = 14;
  ctx.strokeRect(32, 32, 960, 960);

  // Inner subtle accent pinstripe
  ctx.strokeStyle = 'rgba(180, 165, 145, 0.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(52, 52, 920, 920);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 4.c Procedural Contact Shadow Texture (Smooth Ambient Occlusion)
function createContactShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 240);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  grad.addColorStop(0.4, 'rgba(0, 0, 0, 0.28)');
  grad.addColorStop(0.75, 'rgba(0, 0, 0, 0.08)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  return new THREE.CanvasTexture(canvas);
}

// 4.d Procedural Cashmere Waffle Throw Blanket Texture
function createThrowBlanketTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#3a3e47'; // Sophisticated slate charcoal
  ctx.fillRect(0, 0, 512, 512);

  const wSize = 16;
  for (let x = 0; x < 512; x += wSize) {
    for (let y = 0; y < 512; y += wSize) {
      const grad = ctx.createLinearGradient(x, y, x + wSize, y + wSize);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.06)');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1, y + 1, wSize - 2, wSize - 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
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

// 6. Ultra-Luxury 4K OLED Cinematic Ambient Display Texture
function createTVScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // Deep cinematic twilight gradient (OLED black into twilight indigo & warm golden amber)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 720);
  skyGrad.addColorStop(0, '#040711');
  skyGrad.addColorStop(0.35, '#0b162c');
  skyGrad.addColorStop(0.65, '#1e294b');
  skyGrad.addColorStop(0.85, '#5c3a4d');
  skyGrad.addColorStop(0.95, '#c86f43');
  skyGrad.addColorStop(1, '#e8a860');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1920, 1080);

  // Soft luminous moon or dusk sun disc
  const sunGrad = ctx.createRadialGradient(1350, 480, 10, 1350, 480, 240);
  sunGrad.addColorStop(0, 'rgba(255, 248, 225, 0.95)');
  sunGrad.addColorStop(0.25, 'rgba(255, 210, 140, 0.6)');
  sunGrad.addColorStop(0.6, 'rgba(220, 120, 80, 0.2)');
  sunGrad.addColorStop(1, 'rgba(200, 100, 60, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(1350, 480, 240, 0, Math.PI * 2);
  ctx.fill();

  // Distant majestic mountain ridges - Layer 1 (Deep distant silhouette)
  ctx.fillStyle = '#1c1b30';
  ctx.beginPath();
  ctx.moveTo(0, 700);
  ctx.lineTo(260, 520);
  ctx.lineTo(540, 620);
  ctx.lineTo(820, 470);
  ctx.lineTo(1100, 590);
  ctx.lineTo(1420, 430);
  ctx.lineTo(1700, 560);
  ctx.lineTo(1920, 490);
  ctx.lineTo(1920, 1080);
  ctx.lineTo(0, 1080);
  ctx.closePath();
  ctx.fill();

  // Layer 2 - Midground sharper mountain peaks with subtle snow/mist highlights
  ctx.fillStyle = '#0f1422';
  ctx.beginPath();
  ctx.moveTo(0, 750);
  ctx.lineTo(200, 610);
  ctx.lineTo(480, 500);
  ctx.lineTo(760, 640);
  ctx.lineTo(1050, 520);
  ctx.lineTo(1320, 670);
  ctx.lineTo(1640, 510);
  ctx.lineTo(1920, 650);
  ctx.lineTo(1920, 1080);
  ctx.lineTo(0, 1080);
  ctx.closePath();
  ctx.fill();

  // Misty alpine lake reflecting golden amber
  const waterGrad = ctx.createLinearGradient(0, 720, 0, 1080);
  waterGrad.addColorStop(0, '#0e1628');
  waterGrad.addColorStop(0.3, '#1a233a');
  waterGrad.addColorStop(0.7, '#0d1322');
  waterGrad.addColorStop(1, '#05070f');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, 720, 1920, 360);

  // Water golden reflection shimmer under the sun
  const waterReflection = ctx.createLinearGradient(1200, 720, 1500, 720);
  waterReflection.addColorStop(0, 'rgba(232, 168, 96, 0)');
  waterReflection.addColorStop(0.5, 'rgba(232, 168, 96, 0.35)');
  waterReflection.addColorStop(1, 'rgba(232, 168, 96, 0)');
  ctx.fillStyle = waterReflection;
  ctx.fillRect(1200, 720, 300, 260);

  // Foreground dark pine silhouettes
  ctx.fillStyle = '#060a12';
  for (let x = 40; x < 650; x += 35 + (x % 20)) {
    const treeH = 120 + ((x * 13) % 110);
    const treeBase = 840 + ((x * 7) % 50);
    ctx.beginPath();
    ctx.moveTo(x, treeBase - treeH);
    ctx.lineTo(x - 22, treeBase);
    ctx.lineTo(x + 22, treeBase);
    ctx.closePath();
    ctx.fill();
  }

  // Subtle Ambient Smart OLED UI Overlay (Luxury gallery / smart home ambient mode)
  // Top-left subtle brand / mode
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = '500 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('GALLERY AMBIENT', 84, 96);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '400 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Nordic Twilight • 4K HDR', 84, 126);

  // Top-right clean minimalist digital clock
  ctx.fillStyle = '#ffffff';
  ctx.font = '300 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('18:42', 1836, 105);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '400 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Wednesday, October 14  •  24°C', 1836, 138);

  // Subtle bottom-left discreet logo badge
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('ARISS VISION OLED 75"', 84, 1020);

  // Subtle screen glass reflection sheen overlay
  const sheenGrad = ctx.createLinearGradient(0, 0, 1920, 1080);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  sheenGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.02)');
  sheenGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.03)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.06)');
  ctx.fillStyle = sheenGrad;
  ctx.fillRect(0, 0, 1920, 1080);

  // Vignette border
  const vigGrad = ctx.createRadialGradient(960, 540, 600, 960, 540, 1100);
  vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
  vigGrad.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, 1920, 1080);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
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
  activeScene = 'living-on',
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

  // TV Screen & Ambilight Bias Lighting Refs
  const [tvOn, setTvOn] = useState(true);
  const tvScreenMatRef = useRef(null);
  const tvBiasMeshRef = useRef(null);
  const tvBiasLightRef = useRef(null);
  const tvLedMeshRef = useRef(null);

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
    const fabricTex = createFabricTextures();
    const contactShadowTex = createContactShadowTexture();
    const throwBlanketTex = createThrowBlanketTexture();

    // Dynamic Procedural Canvas Skyline
    const skylineCanvas = document.createElement('canvas');
    skylineCanvas.width = 2048;
    skylineCanvas.height = 1024;
    skylineCanvasRef.current = skylineCanvas;
    updateSkylineCanvas(skylineCanvas, activeScene || 'living-on');
    const skylineTex = new THREE.CanvasTexture(skylineCanvas);
    skylineTextureRef.current = skylineTex;

    const tvTex = createTVScreenTexture();

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

    // 4. Contemporary Architectural 75" Ultra-Slim OLED TV & Ambilight Setup
    const tvGroup = new THREE.Group();
    tvGroup.name = 'Smart OLED TV';
    tvGroup.position.set(0, 0.40, 0.04);

    // 4.a Flush TV Wall Mount Bracket (connecting TV chassis to marble slab)
    const mountMat = new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.8, metalness: 0.5 });
    const wallBracket = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.46, 0.02), mountMat);
    wallBracket.position.set(0, 0, 0.01);
    tvGroup.add(wallBracket);

    // 4.b Ambilight LED Bias Backlight Plane (Warm ambient halo glowing behind TV on marble)
    const biasGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffe2bf,
      transparent: true,
      opacity: 0.48,
    });
    const biasBacklight = new THREE.Mesh(new THREE.PlaneGeometry(1.98, 1.20), biasGlowMat);
    biasBacklight.position.set(0, 0, 0.012);
    tvGroup.add(biasBacklight);
    tvBiasMeshRef.current = biasBacklight;

    // Soft rear bias point light casting on the Calacatta marble slab
    const tvBiasLight = new THREE.PointLight(0xffedd8, 0.85, 2.4, 2);
    tvBiasLight.position.set(0, 0, 0.02);
    tvGroup.add(tvBiasLight);
    tvBiasLightRef.current = tvBiasLight;

    // 4.c Ultra-Slim TV Chassis Frame (75-inch class: 1.82m x 1.05m x 0.024m)
    const tvFrameMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.28,
      metalness: 0.88,
    });
    const tvChassis = new THREE.Mesh(
      new RoundedBoxGeometry(1.82, 1.05, 0.024, 6, 0.012),
      tvFrameMat
    );
    tvChassis.position.set(0, 0, 0.025);
    tvChassis.castShadow = true;
    tvGroup.add(tvChassis);

    // 4.d Ultra-Thin Inner Bezel Border (Minimalist 4mm edge)
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x090a0d, roughness: 0.4, metalness: 0.3 });
    const innerBezel = new THREE.Mesh(new THREE.BoxGeometry(1.79, 1.02, 0.025), bezelMat);
    innerBezel.position.set(0, 0, 0.026);
    tvGroup.add(innerBezel);

    // 4.e OLED Display Screen Glass with 4K Ambient Art Texture
    const tvScreenMat = new THREE.MeshPhysicalMaterial({
      map: tvTex,
      emissiveMap: tvTex,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.45,
      roughness: 0.08,
      metalness: 0.12,
      clearcoat: 0.85,
      clearcoatRoughness: 0.06,
      reflectivity: 0.65,
    });
    tvScreenMatRef.current = tvScreenMat;

    const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.77, 1.00), tvScreenMat);
    tvScreen.position.set(0, 0, 0.039);
    tvScreen.name = 'Smart OLED TV Screen';
    tvGroup.add(tvScreen);

    // 4.f Discreet Standby / Power Status LED Indicator (Bottom-right edge)
    const tvLedMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const tvLed = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.002, 12), tvLedMat);
    tvLed.rotation.x = Math.PI / 2;
    tvLed.position.set(0.85, -0.512, 0.038);
    tvGroup.add(tvLed);
    tvLedMeshRef.current = tvLed;

    featureWallGroup.add(tvGroup);

    // 4.g Architectural Acoustic Soundbar (Floating between TV and Credenza)
    const soundbarGroup = new THREE.Group();
    soundbarGroup.name = 'Acoustic Soundbar';
    soundbarGroup.position.set(0, -0.72, 0.18);

    // Wall bracket for soundbar
    const soundbarBracket = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.14), mountMat);
    soundbarBracket.position.set(0, 0, -0.07);
    soundbarGroup.add(soundbarBracket);

    // Soundbar acoustic fabric body
    const acousticFabricMat = new THREE.MeshStandardMaterial({
      color: 0x26282e,
      roughness: 0.88,
      metalness: 0.04,
    });
    const soundbarBody = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.28, 28), acousticFabricMat);
    soundbarBody.rotation.z = Math.PI / 2;
    soundbarBody.castShadow = true;
    soundbarGroup.add(soundbarBody);

    // Soundbar Brushed Brass Endcaps
    const soundbarCapL = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.016, 24), brassTrimMat);
    soundbarCapL.rotation.z = Math.PI / 2;
    soundbarCapL.position.set(-0.645, 0, 0);
    soundbarGroup.add(soundbarCapL);

    const soundbarCapR = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.016, 24), brassTrimMat);
    soundbarCapR.rotation.z = Math.PI / 2;
    soundbarCapR.position.set(0.645, 0, 0);
    soundbarGroup.add(soundbarCapR);

    // Soundbar Center Status LED
    const soundbarLedMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const soundbarLed = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.003, 0.003), soundbarLedMat);
    soundbarLed.position.set(0, 0.046, 0);
    soundbarGroup.add(soundbarLed);

    featureWallGroup.add(soundbarGroup);

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
    // I. ULTRA-LUXURY ARCHITECTURAL FURNITURE ENSEMBLE
    // Custom-designed Italian modular seating with realistic bouclé fabric weave,
    // pillowed chamfer contours, welt piping seams, contact shadows, and bespoke
    // nested marble/fluted-wood coffee tables.
    // =========================================================================

    // Shared Luxury Materials
    const luxuryBoucleMat = new THREE.MeshPhysicalMaterial({
      map: fabricTex.map,
      bumpMap: fabricTex.bumpMap,
      bumpScale: 0.007,
      color: 0xeeeae2,
      roughness: 0.88,
      metalness: 0.02,
      sheen: 1.0,
      sheenRoughness: 0.55,
      sheenColor: new THREE.Color(0xffffff),
    });

    const walnutFrameMat = new THREE.MeshStandardMaterial({
      color: 0x241810,
      roughness: 0.42,
      metalness: 0.08,
    });

    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

    // 1. High-End Ribbed Boucle & Wool Area Rug (Physical 2.2cm thickness with beveled edges)
    const rugGroup = new THREE.Group();
    rugGroup.position.set(0.1, 0, -0.4);

    // Soft Rug Ambient Contact Shadow on Floor
    const rugShadow = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.9), contactShadowMat);
    rugShadow.rotation.x = -Math.PI / 2;
    rugShadow.position.set(0, 0.002, 0);
    rugGroup.add(rugShadow);

    const rugMat = new THREE.MeshStandardMaterial({
      map: rugTex,
      roughness: 0.85,
      metalness: 0.02,
    });
    const rug = new THREE.Mesh(new RoundedBoxGeometry(4.8, 0.022, 3.6, 6, 0.03), rugMat);
    rug.position.set(0, 0.011, 0);
    rug.receiveShadow = true;
    rugGroup.add(rug);
    scene.add(rugGroup);

    // 2. Low-Profile Italian Modular Sectional Sofa (Right Side)
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(1.5, 0, 0.2);

    // Soft Ambient Contact Shadow under Sofa
    const sofaShadow = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.7), contactShadowMat);
    sofaShadow.rotation.x = -Math.PI / 2;
    sofaShadow.position.set(0, 0.013, 0.08);
    sofaGroup.add(sofaShadow);

    // 2.a Recessed American Walnut Base Plinth (4cm shadow reveal)
    const sofaPlinth = new THREE.Mesh(
      new RoundedBoxGeometry(2.68, 0.065, 1.14, 6, 0.02),
      walnutFrameMat
    );
    sofaPlinth.position.set(0, 0.033, 0.06);
    sofaPlinth.castShadow = true;
    sofaGroup.add(sofaPlinth);

    // Brushed Brass Inset Reveal Band
    const sofaBrassReveal = new THREE.Mesh(
      new RoundedBoxGeometry(2.70, 0.012, 1.16, 4, 0.006),
      brassTrimMat
    );
    sofaBrassReveal.position.set(0, 0.068, 0.06);
    sofaGroup.add(sofaBrassReveal);

    // 2.b Upholstered Bench Platform / Deck
    const benchDeck = new THREE.Mesh(
      new RoundedBoxGeometry(2.64, 0.14, 1.12, 8, 0.045),
      luxuryBoucleMat
    );
    benchDeck.position.set(0, 0.14, 0.06);
    benchDeck.castShadow = true;
    benchDeck.receiveShadow = true;
    sofaGroup.add(benchDeck);

    // 2.c Dual Deep Feather-Down Seat Cushions (Plush pillowed crowns)
    // Left Cushion
    const seatLeft = new THREE.Mesh(
      new RoundedBoxGeometry(1.28, 0.22, 1.05, 10, 0.065),
      luxuryBoucleMat
    );
    seatLeft.position.set(-0.66, 0.28, 0.04);
    seatLeft.castShadow = true;
    seatLeft.receiveShadow = true;
    sofaGroup.add(seatLeft);

    // Right Cushion
    const seatRight = new THREE.Mesh(
      new RoundedBoxGeometry(1.28, 0.22, 1.05, 10, 0.065),
      luxuryBoucleMat
    );
    seatRight.position.set(0.66, 0.28, 0.04);
    seatRight.castShadow = true;
    seatRight.receiveShadow = true;
    sofaGroup.add(seatRight);

    // Center Tailored Seam Piping Divider Bead
    const seatDivider = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, 1.02, 12),
      new THREE.MeshStandardMaterial({ color: 0xd8d3c9, roughness: 0.9 })
    );
    seatDivider.rotation.x = Math.PI / 2;
    seatDivider.position.set(0, 0.35, 0.04);
    sofaGroup.add(seatDivider);

    // 2.d Tailored Backrest Shell (Rear support with gentle bevel)
    const backrestShell = new THREE.Mesh(
      new RoundedBoxGeometry(2.64, 0.38, 0.24, 8, 0.055),
      luxuryBoucleMat
    );
    backrestShell.position.set(0, 0.44, 0.48);
    backrestShell.castShadow = true;
    backrestShell.receiveShadow = true;
    sofaGroup.add(backrestShell);

    // Top Perimeter Backrest Welting Bead (Visible from rear camera angle!)
    const backrestWelt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.009, 0.009, 2.58, 16),
      new THREE.MeshStandardMaterial({ color: 0xc8c2b5, roughness: 0.85 })
    );
    backrestWelt.rotation.z = Math.PI / 2;
    backrestWelt.position.set(0, 0.63, 0.48);
    sofaGroup.add(backrestWelt);

    // 2.e Dual Plush Backrest Pillows (Slightly angled back for casual elegance)
    const backPillowLeft = new THREE.Mesh(
      new RoundedBoxGeometry(1.24, 0.30, 0.16, 8, 0.05),
      luxuryBoucleMat
    );
    backPillowLeft.position.set(-0.66, 0.50, 0.34);
    backPillowLeft.rotation.x = -0.09;
    backPillowLeft.castShadow = true;
    sofaGroup.add(backPillowLeft);

    const backPillowRight = new THREE.Mesh(
      new RoundedBoxGeometry(1.24, 0.30, 0.16, 8, 0.05),
      luxuryBoucleMat
    );
    backPillowRight.position.set(0.66, 0.50, 0.34);
    backPillowRight.rotation.x = -0.09;
    backPillowRight.castShadow = true;
    sofaGroup.add(backPillowRight);

    // 2.f Architectural Low Armrest (Right Side)
    const armrestRight = new THREE.Mesh(
      new RoundedBoxGeometry(0.24, 0.28, 1.05, 8, 0.05),
      luxuryBoucleMat
    );
    armrestRight.position.set(1.42, 0.30, 0.04);
    armrestRight.castShadow = true;
    sofaGroup.add(armrestRight);

    // 2.g Left End Integrated Dark Smoked Walnut Accent Tray
    const sideTray = new THREE.Mesh(
      new RoundedBoxGeometry(0.32, 0.045, 0.65, 6, 0.012),
      walnutFrameMat
    );
    sideTray.position.set(-1.42, 0.20, -0.05);
    sideTray.castShadow = true;
    sofaGroup.add(sideTray);

    // Marble Coaster & Minimalist Ceramic Tumbler on Tray
    const marbleCoaster = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.015, 24),
      new THREE.MeshStandardMaterial({ map: marbleTex, roughness: 0.3 })
    );
    marbleCoaster.position.set(-1.42, 0.23, -0.05);
    sofaGroup.add(marbleCoaster);

    const tumbler = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.032, 0.09, 20),
      new THREE.MeshStandardMaterial({ color: 0x181c24, roughness: 0.2, metalness: 0.1 })
    );
    tumbler.position.set(-1.42, 0.28, -0.05);
    sofaGroup.add(tumbler);

    // 2.h Curated Throw Pillows (Rich velvet, charcoal bouclé, & ivory lumbar)
    // Pillow 1: Warm Sunset Terracotta Velvet
    const pillowMatTerracotta = new THREE.MeshPhysicalMaterial({
      color: 0xb85e3a,
      roughness: 0.75,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xd9774a),
    });
    const pillow1 = new THREE.Mesh(
      new RoundedBoxGeometry(0.40, 0.40, 0.14, 8, 0.065),
      pillowMatTerracotta
    );
    pillow1.position.set(0.72, 0.48, 0.25);
    pillow1.rotation.set(0.08, -0.22, 0.08);
    pillow1.castShadow = true;
    sofaGroup.add(pillow1);

    // Pillow 2: Midnight Slate Navy Bouclé
    const pillowMatNavy = new THREE.MeshPhysicalMaterial({
      color: 0x243242,
      roughness: 0.85,
      sheen: 0.8,
      sheenColor: new THREE.Color(0x38526d),
    });
    const pillow2 = new THREE.Mesh(
      new RoundedBoxGeometry(0.36, 0.36, 0.13, 8, 0.055),
      pillowMatNavy
    );
    pillow2.position.set(-0.32, 0.47, 0.26);
    pillow2.rotation.set(-0.06, 0.16, -0.04);
    pillow2.castShadow = true;
    sofaGroup.add(pillow2);

    // Pillow 3: Tailored Oatmeal Lumbar Cushion
    const pillow3 = new THREE.Mesh(
      new RoundedBoxGeometry(0.44, 0.24, 0.12, 8, 0.045),
      luxuryBoucleMat
    );
    pillow3.position.set(0.18, 0.37, 0.18);
    pillow3.rotation.set(0.04, -0.08, 0.02);
    pillow3.castShadow = true;
    sofaGroup.add(pillow3);

    // 2.i Draped Cashmere Waffle Throw Blanket (Over right armrest/back)
    const blanketMat = new THREE.MeshStandardMaterial({
      map: throwBlanketTex,
      roughness: 0.9,
      color: 0x484d57,
    });
    const blanket = new THREE.Mesh(
      new RoundedBoxGeometry(0.55, 0.025, 0.72, 6, 0.012),
      blanketMat
    );
    blanket.position.set(1.36, 0.42, 0.22);
    blanket.rotation.set(0.12, 0.04, -0.15);
    blanket.castShadow = true;
    sofaGroup.add(blanket);

    scene.add(sofaGroup);

    // 3. Bespoke Nested Sculptural Coffee Table Ensemble (Center)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0.5, 0, -0.6);

    // Soft Ambient Contact Shadow under Table
    const tableShadow = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.4), contactShadowMat);
    tableShadow.rotation.x = -Math.PI / 2;
    tableShadow.position.set(0, 0.013, 0);
    tableGroup.add(tableShadow);

    // 3.a Primary Table: Honed Italian Calacatta Marble Slab with Brass Bevel
    const marbleTableTop = new THREE.Mesh(
      new RoundedBoxGeometry(1.42, 0.055, 0.78, 8, 0.025),
      new THREE.MeshStandardMaterial({
        map: marbleTex,
        roughness: 0.28,
        metalness: 0.05,
      })
    );
    marbleTableTop.position.set(0, 0.32, 0);
    marbleTableTop.castShadow = true;
    marbleTableTop.receiveShadow = true;
    tableGroup.add(marbleTableTop);

    // Brushed Brass Trim Reveal below marble
    const marbleBrassRim = new THREE.Mesh(
      new RoundedBoxGeometry(1.43, 0.012, 0.79, 6, 0.01),
      brassTrimMat
    );
    marbleBrassRim.position.set(0, 0.285, 0);
    tableGroup.add(marbleBrassRim);

    // Recessed Dark Bronze Pedestal Base
    const tableBase = new THREE.Mesh(
      new RoundedBoxGeometry(1.10, 0.26, 0.54, 6, 0.02),
      walnutFrameMat
    );
    tableBase.position.set(0, 0.14, 0);
    tableBase.castShadow = true;
    tableGroup.add(tableBase);

    // 3.b Secondary Nested Table: Fluted Smoked Walnut Companion Cube
    const nestedTable = new THREE.Mesh(
      new RoundedBoxGeometry(0.58, 0.22, 0.58, 6, 0.02),
      new THREE.MeshStandardMaterial({
        map: flutedWoodTex,
        roughness: 0.45,
        metalness: 0.1,
      })
    );
    nestedTable.position.set(-0.68, 0.12, 0.32);
    nestedTable.rotation.y = 0.14;
    nestedTable.castShadow = true;
    nestedTable.receiveShadow = true;
    tableGroup.add(nestedTable);

    // 3.c Curated Tabletop Styling: Stacked Architectural Monographs
    const book1Mat = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.45 });
    const book1 = new THREE.Mesh(new RoundedBoxGeometry(0.28, 0.032, 0.36, 4, 0.008), book1Mat);
    book1.position.set(-0.25, 0.365, 0.05);
    book1.rotation.y = -0.08;
    book1.castShadow = true;
    tableGroup.add(book1);

    const book2Mat = new THREE.MeshStandardMaterial({ color: 0x1e2129, roughness: 0.4 });
    const book2 = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.026, 0.32, 4, 0.008), book2Mat);
    book2.position.set(-0.24, 0.395, 0.06);
    book2.rotation.y = 0.06;
    book2.castShadow = true;
    tableGroup.add(book2);

    // Handcrafted Low Ribbed Ceramic Centerpiece Bowl
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0x303642, roughness: 0.3, metalness: 0.08 });
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.07, 0.045, 24), bowlMat);
    bowl.position.set(0.32, 0.37, -0.06);
    bowl.castShadow = true;
    tableGroup.add(bowl);

    // Brushed Brass Sculptural Ring in Bowl
    const bowlDeco = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 12, 24), brassTrimMat);
    bowlDeco.position.set(0.32, 0.38, -0.06);
    bowlDeco.rotation.x = Math.PI / 3;
    tableGroup.add(bowlDeco);

    scene.add(tableGroup);

    // 4. Low Sculptural Lounge Armchair (Left Side, Angled Inward)
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-2.2, 0, 0.6);
    chairGroup.rotation.y = -Math.PI / 5.2;

    // Soft Ambient Contact Shadow under Chair
    const chairShadow = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), contactShadowMat);
    chairShadow.rotation.x = -Math.PI / 2;
    chairShadow.position.set(0, 0.013, 0);
    chairGroup.add(chairShadow);

    // 4.a Thick Ergonomic Rounded Seat Cushion
    const chairSeat = new THREE.Mesh(
      new RoundedBoxGeometry(0.82, 0.18, 0.76, 8, 0.06),
      luxuryBoucleMat
    );
    chairSeat.position.set(0, 0.26, 0);
    chairSeat.castShadow = true;
    chairSeat.receiveShadow = true;
    chairGroup.add(chairSeat);

    // 4.b Gently Reclined Ergonomic Backrest
    const chairBack = new THREE.Mesh(
      new RoundedBoxGeometry(0.78, 0.42, 0.16, 8, 0.055),
      luxuryBoucleMat
    );
    chairBack.position.set(0, 0.50, -0.28);
    chairBack.rotation.x = -0.15;
    chairBack.castShadow = true;
    chairBack.receiveShadow = true;
    chairGroup.add(chairBack);

    // 4.c Lumbar Support Pillow
    const chairLumbar = new THREE.Mesh(
      new RoundedBoxGeometry(0.52, 0.22, 0.11, 8, 0.045),
      pillowMatTerracotta
    );
    chairLumbar.position.set(0, 0.38, -0.21);
    chairLumbar.rotation.x = -0.12;
    chairLumbar.castShadow = true;
    chairGroup.add(chairLumbar);

    // 4.d Tapered Walnut Legs with Solid Brushed Brass Ferrules
    const legLength = 0.26;
    const legMat = walnutFrameMat;
    const ferruleMat = brassTrimMat;

    const legCoords = [
      { x: -0.32, z: 0.28, rotX: 0.12, rotZ: -0.12 },
      { x: 0.32, z: 0.28, rotX: 0.12, rotZ: 0.12 },
      { x: -0.32, z: -0.28, rotX: -0.14, rotZ: -0.12 },
      { x: 0.32, z: -0.28, rotX: -0.14, rotZ: 0.12 },
    ];

    legCoords.forEach(({ x, z, rotX, rotZ }) => {
      const legAssembly = new THREE.Group();
      legAssembly.position.set(x, 0.14, z);
      legAssembly.rotation.set(rotX, 0, rotZ);

      // Tapered Walnut Upper Leg
      const legUpper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.016, legLength, 16),
        legMat
      );
      legUpper.castShadow = true;
      legAssembly.add(legUpper);

      // Brushed Brass Ferrule Foot Cap
      const ferrule = new THREE.Mesh(
        new THREE.CylinderGeometry(0.017, 0.015, 0.05, 16),
        ferruleMat
      );
      ferrule.position.y = -legLength * 0.42;
      legAssembly.add(ferrule);

      chairGroup.add(legAssembly);
    });

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

    // 10. TV Screen Luminous OLED Emissive & Ambilight Bias
    if (tvScreenMatRef.current) {
      if (tvOn) {
        tvScreenMatRef.current.emissiveIntensity = isNight ? 0.35 : 0.45;
        tvScreenMatRef.current.color.setHex(0xffffff);
      } else {
        tvScreenMatRef.current.emissiveIntensity = 0.0;
        tvScreenMatRef.current.color.setHex(0x06070a);
      }
    }
    if (tvBiasMeshRef.current) {
      tvBiasMeshRef.current.visible = tvOn;
    }
    if (tvBiasLightRef.current) {
      tvBiasLightRef.current.intensity = tvOn ? 0.85 : 0;
    }
    if (tvLedMeshRef.current) {
      tvLedMeshRef.current.material.color.setHex(tvOn ? 0x22c55e : 0xef4444);
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
    tvOn,
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
        } else if (obj.name.includes('TV')) {
          setTvOn((prev) => !prev);
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
        if (obj.name.includes('TV')) {
          foundName = tvOn ? 'Smart TV (Tap to Turn Off)' : 'Smart TV (Tap to Turn On)';
        } else {
          foundName = obj.name;
        }
      }
    }
    setHoveredObject(foundName);
  }, [tvOn]);

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
    } else if (viewKey === 'tv' || viewKey === 'art') {
      // Focused Smart OLED TV & marble feature wall view
      targetCamPosRef.current.set(1.4, 1.8, 0.8);
      targetCamLookRef.current.set(1.65, 1.75, -3.6);
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
          className={`cam-pill ${activeCameraView === 'tv' || activeCameraView === 'art' ? 'active' : ''}`}
          onClick={() => setCameraView('tv')}
        >
          📺 Smart TV
        </button>
      </nav>
    </div>
  );
}
