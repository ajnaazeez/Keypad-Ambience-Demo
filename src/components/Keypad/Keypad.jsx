import React, { useState } from 'react';
import KeypadButton from './KeypadButton';
import KeypadDisplayStrip from './KeypadDisplayStrip';
import './Keypad.css';

// Module 1: Architectural Lighting (8 buttons matching the physical photo)
const LIGHTING_MODULE_LEFT = [
  { id: 'living-on',  label: 'Living On' },
  { id: 'main-light', label: 'Main Light' },
  { id: 'spotlights', label: 'Spotlights' },
  { id: 'cove',       label: 'Cove' },
];

const LIGHTING_MODULE_RIGHT = [
  { id: 'living-off', label: 'Living Off' },
  { id: 'chandelier', label: 'Chandelier' },
  { id: 'ceiling',    label: 'Ceiling' },
  { id: 'relax',      label: 'Relax' },
];

// Module 2: Climate & Comfort (6 tactile buttons for Fan, AC, Curtains)
const CLIMATE_MODULE_LEFT = [
  { id: 'fan-power',    label: 'Fan Power' },
  { id: 'ac-power',     label: 'AC Power' },
  { id: 'curtain-open', label: 'Curtain Open' },
];

const CLIMATE_MODULE_RIGHT = [
  { id: 'fan-speed',     label: 'Fan Speed' },
  { id: 'ac-temp',       label: 'AC Temp' },
  { id: 'curtain-close', label: 'Curtain Close' },
];

/**
 * Keypad Component
 * 
 * Renders the premium physical ARISS Island Series architectural smart-home keypad.
 * Accommodates:
 * 1. Continuous dark glass OLED display strip with live clock, temp, and device feedback
 * 2. Module 1: Preserved 8-button lighting plate
 * 3. Module 2: Dedicated climate & curtain plate (Fan, AC, Curtains)
 * 4. Dual-gang / modular station view switcher
 * 5. Short-press toggles & Long-press deep inspection/ambience triggers
 */
