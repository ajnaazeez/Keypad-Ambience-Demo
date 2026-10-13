import React, { useState, useEffect } from 'react';
import './KeypadCrownDisplay.css';

/**
 * KeypadCrownDisplay Component
 * 
 * Clean, modern architectural capsule OLED display mounted above the keypad.
 * Dedicated exclusively to smart home comfort controls: FAN, AC, and CURTAINS.
 * (Light, Switch, and Relax have been removed per user instructions.)
 * 
 * Features:
 * 1. Transparent/dark mounting frame (zero white background plate).
 * 2. Fan Live Control View (matching user's reference image):
 *    - Large bold speed number on top: 1, 2, 3, 4 (or OFF)
 *    - Horizontal row of 4 oval speed pill buttons: (1) (2) (3) (4)
 *    - Active speed levels highlighted in solid electric blue (#2563eb) with white text.
 *    - Side companion items: AC (blue snowflake when ON) & Curtain (green when OPEN).
 * 3. AC Live Control View:
 *    - AC [ON]/[OFF] pill badge + large bold 22°C readout + stepper controls.
 *    - Side companion items: Fan & Curtain.
 * 4. Curtain Live Control View:
 *    - Status title ("Open" / "Closed") + interactive slider + [Close], [Pause], [Open] action pills.
 *    - Side companion items: Fan & AC.
 * 5. Overview View:
 *    - Real-time status for Fan (orange when ON), AC (blue when ON), Curtain (green when OPEN).
 */
