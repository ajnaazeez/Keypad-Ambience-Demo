import React from 'react';
import './ComfortControls.css';

/**
 * ComfortControls Component
 * 
 * Direct physical wall-mounted controls for Fan, AC, and Curtains:
 * - Fan: Power toggle + direct speed selector buttons (1, 2, 3, 4, 5) matching demo.islandseries.in
 * - AC: Power toggle + direct temperature stepper (− / +) + modes (Cool ❄, Dry 💧, Fan 💨)
 * - Curtains: Direct Open and Close tactile buttons with travel status
 * 
 * Operates directly on the devices in the room without opening any modal menus!
 */
export default function ComfortControls({
  fanState = { on: false, speed: 3 },
  onUpdateFan,
  acState = { on: false, temp: 22, mode: 'cool' },
  onUpdateAC,
  curtainState = { position: 100, isOpen: true },
  onUpdateCurtain,
}) {
  return (
    <div className="comfort-controls-panel" role="region" aria-label="Fan, AC, and Curtain Controls">
      {/* ============================================================== */}
      {/* 1. CEILING FAN CONTROLS */}
      {/* ============================================================== */}
      <div className="comfort-section section-fan">
        <div className="section-header">
          <div className="section-title-group">
            <span className="section-icon">🌀</span>
            <span className="section-title">Ceiling Fan</span>
          </div>
          <button
            type="button"
            className={`comfort-power-btn ${fanState.on ? 'is-on' : ''}`}
            onClick={() => onUpdateFan?.({ ...fanState, on: !fanState.on })}
            aria-label={`Fan power: ${fanState.on ? 'ON' : 'OFF'}`}
          >
            <span className="power-led" />
            <span className="power-text">{fanState.on ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Speed Level Buttons 1 to 5 (Matching demo.islandseries.in) */}
        <div className="fan-speed-bar" role="group" aria-label="Fan Speed Levels">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              type="button"
              className={`fan-speed-step ${fanState.on && fanState.speed >= lvl ? 'step-active' : ''} ${fanState.on && fanState.speed === lvl ? 'step-current' : ''}`}
              onClick={() => onUpdateFan?.({ on: true, speed: lvl })}
              aria-label={`Fan speed ${lvl}`}
            >
              <span className="step-num">{lvl}</span>
            </button>
          ))}
          <span className="fan-rpm-badge">
            {fanState.on ? `Speed ${fanState.speed}` : 'Standby'}
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. WALL AC CLIMATE CONTROLS */}
      {/* ============================================================== */}
      <div className="comfort-section section-ac">
        <div className="section-header">
          <div className="section-title-group">
            <span className="section-icon">❄</span>
            <span className="section-title">Climate AC</span>
          </div>
          <button
            type="button"
            className={`comfort-power-btn ${acState.on ? 'is-on' : ''}`}
            onClick={() => onUpdateAC?.({ ...acState, on: !acState.on })}
            aria-label={`AC power: ${acState.on ? 'ON' : 'OFF'}`}
          >
            <span className="power-led" />
            <span className="power-text">{acState.on ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="ac-controls-row">
          {/* Temperature Stepper (- / +) */}
          <div className="ac-temp-cluster">
            <button
              type="button"
              className="temp-btn btn-down"
              disabled={acState.temp <= 16}
              onClick={() => onUpdateAC?.({ ...acState, temp: Math.max(16, acState.temp - 1), on: true })}
              aria-label="Decrease temperature"
            >
              −
            </button>
            <div className="temp-value-display">
              <span className="temp-number">{acState.temp}</span>
              <span className="temp-deg">°C</span>
            </div>
            <button
              type="button"
              className="temp-btn btn-up"
              disabled={acState.temp >= 30}
              onClick={() => onUpdateAC?.({ ...acState, temp: Math.min(30, acState.temp + 1), on: true })}
              aria-label="Increase temperature"
            >
              +
            </button>
          </div>

          {/* AC Modes (Cool, Dry, Fan) */}
          <div className="ac-modes-row">
            {[
              { id: 'cool', label: 'Cool ❄' },
              { id: 'dry',  label: 'Dry 💧' },
              { id: 'fan',  label: 'Fan 💨' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                className={`ac-mode-btn ${acState.mode === m.id ? 'mode-active' : ''}`}
                onClick={() => onUpdateAC?.({ ...acState, mode: m.id, on: true })}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. WINDOW CURTAINS CONTROLS */}
      {/* ============================================================== */}
      <div className="comfort-section section-curtain">
        <div className="section-header">
          <div className="section-title-group">
            <span className="section-icon">🪟</span>
            <span className="section-title">Window Curtains</span>
          </div>
          <span className="curtain-pos-tag">
            {curtainState.position === 100 ? '100% Open' : curtainState.position === 0 ? 'Closed' : `${curtainState.position}%`}
          </span>
        </div>

        <div className="curtain-controls-row">
          <button
            type="button"
            className={`curtain-btn ${curtainState.position === 100 ? 'is-active' : ''}`}
            onClick={() => onUpdateCurtain?.({ position: 100, isOpen: true })}
          >
            <span className="btn-icon">◧</span>
            <span>Open Curtains</span>
          </button>

          <button
            type="button"
            className={`curtain-btn ${curtainState.position === 0 ? 'is-active' : ''}`}
            onClick={() => onUpdateCurtain?.({ position: 0, isOpen: false })}
          >
            <span className="btn-icon">■</span>
            <span>Close Curtains</span>
          </button>
        </div>
      </div>
    </div>
  );
}
