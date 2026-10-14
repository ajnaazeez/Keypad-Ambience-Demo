import React, { useState } from 'react';
import './InlineAppView.css';

/**
 * InlineAppView Component
 * 
 * Replaces the physical keypad inline within the controller wall panel when App mode is selected.
 * Inspired by the Island Series reference:
 * - Clean, premium dark smartphone chassis with Dynamic Island notch & iOS status bar
 * - In-chassis circular [✕] exit button on top-right to return to Keypad mode
 * - 2 Functional Tabs: 'Home' (Comfort & Lighting Hub) and 'Switch' (Circuit Relays & Scenes)
 * - 100% synchronized in real-time with Three.js 3D Room Simulator & physical keypad states
 */
export default function InlineAppView({
  circuits = {},
  dimmers = {},
  fanState = { on: false, speed: 2 },
  acState = { on: false, temp: 22, mode: 'cool' },
  curtainState = { position: 0, isOpen: false },
  activeScene = 'living-on',
  onControlAction,
  onStepCurtain,
  onSetFanSpeed,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'switch'

  // Circuits & device live states matching our physical keypad
  const isLivingOn = activeScene === 'living-on' || Boolean(circuits['living-on']);
  const isLivingOff = activeScene === 'living-off' || Boolean(circuits['living-off']);
  const isMorningOn = activeScene === 'morning' || Boolean(circuits['morning']);
  const isNightOn = activeScene === 'night' || Boolean(circuits['night']);
  const isSpotsOn = Boolean(circuits['spotlights']);
  const isFanOn = Boolean(fanState.on);
  const isAcOn = Boolean(acState.on);
  const isCurtainOpen = curtainState.position > 0;

  // Active keypad options count (out of 8 architectural controls)
  const activeKeypadOptionsCount = [
    isLivingOn,
    isLivingOff,
    isAcOn,
    isFanOn,
    isCurtainOpen,
    isSpotsOn,
    isMorningOn,
    isNightOn,
  ].filter(Boolean).length;

  return (
    <div className="inline-app-wrapper" role="region" aria-label="Smart Home Mobile App Interface">
      {/* Smartphone Chassis Frame */}
      <div className="inline-phone-chassis">
        {/* Chassis Hardware Button Notches */}
        <span className="inline-hw-btn hw-vol-up" aria-hidden="true" />
        <span className="inline-hw-btn hw-vol-down" aria-hidden="true" />
        <span className="inline-hw-btn hw-power" aria-hidden="true" />

        {/* Screen Display Glass */}
        <div className="inline-screen-glass">
          {/* Top Notch / Dynamic Island */}
          <div className="inline-dynamic-island" aria-hidden="true">
            <span className="island-lens" />
            <span className="island-sensor" />
          </div>

          {/* iOS Status Bar */}
          <div className="inline-status-bar">
            <span className="status-clock">9:41</span>
            <div className="status-right-icons">
              {/* Cellular Signal Icon */}
              <svg viewBox="0 0 17 11" width="13" height="9" fill="currentColor">
                <rect x="0" y="8" width="2.5" height="3" rx="0.5" />
                <rect x="4.5" y="5.5" width="2.5" height="5.5" rx="0.5" />
                <rect x="9" y="3" width="2.5" height="8" rx="0.5" />
                <rect x="13.5" y="0.5" width="2.5" height="10.5" rx="0.5" />
              </svg>
              <span className="status-net">5G</span>
              {/* Battery Icon */}
              <svg viewBox="0 0 24 12" width="18" height="9" fill="currentColor">
                <rect x="1" y="1" width="19" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="3" width="14" height="6" rx="1.5" />
                <path d="M21.5 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* App Top Bar (Brand Header & Return-to-Keypad Button) */}
          <div className="inline-app-topbar">
            <div className="topbar-brand">
              <span className="topbar-series">ARISS ISLAND SERIES</span>
            </div>

            {/* Quick Close Button to return to Keypad mode (matching Island Series reference top-right) */}
            <button
              type="button"
              className="inline-exit-btn"
              onClick={onClose}
              title="Return to Physical Keypad"
              aria-label="Return to Keypad"
            >
              <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="3" x2="13" y2="13" />
                <line x1="13" y1="3" x2="3" y2="13" />
              </svg>
            </button>
          </div>

          {/* Section Headers / Tabs (Home vs Switch, matching Reference Layout) */}
          <div className="inline-tabs-header">
            <button
              type="button"
              className={`tab-title-btn ${activeTab === 'home' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </button>
            <button
              type="button"
              className={`tab-title-btn ${activeTab === 'switch' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('switch')}
            >
              Switch
            </button>
          </div>

          {/* Scrollable Viewport Area */}
          <div className="inline-viewport-scroll">
            {/* =========================================================
                TAB 1: HOME CONTROLS (8 Keypad Options 2-Column Grid)
                Matching our Architectural Keypad:
                Row 1: Living On  | Living Off
                Row 2: AC         | Fan
                Row 3: Curtain    | Spotlights
                Row 4: Morning    | Night
                ========================================================= */}
            {activeTab === 'home' && (
              <div className="home-grid-container">
                {/* 1. Living On (Keypad Button 1) */}
                <div
                  className={`app-grid-card ${isLivingOn ? 'is-active is-living-on' : ''}`}
                  onClick={() => onControlAction?.('living-on', 'Living On')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-header-line">
                    <span className="card-name">Living On</span>
                    <span className="card-icon-wrap icon-living-on">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                        <circle cx="10" cy="10" r="4" />
                        <path d="M10 2v2m0 12v2M2 10h2m12 0h2m-3.3-5.7l-1.4 1.4m-6.6 6.6l-1.4 1.4m0-9.4l1.4 1.4m6.6 6.6l1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                  <span className="card-status-text">{isLivingOn ? 'Active' : 'Ready'}</span>
                </div>

                {/* 2. Living Off (Keypad Button 2) */}
                <div
                  className={`app-grid-card ${isLivingOff ? 'is-active is-living-off' : ''}`}
                  onClick={() => onControlAction?.('living-off', 'Living Off')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-header-line">
                    <span className="card-name">Living Off</span>
                    <span className="card-icon-wrap icon-living-off">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                        <path d="M14.5 13.5a6 6 0 1 1-8-8 7.5 7.5 0 0 0 8 8z" />
                      </svg>
                    </span>
                  </div>
                  <span className="card-status-text">{isLivingOff ? 'Standby' : 'Ready'}</span>
                </div>

                {/* 3. AC Climate Card (Keypad Button 3) */}
                <div
                  className={`app-grid-card ${isAcOn ? 'is-active is-ac-on' : ''}`}
                  onClick={() => onControlAction?.('ac', 'Wall AC')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-header-line">
                    <span className="card-name">AC</span>
                    <span className="card-icon-wrap icon-ac">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M10 2v16M2 10h16M4.5 4.5l11 11M15.5 4.5l-11 11" strokeLinecap="round" />
                        <circle cx="10" cy="10" r="2" fill="currentColor" />
                      </svg>
                    </span>
                  </div>
                  <span className="card-status-text">
                    {isAcOn ? `${acState.temp}°C` : 'OFF'}
                  </span>

                  {/* Inline Stepper when AC is ON */}
                  {isAcOn && (
                    <div className="card-mini-stepper" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="stepper-mini-btn"
                        onClick={() => onControlAction?.('ac-down', 'Wall AC')}
                        title="Cooler"
                      >
                        −
                      </button>
                      <span className="stepper-val">{acState.temp}°</span>
                      <button
                        type="button"
                        className="stepper-mini-btn"
                        onClick={() => onControlAction?.('ac-up', 'Wall AC')}
                        title="Warmer"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Ceiling Fan Card (Keypad Button 4) */}
                <div
                  className={`app-grid-card ${isFanOn ? 'is-active is-fan-on' : ''}`}
                  onClick={() => onControlAction?.('fan', 'Ceiling Fan')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-header-line">
                    <span className="card-name">Fan</span>
                    <span className={`card-icon-wrap icon-fan ${isFanOn ? 'is-spinning' : ''}`}>
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="10" cy="2.5" />
                        <path d="M10 7.5C10 4 12.5 2.5 14 4s-1 4.5-4 3.5z" />
                        <path d="M12.5 10c3.5 0 5 2.5 3.5 4s-4.5-1-3.5-4z" />
                        <path d="M10 12.5c0 3.5-2.5 5-4 3.5s1-4.5 4-3.5z" />
                        <path d="M7.5 10c-3.5 0-5-2.5-3.5-4s4.5 1 3.5 4z" />
                      </svg>
                    </span>
                  </div>
                  <span className="card-status-text">
                    {isFanOn ? `Speed ${fanState.speed || 2}` : 'OFF'}
                  </span>

                  {/* Fan Speed Chips when Fan is ON */}
                  {isFanOn && (
                    <div className="fan-chips-line" onClick={(e) => e.stopPropagation()}>
                      {[1, 2, 3, 4].map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          className={`fan-spd-chip ${fanState.speed === spd ? 'is-selected' : ''}`}
                          onClick={() => onSetFanSpeed?.(spd)}
                        >
                          {spd}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Motorized Curtain Card (Keypad Button 5) */}
                <div
                  className={`app-grid-card card-curtain ${isCurtainOpen ? 'is-active is-curtain-highlight' : ''}`}
                  onClick={() => onControlAction?.('curtain', 'Curtain')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-header-line">
                    <span className="card-name">Curtain</span>
                    <span className="card-icon-wrap icon-curtain">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="3" y="3" width="14" height="14" rx="2" />
                        <line x1="10" y1="3" x2="10" y2="17" />
                        <path d="M6 7h2m-2 3h2m-2 3h2M12 7h2m-2 3h2m-2 3h2" />
                      </svg>
                    </span>
                  </div>
                  <span className="card-status-text">
                    {isCurtainOpen ? `Open ${curtainState.position}%` : 'Closed'}
                  </span>

                  {/* Preset Pills when Open */}
                  {isCurtainOpen && (
                    <div className="curtain-chips-line" onClick={(e) => e.stopPropagation()}>
                      {[0, 50, 100].map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          className={`curtain-chip-btn ${curtainState.position === pos ? 'is-selected' : ''}`}
                          onClick={() => onStepCurtain?.(pos)}
                        >
                          {pos}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Spotlights Card (Keypad Button 6) */}
                <div
                  className={`app-grid-card ${isSpotsOn ? 'is-active is-spots-on' : ''}`}
                  onClick={() => onControlAction?.('spotlights', 'Spotlights')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-header-line">
                    <span className="card-name">Spotlights</span>
                    <span className="card-icon-wrap icon-spots">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                        <circle cx="10" cy="6" r="3.2" />
                        <path d="M10 9.5l-4.5 8h9l-4.5-8z" opacity="0.6" />
                      </svg>
                    </span>
                  </div>
                  <span className="card-status-text">
                    {isSpotsOn ? `${dimmers['spotlights'] || 100}%` : 'OFF'}
                  </span>
                </div>

                {/* 7. Morning Scene Card (Keypad Button 7) */}
                <div
                  className={`app-grid-card ${isMorningOn ? 'is-active is-morning-on' : ''}`}
                  onClick={() => onControlAction?.('morning', 'Morning Ambience')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-header-line">
                    <span className="card-name">Morning</span>
                    <span className="card-icon-wrap icon-morning">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="currentColor" fillOpacity="0.25" />
                        <path d="M3 15h14M6 18h8M10 1v2M4.2 4.2l1.4 1.4M15.8 4.2l-1.4 1.4" />
                      </svg>
                    </span>
                  </div>
                  <span className="card-status-text">{isMorningOn ? 'Active' : 'Ready'}</span>
                </div>

                {/* 8. Night Scene Card (Keypad Button 8) */}
                <div
                  className={`app-grid-card ${isNightOn ? 'is-active is-night-on' : ''}`}
                  onClick={() => onControlAction?.('night', 'Night Ambience')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="card-header-line">
                    <span className="card-name">Night</span>
                    <span className="card-icon-wrap icon-night">
                      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M14 11.5A5.5 5.5 0 0 1 7.5 5a6 6 0 1 0 6.5 6.5z" fill="currentColor" fillOpacity="0.25" />
                        <circle cx="15.5" cy="4.5" r="0.8" fill="currentColor" />
                        <circle cx="17.5" cy="8.5" r="0.6" fill="currentColor" />
                      </svg>
                    </span>
                  </div>
                  <span className="card-status-text">{isNightOn ? 'Active' : 'Ready'}</span>
                </div>
              </div>
            )}

            {/* =========================================================
                TAB 2: SWITCH / TOGGLE VIEW
                Matching our 8 Architectural Keypad Options:
                1. Living On
                2. Living Off
                3. AC
                4. Fan
                5. Curtain
                6. Spotlights
                7. Morning
                8. Night
                ========================================================= */}
            {activeTab === 'switch' && (
              <div className="switch-relays-container">
                {/* Master All Keypad Controls Card */}
                <div className="relay-master-card">
                  <div className="relay-master-info">
                    <span className="relay-master-title">All Keypad Controls</span>
                    <span className="relay-master-sub">{activeKeypadOptionsCount} of 8 active</span>
                  </div>
                  <button
                    type="button"
                    className={`app-toggle-switch ${isLivingOn ? 'is-on' : ''}`}
                    onClick={() => onControlAction?.(isLivingOn ? 'living-off' : 'living-on', isLivingOn ? 'Living Off' : 'Living On')}
                    aria-label="Toggle Master Power"
                  >
                    <span className="toggle-slider" />
                  </button>
                </div>

                {/* 8 Keypad Options with Tactile Toggle Switches */}
                <div className="relays-list">
                  {/* Option 1: Living On */}
                  <div className="relay-item-card">
                    <div className="relay-item-left">
                      <span className="relay-icon">☀️</span>
                      <div className="relay-meta">
                        <span className="relay-name">Living On</span>
                        <span className="relay-sub">{isLivingOn ? 'Active · Illuminating room' : 'Ready'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`app-toggle-switch ${isLivingOn ? 'is-on' : ''}`}
                      onClick={() => onControlAction?.('living-on', 'Living On')}
                      aria-label="Toggle Living On"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>

                  {/* Option 2: Living Off */}
                  <div className="relay-item-card">
                    <div className="relay-item-left">
                      <span className="relay-icon">🌙</span>
                      <div className="relay-meta">
                        <span className="relay-name">Living Off</span>
                        <span className="relay-sub">{isLivingOff ? 'Standby Calm Active' : 'Ready'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`app-toggle-switch ${isLivingOff ? 'is-on' : ''}`}
                      onClick={() => onControlAction?.('living-off', 'Living Off')}
                      aria-label="Toggle Living Off"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>

                  {/* Option 3: AC */}
                  <div className="relay-item-card">
                    <div className="relay-item-left">
                      <span className="relay-icon">❄️</span>
                      <div className="relay-meta">
                        <span className="relay-name">AC</span>
                        <span className="relay-sub">{isAcOn ? `${acState.temp}°C · Cooling Active` : 'Turned Off'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`app-toggle-switch ${isAcOn ? 'is-on' : ''}`}
                      onClick={() => onControlAction?.('ac', 'Wall AC')}
                      aria-label="Toggle AC"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>

                  {/* Option 4: Fan */}
                  <div className="relay-item-card">
                    <div className="relay-item-left">
                      <span className="relay-icon">🌀</span>
                      <div className="relay-meta">
                        <span className="relay-name">Fan</span>
                        <span className="relay-sub">{isFanOn ? `Speed ${fanState.speed || 2} · Rotating` : 'Turned Off'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`app-toggle-switch ${isFanOn ? 'is-on' : ''}`}
                      onClick={() => onControlAction?.('fan', 'Ceiling Fan')}
                      aria-label="Toggle Fan"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>

                  {/* Option 5: Curtain */}
                  <div className="relay-item-card">
                    <div className="relay-item-left">
                      <span className="relay-icon">🪟</span>
                      <div className="relay-meta">
                        <span className="relay-name">Curtain</span>
                        <span className="relay-sub">{isCurtainOpen ? `Open ${curtainState.position}%` : 'Draped Closed'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`app-toggle-switch ${isCurtainOpen ? 'is-on' : ''}`}
                      onClick={() => onControlAction?.('curtain', 'Curtain')}
                      aria-label="Toggle Curtain"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>

                  {/* Option 6: Spotlights */}
                  <div className="relay-item-card">
                    <div className="relay-item-left">
                      <span className="relay-icon">🔦</span>
                      <div className="relay-meta">
                        <span className="relay-name">Spotlights</span>
                        <span className="relay-sub">{isSpotsOn ? `${dimmers['spotlights'] || 100}% · Cones Lit` : 'Turned Off'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`app-toggle-switch ${isSpotsOn ? 'is-on' : ''}`}
                      onClick={() => onControlAction?.('spotlights', 'Spotlights')}
                      aria-label="Toggle Spotlights"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>

                  {/* Option 7: Morning */}
                  <div className="relay-item-card">
                    <div className="relay-item-left">
                      <span className="relay-icon">🌅</span>
                      <div className="relay-meta">
                        <span className="relay-name">Morning</span>
                        <span className="relay-sub">{isMorningOn ? 'Sunrise Panorama Engaged' : 'Ready'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`app-toggle-switch ${isMorningOn ? 'is-on' : ''}`}
                      onClick={() => onControlAction?.('morning', 'Morning Ambience')}
                      aria-label="Toggle Morning"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>

                  {/* Option 8: Night */}
                  <div className="relay-item-card">
                    <div className="relay-item-left">
                      <span className="relay-icon">🌌</span>
                      <div className="relay-meta">
                        <span className="relay-name">Night</span>
                        <span className="relay-sub">{isNightOn ? 'Nocturnal Skyline Engaged' : 'Ready'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`app-toggle-switch ${isNightOn ? 'is-on' : ''}`}
                      onClick={() => onControlAction?.('night', 'Night Ambience')}
                      aria-label="Toggle Night"
                    >
                      <span className="toggle-slider" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating iOS Bottom Dock Navigation (matching reference) */}
          <div className="inline-dock-nav">
            <button
              type="button"
              className={`dock-nav-item ${activeTab === 'home' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <path d="M10 2l-7 6v9h5v-5h4v5h5V8l-7-6z" />
              </svg>
              <span>Home</span>
            </button>
            <button
              type="button"
              className={`dock-nav-item ${activeTab === 'switch' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('switch')}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <path d="M11 2L4 11h5l-1 7 7-9h-5l1-7z" />
              </svg>
              <span>Switch</span>
            </button>
          </div>

          {/* iOS Bottom Indicator Bar */}
          <div className="inline-home-indicator" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