export default function KeypadCrownDisplay({
  fanState = { on: false, speed: 2 },
  acState = { on: false, temp: 22, mode: 'cool' },
  curtainState = { position: 0, isOpen: false },
  lastInteraction = null,
  onControlAction,
  onStepCurtain,
  onSetFanSpeed,
}) {
  // Active view: 'fan' | 'ac' | 'curtain' | 'overview'
  // Default to 'fan' to prominently display the fan crown screen requested
  const [activeView, setActiveView] = useState('fan');
  const [prevInteraction, setPrevInteraction] = useState(lastInteraction);

  // Derive active view when lastInteraction changes
  if (lastInteraction !== prevInteraction) {
    setPrevInteraction(lastInteraction);
    if (lastInteraction && lastInteraction.type !== 'ready') {
      if (lastInteraction.type === 'fan') {
        setActiveView('fan');
      } else if (lastInteraction.type === 'ac') {
        setActiveView('ac');
      } else if (lastInteraction.type === 'curtain') {
        setActiveView('curtain');
      }
    }
  }

  // Automatically cycle or stay on current view
  useEffect(() => {
    if (activeView === 'fan') return;
    const timer = setTimeout(() => {
      // Return to fan view after 9 seconds of inactivity
      setActiveView('fan');
    }, 9000);
    return () => clearTimeout(timer);
  }, [activeView, lastInteraction]);

  const isAcOn = Boolean(acState.on);
  const isFanOn = Boolean(fanState.on);
  const isCurtainOpen = curtainState.position > 0;
  const currentSpeed = isFanOn ? (fanState.speed || 2) : 0;

  // Handle fan pill click
  const handlePillClick = (spd, e) => {
    e.stopPropagation();
    onSetFanSpeed?.(spd);
  };

  return (
    <div className="keypad-crown-wrapper">
      {/* Sleek Bezel Mount (Zero White Background) */}
      <div className="crown-mount-frame">
        {/* Capsule Pill OLED Display Strip */}
        <div
          className={`crown-capsule-display view-${activeView}`}
          role="region"
          aria-label="Smart Home Capsule OLED Crown Display"
        >
          {/* Glass Specular Gloss Glare */}
          <div className="capsule-glass-glare" aria-hidden="true" />

          {/* =========================================================================
              VIEW 1: FAN LIVE CONTROL (Matches Example Reference Image Exactly!)
              - Left: Large speed number (2) + 4 Pill Buttons (1) (2) (3) (4)
              - Right: AC (snowflake) & Curtain (drapes)
              ========================================================================= */}
          {activeView === 'fan' && (
            <>
              {/* Left Side: Fan Speed Display & 4 Pill Selectors */}
              <div
                className="crown-fan-live-view"
                onClick={() => onControlAction?.('fan', 'Ceiling Fan')}
                role="button"
                tabIndex={0}
                title="Toggle Fan Power"
              >
                {/* Large Speed Number */}
                <span className="fan-speed-large-num">
                  {isFanOn ? currentSpeed : 'OFF'}
                </span>

                {/* 4 Pill Buttons Row (1) (2) (3) (4) */}
                <div className="fan-pills-row" onClick={(e) => e.stopPropagation()}>
                  {[1, 2, 3, 4].map((spd) => {
                    const isActive = isFanOn && currentSpeed >= spd;
                    return (
                      <button
                        key={spd}
                        type="button"
                        className={`fan-pill-btn ${isActive ? 'is-active' : ''}`}
                        onClick={(e) => handlePillClick(spd, e)}
                        title={`Set Fan Speed ${spd}`}
                        aria-pressed={isActive}
                      >
                        {spd}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: AC & Curtain Companion Chips (NO Switch, Lights, or Relax!) */}
              <div className="crown-side-chips-col">
                {/* AC Status Chip */}
                <div
                  className={`status-chip-row ${isAcOn ? 'is-active is-ac' : ''}`}
                  onClick={() => {
                    onControlAction?.('ac', 'Wall AC');
                    setActiveView('ac');
                  }}
                  role="button"
                  tabIndex={0}
                  title="Open AC Controls"
                >
                  <span className="chip-icon icon-ac" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M8 1v14M1 8h14M3 3l10 10M13 3L3 13" strokeLinecap="round" />
                      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="chip-label">AC</span>
                </div>

                {/* Curtain Status Chip */}
                <div
                  className={`status-chip-row ${isCurtainOpen ? 'is-active is-curtain' : ''}`}
                  onClick={() => {
                    onControlAction?.('curtain', 'Curtains');
                    setActiveView('curtain');
                  }}
                  role="button"
                  tabIndex={0}
                  title="Open Curtain Controls"
                >
                  <span className="chip-icon icon-curtain" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="2" y="2" width="12" height="12" rx="1.5" />
                      <path d="M2 2c2.5 3 2.5 7 0 10M14 2c-2.5 3-2.5 7 0 10" strokeLinecap="round" />
                      <line x1="8" y1="2" x2="8" y2="14" strokeDasharray="1.5 1.5" />
                    </svg>
                  </span>
                  <span className="chip-label">Curtain</span>
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              VIEW 2: AC LIVE CONTROL
              - Left: Fan & Curtain Companion Chips
              - Right: AC [ON]/[OFF] + 22°C + Steppers
              ========================================================================= */}
          {activeView === 'ac' && (
            <>
              {/* Left Side: Fan & Curtain Companion Chips */}
              <div className="crown-side-chips-col">
                <div
                  className={`status-chip-row ${isFanOn ? 'is-active is-fan' : ''}`}
                  onClick={() => setActiveView('fan')}
                  role="button"
                  tabIndex={0}
                  title="Open Fan Controls"
                >
                  <span className="chip-icon icon-fan" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                      <circle cx="8" cy="8" r="2.2" />
                      <path d="M8 5.8a2.2 2.2 0 1 0-2.2-2.2v2.2H8zm2.2 2.2a2.2 2.2 0 1 0 2.2-2.2H10.2v2.2zm-2.2 2.2a2.2 2.2 0 1 0 2.2 2.2v-2.2H8zm-2.2-2.2a2.2 2.2 0 1 0-2.2 2.2h2.2V8z" />
                    </svg>
                  </span>
                  <span className="chip-label">Fan</span>
                </div>

                <div
                  className={`status-chip-row ${isCurtainOpen ? 'is-active is-curtain' : ''}`}
                  onClick={() => setActiveView('curtain')}
                  role="button"
                  tabIndex={0}
                  title="Open Curtain Controls"
                >
                  <span className="chip-icon icon-curtain" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="2" y="2" width="12" height="12" rx="1.5" />
                      <path d="M2 2c2.5 3 2.5 7 0 10M14 2c-2.5 3-2.5 7 0 10" strokeLinecap="round" />
                      <line x1="8" y1="2" x2="8" y2="14" strokeDasharray="1.5 1.5" />
                    </svg>
                  </span>
                  <span className="chip-label">Curtain</span>
                </div>
              </div>

              {/* Right Side: AC Live Details */}
              <div className="crown-right-ac-view" onClick={(e) => e.stopPropagation()}>
                <div className="ac-header-row">
                  <span className="ac-title-text">AC</span>
                  <button
                    type="button"
                    className={`ac-pill-badge ${isAcOn ? 'badge-on' : 'badge-off'}`}
                    onClick={() => onControlAction?.('ac', 'Wall AC')}
                    title="Toggle AC Power"
                  >
                    {isAcOn ? 'ON' : 'OFF'}
                  </button>
                </div>
                <div className="ac-temp-row">
                  <button
                    type="button"
                    className="ac-temp-stepper"
                    onClick={() => onControlAction?.('ac-down', 'Temp Down')}
                    title="Decrease Temp"
                  >
                    −
                  </button>
                  <span className="ac-temp-number">{acState.temp}°C</span>
                  <button
                    type="button"
                    className="ac-temp-stepper"
                    onClick={() => onControlAction?.('ac-up', 'Temp Up')}
                    title="Increase Temp"
                  >
                    +
                  </button>
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              VIEW 3: CURTAIN LIVE CONTROL
              - Left: Fan & AC Companion Chips
              - Right: "Open" status + Slider + [Close], [Pause], [Open]
              ========================================================================= */}
          {activeView === 'curtain' && (
            <>
              {/* Left Side: Fan & AC Companion Chips */}
              <div className="crown-side-chips-col">
                <div
                  className={`status-chip-row ${isFanOn ? 'is-active is-fan' : ''}`}
                  onClick={() => setActiveView('fan')}
                  role="button"
                  tabIndex={0}
                  title="Open Fan Controls"
                >
                  <span className="chip-icon icon-fan" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                      <circle cx="8" cy="8" r="2.2" />
                      <path d="M8 5.8a2.2 2.2 0 1 0-2.2-2.2v2.2H8zm2.2 2.2a2.2 2.2 0 1 0 2.2-2.2H10.2v2.2zm-2.2 2.2a2.2 2.2 0 1 0 2.2 2.2v-2.2H8zm-2.2-2.2a2.2 2.2 0 1 0-2.2 2.2h2.2V8z" />
                    </svg>
                  </span>
                  <span className="chip-label">Fan</span>
                </div>

                <div
                  className={`status-chip-row ${isAcOn ? 'is-active is-ac' : ''}`}
                  onClick={() => setActiveView('ac')}
                  role="button"
                  tabIndex={0}
                  title="Open AC Controls"
                >
                  <span className="chip-icon icon-ac" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M8 1v14M1 8h14M3 3l10 10M13 3L3 13" strokeLinecap="round" />
                      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="chip-label">AC</span>
                </div>
              </div>

              {/* Right Side: Curtain Slider & Action Pills */}
              <div className="crown-right-curtain-view" onClick={(e) => e.stopPropagation()}>
                <div className="curtain-header-row">
                  <span className="curtain-title-text">
                    {curtainState.position === 100 ? 'Open' : curtainState.position === 0 ? 'Closed' : `${curtainState.position}%`}
                  </span>
                </div>

                {/* Slider track with closed and open curtain icons */}
                <div className="curtain-slider-row">
                  <span className="slider-icon icon-shutter-closed" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                      <rect x="1" y="2" width="14" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.4" />
                      <line x1="1" y1="5" x2="15" y2="5" stroke="currentColor" strokeWidth="1.2" />
                      <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.2" />
                      <line x1="1" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </span>

                  <div className="curtain-track-wrap">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={curtainState.position}
                      onChange={(e) => onStepCurtain?.(Number(e.target.value))}
                      className="curtain-range-input"
                      aria-label="Curtain Position"
                    />
                    <div className="curtain-track-bg">
                      <div
                        className="curtain-track-fill"
                        style={{ width: `${curtainState.position}%` }}
                      />
                      <div
                        className="curtain-track-thumb"
                        style={{ left: `${curtainState.position}%` }}
                      />
                    </div>
                  </div>

                  <span className="slider-icon icon-drapes-open" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="2" y="2" width="12" height="12" rx="1.5" />
                      <path d="M2 2c2.5 3 2.5 7 0 10M14 2c-2.5 3-2.5 7 0 10" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>

                {/* 3 action pill buttons: [Close] | [Pause] | [Open (Blue)] */}
                <div className="curtain-actions-row">
                  <button
                    type="button"
                    className={`curtain-action-btn ${curtainState.position === 0 ? 'is-active-btn is-blue' : ''}`}
                    onClick={() => onStepCurtain?.(0)}
                    title="Close Curtains"
                  >
                    <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                      <rect x="2" y="2" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.4" />
                      <line x1="2" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.2" />
                      <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2" />
                      <line x1="2" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className={`curtain-action-btn ${curtainState.position > 0 && curtainState.position < 100 ? 'is-active-btn is-blue' : ''}`}
                    onClick={() => onStepCurtain?.(curtainState.position)}
                    title="Pause Curtains"
                  >
                    <svg viewBox="0 0 16 16" width="9" height="9" fill="currentColor">
                      <rect x="3.5" y="3" width="2.8" height="10" rx="0.8" />
                      <rect x="9.7" y="3" width="2.8" height="10" rx="0.8" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className={`curtain-action-btn ${curtainState.position === 100 ? 'is-active-btn is-blue' : ''}`}
                    onClick={() => onStepCurtain?.(100)}
                    title="Open Curtains"
                  >
                    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="2" y="2" width="12" height="12" rx="1" />
                      <path d="M2 2c2 3 2 7 0 10M14 2c-2.5 3-2.5 7 0 10" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
