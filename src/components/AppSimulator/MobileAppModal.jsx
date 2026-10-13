import React, { useState } from 'react';
import './MobileAppModal.css';

/**
 * MobileAppModal Component
 * Companion mobile phone app simulator matching Reference Image 3.
 * Synchronizes with real-time room lighting, fan speed, AC temperature, and motorized curtains.
 */
export default function MobileAppModal({
  isOpen = false,
  onClose,
  circuits = {},
  dimmers = {},
  fanState = { on: true, speed: 2 },
  acState = { on: true, temp: 22, mode: 'cool' },
  curtainState = { position: 100, isOpen: true },
  activeScene = 'living-on',
  onControlAction,
  onStepCurtain,
  onSetFanSpeed,
}) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'switch'

  if (!isOpen) return null;

  const isLightsOn = Boolean(circuits['living-on'] || circuits['lights']);
  const isRelaxOn = Boolean(circuits['relax']);
  const isSpotsOn = Boolean(circuits['spotlights']);

  return (
    <div className="mobile-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Lumina Companion Mobile App">
      <div className="mobile-phone-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button on Top Right Corner of Desktop View */}
        <button
          type="button"
          className="phone-modal-close-btn"
          onClick={onClose}
          aria-label="Close Mobile Simulator"
          title="Close Simulator"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* iPhone Chassis Outer Shell */}
        <div className="phone-device-frame">
          {/* Hardware Side Buttons */}
          <span className="phone-hw-mute" aria-hidden="true" />
          <span className="phone-hw-vol-up" aria-hidden="true" />
          <span className="phone-hw-vol-down" aria-hidden="true" />
          <span className="phone-hw-power" aria-hidden="true" />

          {/* Screen Bezel & Display Viewport */}
          <div className="phone-screen-glass">
            {/* Dynamic Island Notch */}
            <div className="dynamic-island" aria-hidden="true">
              <span className="island-camera" />
              <span className="island-sensor" />
            </div>

            {/* iOS Status Bar */}
            <div className="phone-status-bar">
              <span className="status-time">9:41</span>
              <div className="status-icons">
                {/* Cellular Signal */}
                <svg viewBox="0 0 17 11" width="15" height="10" fill="currentColor">
                  <rect x="0" y="8" width="2.5" height="3" rx="0.5" />
                  <rect x="4.5" y="5.5" width="2.5" height="5.5" rx="0.5" />
                  <rect x="9" y="3" width="2.5" height="8" rx="0.5" />
                  <rect x="13.5" y="0.5" width="2.5" height="10.5" rx="0.5" />
                </svg>
                {/* 5G */}
                <span className="status-5g">5G</span>
                {/* Battery */}
                <svg viewBox="0 0 24 12" width="20" height="10" fill="currentColor">
                  <rect x="1" y="1" width="19" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="3" y="3" width="15" height="6" rx="1.5" />
                  <path d="M21.5 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* App Scrollable Content */}
            <div className="phone-app-viewport">
              {/* App Room Header */}
              <div className="app-room-header">
                <div className="room-title-col">
                  <span className="room-greeting">Lumina Smart Living</span>
                  <h2 className="room-heading">Living Room</h2>
                </div>
                <div className="header-status-pill">
                  <span className={`status-pulse ${isLightsOn ? 'is-live' : ''}`} />
                  <span>{isLightsOn ? 'Connected' : 'Standby'}</span>
                </div>
              </div>

              {/* Segmented Tab Navigation: Home vs Switch (matching Reference Image 3) */}
              <div className="app-segmented-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  className={`app-tab-btn ${activeTab === 'home' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('home')}
                >
                  Home
                </button>
                <button
                  type="button"
                  role="tab"
                  className={`app-tab-btn ${activeTab === 'switch' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('switch')}
                >
                  Switch
                </button>
              </div>

              {/* TAB 1: HOME CONTROLS */}
              {activeTab === 'home' && (
                <div className="app-cards-container">
                  {/* Climate / AC Card */}
                  <div className={`app-device-card ac-card ${acState.on ? 'is-card-active' : ''}`}>
                    <div className="card-top-row">
                      <div className="card-icon-bubble ac-bubble">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M12 2v20M17 5H7M17 19H7M20 9H4M20 15H4" />
                        </svg>
                      </div>
                      <div className="card-meta">
                        <span className="card-title">Air Conditioner</span>
                        <span className="card-sub">{acState.on ? `Cooling • ${acState.temp}°C` : 'Turned Off'}</span>
                      </div>
                      <button
                        type="button"
                        className={`card-toggle-btn ${acState.on ? 'is-on' : ''}`}
                        onClick={() => onControlAction?.('ac', 'Wall AC')}
                        aria-label="Toggle AC"
                      >
                        <span className="toggle-thumb" />
                      </button>
                    </div>

                    {acState.on && (
                      <div className="card-expanded-controls ac-temp-stepper">
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => onControlAction?.('ac-down', 'Wall AC')}
                          title="Decrease Temp"
                        >
                          −
                        </button>
                        <span className="temp-display-val">{acState.temp}°<small>C</small></span>
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => onControlAction?.('ac-up', 'Wall AC')}
                          title="Increase Temp"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Ceiling Fan Card */}
                  <div className={`app-device-card fan-card ${fanState.on ? 'is-card-active' : ''}`}>
                    <div className="card-top-row">
                      <div className={`card-icon-bubble fan-bubble ${fanState.on ? 'is-spinning' : ''}`}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 9C12 5 15 3 17 5s-1 5-5 4z" />
                          <path d="M15 12c4 0 6 3 4 5s-5-1-4-5z" />
                          <path d="M12 15c0 4-3 6-5 4s1-5 5-4z" />
                          <path d="M9 12c-4 0-6-3-4-5s5 1 4 5z" />
                        </svg>
                      </div>
                      <div className="card-meta">
                        <span className="card-title">Ceiling Fan</span>
                        <span className="card-sub">{fanState.on ? `Speed ${fanState.speed} of 4` : 'Off'}</span>
                      </div>
                      <button
                        type="button"
                        className={`card-toggle-btn ${fanState.on ? 'is-on' : ''}`}
                        onClick={() => onControlAction?.('fan', 'Ceiling Fan')}
                        aria-label="Toggle Fan"
                      >
                        <span className="toggle-thumb" />
                      </button>
                    </div>

                    {fanState.on && (
                      <div className="fan-speeds-row">
                        {[1, 2, 3, 4].map((spd) => (
                          <button
                            key={spd}
                            type="button"
                            className={`fan-spd-chip ${fanState.speed === spd ? 'is-selected' : ''}`}
                            onClick={() => onSetFanSpeed?.(spd)}
                          >
                            Spd {spd}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Motorized Curtain Card with Visual Progress Track (matching Reference Image 3) */}
                  <div className={`app-device-card curtain-card ${curtainState.position > 0 ? 'is-card-active' : ''}`}>
                    <div className="card-top-row">
                      <div className="card-icon-bubble curtain-bubble">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <line x1="12" y1="3" x2="12" y2="21" />
                          <path d="M7 8h2m-2 4h2m-2 4h2M15 8h2m-2 4h2m-2 4h2" />
                        </svg>
                      </div>
                      <div className="card-meta">
                        <span className="card-title">Living Curtains</span>
                        <span className="card-sub">{curtainState.position}% Open</span>
                      </div>
                      <button
                        type="button"
                        className={`card-toggle-btn ${curtainState.position > 0 ? 'is-on' : ''}`}
                        onClick={() => onControlAction?.('curtain', 'Curtain')}
                        aria-label="Toggle Curtains"
                      >
                        <span className="toggle-thumb" />
                      </button>
                    </div>

                    {/* Interactive Curtain Track Slider */}
                    <div className="curtain-slider-box">
                      <div className="curtain-track-bg">
                        <div
                          className="curtain-track-fill"
                          style={{ width: `${curtainState.position}%` }}
                        />
                      </div>
                      <div className="curtain-preset-buttons">
                        <button
                          type="button"
                          className={`curtain-chip ${curtainState.position === 0 ? 'is-active' : ''}`}
                          onClick={() => onStepCurtain?.(0)}
                        >
                          Close (0%)
                        </button>
                        <button
                          type="button"
                          className={`curtain-chip ${curtainState.position === 50 ? 'is-active' : ''}`}
                          onClick={() => onStepCurtain?.(50)}
                        >
                          Half (50%)
                        </button>
                        <button
                          type="button"
                          className={`curtain-chip ${curtainState.position === 100 ? 'is-active' : ''}`}
                          onClick={() => onStepCurtain?.(100)}
                        >
                          Open (100%)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dual Grid: Spotlights & Scenes */}
                  <div className="app-grid-2col">
                    {/* Spotlights Tile */}
                    <button
                      type="button"
                      className={`app-mini-card ${isSpotsOn ? 'is-card-active' : ''}`}
                      onClick={() => onControlAction?.('spotlights', 'Spotlights')}
                    >
                      <div className="mini-icon spots-icon">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <circle cx="12" cy="7" r="4" />
                          <path d="M12 11l-5 9h10l-5-9z" opacity="0.6" />
                        </svg>
                      </div>
                      <span className="mini-title">Spotlights</span>
                      <span className="mini-state">{isSpotsOn ? `${dimmers.spotlights || 100}%` : 'Off'}</span>
                    </button>

                    {/* Relax Sanctuary Tile */}
                    <button
                      type="button"
                      className={`app-mini-card ${isRelaxOn ? 'is-card-active' : ''}`}
                      onClick={() => onControlAction?.('relax', 'Relax Mode')}
                    >
                      <div className="mini-icon relax-icon">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <circle cx="12" cy="12" r="5" />
                          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <span className="mini-title">Relax Sanctuary</span>
                      <span className="mini-state">{isRelaxOn ? '2200K Amber' : 'Off'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: SWITCH & SCENES */}
              {activeTab === 'switch' && (
                <div className="app-cards-container">
                  {/* Master Living ON Button */}
                  <button
                    type="button"
                    className={`app-scene-bar ${activeScene === 'living-on' ? 'is-active-gold' : ''}`}
                    onClick={() => onControlAction?.('living-on', 'Living On')}
                  >
                    <div className="scene-bar-icon">☀️</div>
                    <div className="scene-bar-meta">
                      <span className="scene-bar-name">Living On (All Circuits)</span>
                      <span className="scene-bar-desc">Master architectural illumination at 100%</span>
                    </div>
                    <span className="scene-bar-chevron">›</span>
                  </button>

                  {/* Master Living OFF Button */}
                  <button
                    type="button"
                    className={`app-scene-bar ${activeScene === 'living-off' ? 'is-active-dark' : ''}`}
                    onClick={() => onControlAction?.('living-off', 'Living Off')}
                  >
                    <div className="scene-bar-icon">🌙</div>
                    <div className="scene-bar-meta">
                      <span className="scene-bar-name">Living Off (Night Standby)</span>
                      <span className="scene-bar-desc">Extinguish all lights and enter calm standby</span>
                    </div>
                    <span className="scene-bar-chevron">›</span>
                  </button>

                  {/* Morning Ambience */}
                  <button
                    type="button"
                    className={`app-scene-bar ${activeScene === 'morning' ? 'is-active-morning' : ''}`}
                    onClick={() => onControlAction?.('morning', 'Morning')}
                  >
                    <div className="scene-bar-icon">🌅</div>
                    <div className="scene-bar-meta">
                      <span className="scene-bar-name">Morning Sunrise</span>
                      <span className="scene-bar-desc">Drapes open 100% with warm sunrise rays</span>
                    </div>
                    <span className="scene-bar-chevron">›</span>
                  </button>

                  {/* Night Ambience */}
                  <button
                    type="button"
                    className={`app-scene-bar ${activeScene === 'night' ? 'is-active-night' : ''}`}
                    onClick={() => onControlAction?.('night', 'Night')}
                  >
                    <div className="scene-bar-icon">🌌</div>
                    <div className="scene-bar-meta">
                      <span className="scene-bar-name">Night Nocturnal</span>
                      <span className="scene-bar-desc">Starry skyline view with soft cove accent lighting</span>
                    </div>
                    <span className="scene-bar-chevron">›</span>
                  </button>
                </div>
              )}
            </div>

            {/* iOS Bottom Navigation Bar */}
            <div className="phone-bottom-nav" aria-label="App Navigation">
              <button type="button" className="nav-tab-item is-active" aria-label="Home">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                <span>Home</span>
              </button>
              <button type="button" className="nav-tab-item" aria-label="Devices">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="6" height="6" rx="1" />
                  <rect x="14" y="4" width="6" height="6" rx="1" />
                  <rect x="4" y="14" width="6" height="6" rx="1" />
                  <rect x="14" y="14" width="6" height="6" rx="1" />
                </svg>
                <span>Devices</span>
              </button>
              <button type="button" className="nav-tab-item" aria-label="Scenes">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Scenes</span>
              </button>
              <button type="button" className="nav-tab-item" aria-label="Settings">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Settings</span>
              </button>

              {/* iOS Home Indicator Bar */}
              <div className="home-indicator" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
