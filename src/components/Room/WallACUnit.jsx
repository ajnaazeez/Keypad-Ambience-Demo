import React, { useState } from 'react';
import './WallACUnit.css';

/**
 * WallACUnit Component
 * 
 * Renders an architectural wall-mounted slimline indoor AC unit.
 * Features:
 * - Hidden digital LED display that illuminates when ON (e.g. "22°C" + mode icon)
 * - Motorized deflector louver vane that pivots open when turned ON
 * - Animated, organic airflow streams wafting into the room:
 *   - Cool: Frosted glacial ice-blue breeze
 *   - Dry: Dehumidifying soft teal stream
 *   - Fan: Crisp clean neutral-white aeration
 * - Airflow speed & stream wave frequency scale with selected fan speed
 * - Interactive hover HUD & click trigger
 */
export default function WallACUnit({
  acState = { on: false, temp: 22, mode: 'cool', fanSpeed: 'med' },
  onToggle,
  onOpenControls,
}) {
  const { on, temp, mode, fanSpeed } = acState;
  const [isHovered, setIsHovered] = useState(false);

  // Mode glyph
  const getModeGlyph = () => {
    switch (mode) {
      case 'cool': return '❄';
      case 'dry': return '💧';
      case 'fan': return '💨';
      default: return '❄';
    }
  };

  const handleClick = () => {
    if (onOpenControls) {
      onOpenControls('ac');
    } else if (onToggle) {
      onToggle();
    }
  };

  return (
    <div
      className={`wall-ac-fixture ${on ? 'is-active' : 'is-idle'} mode-${mode} speed-${fanSpeed}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Air Conditioner: ${on ? `${temp}°C, ${mode} mode, ${fanSpeed} fan` : 'Off'}. Click to adjust.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Wall Mounting Shadow */}
      <div className="ac-wall-shadow" />

      {/* Main Architectural Slim Indoor Unit Chassis */}
      <div className="ac-chassis">
        {/* Top Air Intake Grille */}
        <div className="ac-intake-grille">
          <span className="grille-slat" />
          <span className="grille-slat" />
          <span className="grille-slat" />
        </div>

        {/* Front Sculpted Matte Casing */}
        <div className="ac-front-panel">
          {/* Subtle LUMINA Climate Micro-Logo */}
          <span className="ac-brand-mark">LUMINA CLIMATE</span>

          {/* Hidden Digital Display (Visible when ON) */}
          <div className={`ac-digital-display ${on ? 'display-lit' : ''}`}>
            <span className="display-temp">{temp}</span>
            <span className="display-unit">°C</span>
            <span className="display-mode-icon">{getModeGlyph()}</span>
            <span className="display-fan-bars">
              <i className={`bar ${fanSpeed === 'low' || fanSpeed === 'med' || fanSpeed === 'high' || fanSpeed === 'auto' ? 'lit' : ''}`} />
              <i className={`bar ${fanSpeed === 'med' || fanSpeed === 'high' || fanSpeed === 'auto' ? 'lit' : ''}`} />
              <i className={`bar ${fanSpeed === 'high' || fanSpeed === 'auto' ? 'lit' : ''}`} />
            </span>
          </div>

          {/* Micro Status LED Ring */}
          <div className={`ac-status-led ${on ? 'led-on' : ''}`} />
        </div>

        {/* Bottom Motorized Deflector Flap / Louver */}
        <div className={`ac-louver-vane ${on ? 'louver-open' : 'louver-closed'}`}>
          <div className="louver-lip" />
        </div>
      </div>

      {/* Smart Home Circular Airflow Visualization (Concentric Ripple Arcs) */}
      {on && (
        <div className="ac-airflow-container" aria-hidden="true">
          <svg className="ac-circular-airflow-svg" viewBox="0 0 280 200" fill="none">
            {/* Concentric curved wavefront arcs radiating outward */}
            <path className="circular-arc arc-1" d="M 30,10 A 80,80 0 0,0 150,130" />
            <path className="circular-arc arc-2" d="M 45,8 A 120,120 0 0,0 200,155" />
            <path className="circular-arc arc-3" d="M 60,6 A 160,160 0 0,0 245,178" />
            <path className="circular-arc arc-4" d="M 75,4 A 200,200 0 0,0 275,195" />
          </svg>
          <div className="airflow-circular-aura" />
        </div>
      )}

      {/* Permanent Architectural Identification Beacon */}
      <div className={`ac-beacon-pill ${on ? 'is-on' : 'is-standby'}`}>
        <span className="beacon-dot" />
        <span className="beacon-label">Wall AC</span>
        <span className="beacon-val">{on ? `${temp}°C ${mode.toUpperCase()}` : 'OFF'}</span>
      </div>

      {/* Interactive Room HUD Badge on Hover */}
      <div className={`ac-hover-badge ${isHovered ? 'badge-visible' : ''}`}>
        <span className="badge-icon">❄</span>
        <span className="badge-text">
          AC · {on ? `${temp}°C ${mode.toUpperCase()} · ${fanSpeed.toUpperCase()}` : 'Standby'}
        </span>
        <span className="badge-action">Tap to Toggle</span>
      </div>
    </div>
  );
}
