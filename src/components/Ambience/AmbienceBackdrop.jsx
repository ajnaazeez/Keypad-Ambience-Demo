import React from 'react';
import roomImage from '../../assets/luxury_living_room.jpg';
import './AmbienceBackdrop.css';

/**
 * AmbienceBackdrop Component
 * 
 * Renders an ultra-luxury architectural living room interior with dynamic
 * layered lighting and signature ambience scene transformations:
 * - Chandelier: Warm golden focal crystal radiance centered on dining/living (2700K)
 * - Spotlights: Dramatic directional architectural downlight cones (3000K)
 * - Cove: Perimeter ceiling tray indirect channel illumination (2800K)
 * - Main Light: Broad neutral-white task ceiling wash (4000K)
 * - Ceiling: Indirect upward architectural canopy wash (3000K)
 * - Relax Scene: Sunset amber evening sanctuary (2200K)
 * - Master Living On: Full calibrated architectural harmony (3200K)
 * - Nighttime Standby: Calm twilight night mode
 */
export default function AmbienceBackdrop({
  circuits = {},
  activeScene = 'living-off',
  activeHold = null,
}) {
  // Current active scene ambience (or button actively held)
  const currentScene = activeHold || activeScene;

  // Standby flag
  const isStandby = Boolean(circuits['living-off']) && !activeHold;

  // Individual circuit illumination flags
  const isMainOn = Boolean(circuits['main-light']);
  const isCeilingOn = Boolean(circuits['ceiling']);
  const isChandelierOn = Boolean(circuits['chandelier']) || Boolean(circuits['relax']);
  const isSpotlightsOn = Boolean(circuits['spotlights']);
  const isCoveOn = Boolean(circuits['cove']) || Boolean(circuits['relax']);
  const isRelaxOn = Boolean(circuits['relax']);
  const isMasterOn = Boolean(circuits['living-on']);

  // Distinct room atmosphere mood class
  let roomMoodClass = 'mood-default';
  if (isStandby) {
    roomMoodClass = 'mood-standby';
  } else if (currentScene === 'chandelier') {
    roomMoodClass = 'mood-chandelier';
  } else if (currentScene === 'spotlights') {
    roomMoodClass = 'mood-spotlights';
  } else if (currentScene === 'cove') {
    roomMoodClass = 'mood-cove';
  } else if (currentScene === 'main-light') {
    roomMoodClass = 'mood-main-light';
  } else if (currentScene === 'ceiling') {
    roomMoodClass = 'mood-ceiling';
  } else if (currentScene === 'relax') {
    roomMoodClass = 'mood-relax';
  } else if (currentScene === 'living-on') {
    roomMoodClass = 'mood-master';
  } else if (isRelaxOn) {
    roomMoodClass = 'mood-relax';
  } else if (isMasterOn) {
    roomMoodClass = 'mood-master';
  }

  return (
    <div
      className={`ambience-canvas ${isStandby ? 'mode-standby' : 'mode-active'} ${activeHold ? `hold-${activeHold}` : ''} scene-${currentScene}`}
      aria-hidden="true"
    >
      {/* 1. Photorealistic Luxury Living Room Base Layer */}
      <div
        className={`ambience-room-photo ${roomMoodClass}`}
        style={{ backgroundImage: `url(${roomImage})` }}
      />

      {/* 2. Nightfall Standby Tint */}
      <div className={`ambience-layer layer-night-standby ${isStandby ? 'is-active' : ''}`} />

      {/* 3. Main Light: 4000K Neutral-White Clean Ceiling Wash */}
      <div
        className={`ambience-layer layer-main-light ${isMainOn ? 'is-lit' : ''} ${currentScene === 'main-light' ? 'is-focused' : ''} ${activeHold === 'main-light' ? 'is-holding' : ''}`}
      />

      {/* 4. Ceiling: 3000K Soft Indirect Upward Ceiling Canopy Wash */}
      <div
        className={`ambience-layer layer-ceiling ${isCeilingOn ? 'is-lit' : ''} ${currentScene === 'ceiling' ? 'is-focused' : ''} ${activeHold === 'ceiling' ? 'is-holding' : ''}`}
      />

      {/* 5. Chandelier: 2700K Warm Golden Crystal Radiance & Table Downlight */}
      <div
        className={`ambience-layer layer-chandelier ${isChandelierOn ? 'is-lit' : ''} ${currentScene === 'chandelier' ? 'is-focused' : ''} ${activeHold === 'chandelier' ? 'is-holding' : ''}`}
      >
        <span className="chandelier-core-bloom" />
        <span className="chandelier-down-wash" />
      </div>

      {/* 6. Spotlights: Realistic Architectural Recessed Downlight Cones */}
      <div
        className={`ambience-layer layer-spotlights ${isSpotlightsOn ? 'is-lit' : ''} ${currentScene === 'spotlights' ? 'is-focused' : ''} ${activeHold === 'spotlights' ? 'is-holding' : ''}`}
      >
        {/* Spotlight 1: Feature Wall & Artwork Scallop (over fireplace) */}
        <div className="spot-fixture spot-wall-art">
          <span className="spot-emitter" />
          <span className="spot-beam" />
          <span className="spot-wall-wash" />
        </div>

        {/* Spotlight 2: Lounge Seating Downlight (armchair area) */}
        <div className="spot-fixture spot-lounge-chair">
          <span className="spot-emitter" />
          <span className="spot-beam" />
          <span className="spot-floor-pool" />
        </div>

        {/* Spotlight 3: Hallway Column Downlight (left corridor) */}
        <div className="spot-fixture spot-hallway-run">
          <span className="spot-emitter" />
          <span className="spot-beam" />
          <span className="spot-floor-pool" />
        </div>

        {/* Spotlight 4: Center-Right Table Downlight */}
        <div className="spot-fixture spot-center-table">
          <span className="spot-emitter" />
          <span className="spot-beam" />
          <span className="spot-floor-pool" />
        </div>

        {/* Spotlight 5: Right Window & Piano Downlight */}
        <div className="spot-fixture spot-window-column">
          <span className="spot-emitter" />
          <span className="spot-beam" />
          <span className="spot-floor-pool" />
        </div>
      </div>

      {/* 7. Cove: Architectural Ceiling Perimeter Tray LED Channel */}
      <div
        className={`ambience-layer layer-cove ${isCoveOn ? 'is-lit' : ''} ${currentScene === 'cove' ? 'is-focused' : ''} ${activeHold === 'cove' ? 'is-holding' : ''}`}
      >
        <span className="cove-tray-glow" />
      </div>

      {/* 8. Relax Scene: 2200K Sunset Amber Soft Evening Mood */}
      <div
        className={`ambience-layer layer-relax ${isRelaxOn ? 'is-lit' : ''} ${currentScene === 'relax' ? 'is-focused' : ''} ${activeHold === 'relax' ? 'is-holding' : ''}`}
      />

      {/* 9. Master Living On: Full Balanced Architectural Showcase (~3200K) */}
      <div
        className={`ambience-layer layer-master-on ${isMasterOn ? 'is-lit' : ''} ${currentScene === 'living-on' ? 'is-focused' : ''} ${activeHold === 'living-on' ? 'is-holding' : ''}`}
      />
    </div>
  );
}