export default function Keypad({
  circuits = {},
  fanState = { on: false, speed: 3 },
  acState = { on: false, temp: 22, mode: 'cool' },
  curtainState = { position: 100, isOpen: true },
  activeScene = 'living-off',
  lastInteraction = null,
  activeGangView = 'dual', // 'dual' | 'lighting' | 'climate'
  onChangeGangView,
  onShortPress,
  onLongPress,
  onLongPressEnd,
}) {
  const [internalGang, setInternalGang] = useState('dual');
  const currentView = onChangeGangView ? activeGangView : internalGang;
  const setView = onChangeGangView || setInternalGang;

  // Determine active state for each button
  const isButtonActive = (id) => {
    // Lighting circuits
    if (circuits[id] !== undefined) {
      return Boolean(circuits[id]);
    }
    // Fan buttons
    if (id === 'fan-power') return Boolean(fanState.on);
    if (id === 'fan-speed') return Boolean(fanState.on);
    // AC buttons
    if (id === 'ac-power') return Boolean(acState.on);
    if (id === 'ac-temp') return Boolean(acState.on);
    // Curtain buttons
    if (id === 'curtain-open') return curtainState.position === 100;
    if (id === 'curtain-close') return curtainState.position === 0;
    return false;
  };

  // Dynamic dynamic label for climate buttons
  const getDynamicLabel = (btn) => {
    if (btn.id === 'fan-speed' && fanState.on) {
      return `Fan Spd ${fanState.speed}`;
    }
    if (btn.id === 'ac-temp' && acState.on) {
      return `AC ${acState.temp}°C`;
    }
    if (btn.id === 'curtain-open' && curtainState.position === 100) {
      return 'Drapes Open';
    }
    if (btn.id === 'curtain-close' && curtainState.position === 0) {
      return 'Drapes Closed';
    }
    return btn.label;
  };

  return (
    <div className="keypad-wall-station" role="region" aria-label="ARISS Island Keypad Wall Station">
      {/* Architectural Gang Selector Tabs */}
      <div className="keypad-gang-selector">
        <button
          type="button"
          className={`gang-tab-btn ${currentView === 'dual' ? 'is-active' : ''}`}
          onClick={() => setView('dual')}
          aria-label="View dual-gang smart plate"
        >
          <span className="tab-pill-icon">◫</span>
          Dual-Gang Wall System
        </button>

        <button
          type="button"
          className={`gang-tab-btn ${currentView === 'lighting' ? 'is-active' : ''}`}
          onClick={() => setView('lighting')}
          aria-label="View lighting keypad plate"
        >
          <span className="tab-pill-icon">✦</span>
          Lighting Plate (8-Key)
        </button>

        <button
          type="button"
          className={`gang-tab-btn ${currentView === 'climate' ? 'is-active' : ''}`}
          onClick={() => setView('climate')}
          aria-label="View climate and comfort plate"
        >
          <span className="tab-pill-icon">❄</span>
          Climate & Drapes (6-Key)
        </button>
      </div>

      {/* Main Wall Faceplate Bay */}
      <div className={`keypad-station-frame view-${currentView}`}>
        {/* ============================================================== */}
        {/* MODULE 1: ARCHITECTURAL LIGHTING (8 BUTTONS) */}
        {/* ============================================================== */}
        {(currentView === 'dual' || currentView === 'lighting') && (
          <div className="keypad-plate-wrapper module-lighting">
            <div className="keypad-faceplate">
              {/* Integrated Continuous Glass OLED Display Strip */}
              <KeypadDisplayStrip
                lastInteraction={lastInteraction}
                fanState={fanState}
                acState={acState}
                curtainState={curtainState}
                activeScene={activeScene}
              />

              {/* Plate Header Kicker */}
              <div className="plate-sub-header">
                <span className="module-title">ARCHITECTURAL LIGHTING</span>
                <span className="module-spec">8-ISLAND PLATE</span>
              </div>

              {/* 8-Button Bay */}
              <div className="keypad-bay" role="group" aria-label="Lighting keypad buttons">
                {/* Left Column (4 buttons) */}
                <div className="keypad-column keypad-column-left">
                  {LIGHTING_MODULE_LEFT.map((btn) => (
                    <KeypadButton
                      key={btn.id}
                      id={btn.id}
                      label={btn.label}
                      isActive={isButtonActive(btn.id)}
                      onShortPress={onShortPress}
                      onLongPress={onLongPress}
                      onLongPressEnd={onLongPressEnd}
                    />
                  ))}
                </div>

                {/* Right Column (4 buttons) */}
                <div className="keypad-column keypad-column-right">
                  {LIGHTING_MODULE_RIGHT.map((btn) => (
                    <KeypadButton
                      key={btn.id}
                      id={btn.id}
                      label={btn.label}
                      isActive={isButtonActive(btn.id)}
                      onShortPress={onShortPress}
                      onLongPress={onLongPress}
                      onLongPressEnd={onLongPressEnd}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODULE 2: CLIMATE & COMFORT (FAN, AC, CURTAINS - 6 BUTTONS) */}
        {/* ============================================================== */}
        {(currentView === 'dual' || currentView === 'climate') && (
          <div className="keypad-plate-wrapper module-climate">
            <div className="keypad-faceplate">
              {/* Integrated Continuous Glass OLED Display Strip */}
              <KeypadDisplayStrip
                lastInteraction={lastInteraction}
                fanState={fanState}
                acState={acState}
                curtainState={curtainState}
                activeScene={activeScene}
              />

              {/* Plate Header Kicker */}
              <div className="plate-sub-header">
                <span className="module-title">CLIMATE & ENVIRONMENT</span>
                <span className="module-spec">6-ISLAND PLATE</span>
              </div>

              {/* 6-Button Bay */}
              <div className="keypad-bay bay-climate" role="group" aria-label="Climate & Drapery buttons">
                {/* Left Column (3 buttons: Fan Power, AC Power, Curtain Open) */}
                <div className="keypad-column keypad-column-left">
                  {CLIMATE_MODULE_LEFT.map((btn) => (
                    <KeypadButton
                      key={btn.id}
                      id={btn.id}
                      label={getDynamicLabel(btn)}
                      isActive={isButtonActive(btn.id)}
                      onShortPress={onShortPress}
                      onLongPress={onLongPress}
                      onLongPressEnd={onLongPressEnd}
                    />
                  ))}
                </div>

                {/* Right Column (3 buttons: Fan Speed, AC Temp, Curtain Close) */}
                <div className="keypad-column keypad-column-right">
                  {CLIMATE_MODULE_RIGHT.map((btn) => (
                    <KeypadButton
                      key={btn.id}
                      id={btn.id}
                      label={getDynamicLabel(btn)}
                      isActive={isButtonActive(btn.id)}
                      onShortPress={onShortPress}
                      onLongPress={onLongPress}
                      onLongPressEnd={onLongPressEnd}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
