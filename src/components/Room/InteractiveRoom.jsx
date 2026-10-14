import React from 'react';
import roomImage from '../../assets/luxury_living_room.jpg';
import CeilingFan from './CeilingFan';
import WallACUnit from './WallACUnit';
import WindowCurtains from './WindowCurtains';
import './InteractiveRoom.css';
import '../Ambience/AmbienceBackdrop.css';

/**
 * InteractiveRoom Component
 * 
 * Unifies the photorealistic luxury living room architecture with:
 * 1. Preserved signature architectural lighting engine (chandelier, spotlights, cove, washes, scenes)
 * 2. Visible, animated ceiling fan with rotational speed (1-5) and coasting physics
 * 3. Mounted wall AC unit with digital LED display, motorized louver, and dynamic airflow streams
 * 4. Motorized pleated window curtains that physically slide apart/together
 * 5. Interactive room element triggers (click to toggle or inspect detailed controls)
 */
export default function InteractiveRoom({
  circuits = {},
  activeScene = 'living-on',
  activeHold = null,
  fanState = { on: false, speed: 3 },
  acState = { on: false, temp: 22, mode: 'cool', fanSpeed: 'med' },
  curtainState = { position: 100, isOpen: true },
  onToggleDevice,
  onOpenDeviceControls,
  onToggleFixture,
}) {
  const currentScene = activeHold || activeScene;
  const isStandby = Boolean(circuits['living-off']) && !activeHold;

  // Preserved lighting circuit flags
  const isMainOn = Boolean(circuits['main-light']);
  const isCeilingOn = Boolean(circuits['ceiling']);
  const isChandelierOn = Boolean(circuits['chandelier']) || Boolean(circuits['relax']);
  const isSpotlightsOn = Boolean(circuits['spotlights']);
  const isCoveOn = Boolean(circuits['cove']) || Boolean(circuits['relax']);
  const isRelaxOn = Boolean(circuits['relax']);
  const isMasterOn = Boolean(circuits['living-on']);

  // Room mood class
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
  } else if (currentScene === 'relax' || isRelaxOn) {
    roomMoodClass = 'mood-relax';
  } else if (currentScene === 'living-on' || isMasterOn) {
    roomMoodClass = 'mood-master';
  }

  return (
    <div
      className={`interactive-room-canvas ${isStandby ? 'mode-standby' : 'mode-active'} ${activeHold ? `hold-${activeHold}` : ''} scene-${currentScene}`}
      aria-label="Interactive Luxury Smart Home Living Room"
    >
      {/* 1. Photorealistic Luxury Living Room Base Layer */}
      <div
        className={`ambience-room-photo ${roomMoodClass}`}
        style={{ backgroundImage: `url(${roomImage})` }}
      />

      {/* 2. Preserved Architectural Lighting Layers */}
      <div className={`ambience-layer layer-night-standby ${isStandby ? 'is-active' : ''}`} />

      {/* Main Light: 4000K Neutral-White Clean Ceiling Wash */}
      <div
        className={`ambience-layer layer-main-light ${isMainOn ? 'is-lit' : ''} ${currentScene === 'main-light' ? 'is-focused' : ''} ${activeHold === 'main-light' ? 'is-holding' : ''}`}
      />

      {/* Ceiling: 3000K Indirect Upward Ceiling Canopy Wash */}
      <div
        className={`ambience-layer layer-ceiling ${isCeilingOn ? 'is-lit' : ''} ${currentScene === 'ceiling' ? 'is-focused' : ''} ${activeHold === 'ceiling' ? 'is-holding' : ''}`}
      />

      {/* Chandelier: 2700K Warm Golden Crystal Radiance & Table Downlight */}
      <div
        className={`ambience-layer layer-chandelier ${isChandelierOn ? 'is-lit' : ''} ${currentScene === 'chandelier' ? 'is-focused' : ''} ${activeHold === 'chandelier' ? 'is-holding' : ''}`}
        onClick={() => onToggleFixture?.('chandelier')}
        title="Chandelier (Click to Toggle 2700K Radiance)"
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
      >
        <span className="chandelier-core-bloom" />
        <span className="chandelier-down-wash" />
      </div>

      {/* Spotlights: 5 Directional Recessed Downlight Cones */}
      <div
        className={`ambience-layer layer-spotlights ${isSpotlightsOn ? 'is-lit' : ''} ${currentScene === 'spotlights' ? 'is-focused' : ''} ${activeHold === 'spotlights' ? 'is-holding' : ''}`}
        onClick={() => onToggleFixture?.('spotlights')}
        title="Recessed Spotlights (Click to Toggle 5 Cones)"
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
      >
        <div className="spot-fixture spot-wall-art">
          <span className="spot-emitter" />
          <span className="spot-beam" />
          <span className="spot-wall-wash" />
        </div>
        <div className="spot-fixture spot-lounge-chair">
          <span className="spot-emitter" />
          <span className="spot-beam" />
          <span className="spot-floor-pool" />
        </div>
        <div className="spot-fixture spot-hallway-run">
          <span className="spot-emitter" />
          <span className="spot-beam" />
          <span className="spot-floor-pool" />
        </div>
        <div className="spot-fixture spot-center-table">
          <span className="spot-emitter" />
          <span className="spot-beam" />
          <span className="spot-floor-pool" />
        </div>
        <div className="spot-fixture spot-window-column">
          <span className="spot-emitter" />
          <span className="spot-beam" />
          <span className="spot-floor-pool" />
        </div>
      </div>

      {/* Cove: Architectural Ceiling Perimeter Tray LED Channel */}
      <div
        className={`ambience-layer layer-cove ${isCoveOn ? 'is-lit' : ''} ${currentScene === 'cove' ? 'is-focused' : ''} ${activeHold === 'cove' ? 'is-holding' : ''}`}
        onClick={() => onToggleFixture?.('cove')}
        title="Perimeter Cove (Click to Toggle 2800K Tray LED)"
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
      >
        <span className="cove-tray-glow" />
      </div>

      {/* Relax Scene: 2200K Sunset Amber Soft Evening Mood */}
      <div
        className={`ambience-layer layer-relax ${isRelaxOn ? 'is-lit' : ''} ${currentScene === 'relax' ? 'is-focused' : ''} ${activeHold === 'relax' ? 'is-holding' : ''}`}
      />

      {/* Master Living On: Full Balanced Architectural Showcase */}
      <div
        className={`ambience-layer layer-master-on ${isMasterOn ? 'is-lit' : ''} ${currentScene === 'living-on' ? 'is-focused' : ''} ${activeHold === 'living-on' ? 'is-holding' : ''}`}
      />

      {/* 3. Motorized Window Curtains Covering the Panoramic Terrace Window */}
      <WindowCurtains
        curtainState={curtainState}
        onToggle={() => onToggleDevice?.('curtain')}
        onOpenControls={() => onOpenDeviceControls?.('curtain')}
      />

      {/* 4. Visible Realistic Ceiling Fan with Rotating Blades and Coasting */}
      <CeilingFan
        fanState={fanState}
        onToggle={() => onToggleDevice?.('fan')}
        onOpenControls={() => onOpenDeviceControls?.('fan')}
      />

      {/* 5. Wall-Mounted AC Indoor Unit with LCD Display & Airflow Currents */}
      <WallACUnit
        acState={acState}
        onToggle={() => onToggleDevice?.('ac')}
        onOpenControls={() => onOpenDeviceControls?.('ac')}
      />
    </div>
  );
}
