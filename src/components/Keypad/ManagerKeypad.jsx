import React, { useState } from 'react';
import KeypadButton from './KeypadButton';
import './ManagerKeypad.css';

// 8 buttons matching the manager's physical photo (Screenshot 2)
const MANAGER_BUTTONS_LEFT = [
  { id: 'living-on',  label: 'Living On' },
  { id: 'main-light', label: 'Main Light' },
  { id: 'chandelier', label: 'Chandelier' },
  { id: 'cove',       label: 'Cove' },
];

const MANAGER_BUTTONS_RIGHT = [
  { id: 'living-off', label: 'Living Off' },
  { id: 'ceiling',    label: 'Ceiling' },
  { id: 'spotlights', label: 'Spotlights' },
  { id: 'relax',      label: 'Relax' },
];

/**
 * ManagerKeypad Component
 * 
 * Recreates the exact physical 8-button architectural plate shown in Screenshot 2:
 * - Square satin-aluminum faceplate with authentic metallic bevel
 * - Column 1: Living On, Main Light, Chandelier, Cove
 * - Column 2: Living Off, Ceiling, Spotlights, Relax
 * - Short-press: Toggles lighting circuit ON/OFF
 * - Long-press (450ms): AUTOMATICALLY transforms the room ambience directly with hold bar animation
 * - Gang Selector: Seamlessly toggle between 8-Gang Lighting & Climate & Comfort Gang (Fan/AC/Drapes)
 */
export default function ManagerKeypad({
  circuits = {},
  onShortPress,
  onLongPress,
  onLongPressEnd,
  fanState = { on: false, speed: 3 },
  acState = { on: false, temp: 22, mode: 'cool' },
  curtainState = { position: 100, isOpen: true },
  onComfortAction,
}) {
  const [activeGang, setActiveGang] = useState('lighting');

  // Comfort gang button definitions
  const comfortButtonsLeft = [
    {
      id: 'fan-toggle',
      label: fanState.on ? `Fan: Spd ${fanState.speed}` : 'Fan Power',
      isActive: Boolean(fanState.on),
    },
    {
      id: 'fan-speed-up',
      label: 'Fan Speed +',
      isActive: Boolean(fanState.on && fanState.speed < 5),
    },
    {
      id: 'ac-toggle',
      label: acState.on ? `AC: ${acState.temp}°C` : 'AC Power',
      isActive: Boolean(acState.on),
    },
    {
      id: 'ac-temp-up',
      label: 'Temp +1°C',
      isActive: Boolean(acState.on && acState.temp < 30),
    },
  ];

  const comfortButtonsRight = [
    {
      id: 'fan-speed-down',
      label: 'Fan Speed -',
      isActive: Boolean(fanState.on && fanState.speed > 1),
    },
    {
      id: 'ac-mode',
      label: `Mode: ${acState.mode.toUpperCase()}`,
      isActive: Boolean(acState.on),
    },
    {
      id: 'ac-temp-down',
      label: 'Temp -1°C',
      isActive: Boolean(acState.on && acState.temp > 16),
    },
    {
      id: 'curtain-toggle',
      label: curtainState.position > 0 ? 'Drapes: Open' : 'Drapes: Closed',
      isActive: Boolean(curtainState.position > 0),
    },
  ];

  return (
    <div className="manager-keypad-wrapper" role="region" aria-label="ARISS Island 8-Button Wall Keypad">
      {/* Architectural Gang Selector */}
      <div className="manager-gang-bar" role="tablist" aria-label="Keypad Gang Mode">
        <button
          type="button"
          role="tab"
          aria-selected={activeGang === 'lighting'}
          className={`gang-tab-pill ${activeGang === 'lighting' ? 'is-active' : ''}`}
          onClick={() => setActiveGang('lighting')}
        >
          <span className="tab-glyph">💡</span>
          <span>Lighting (8-Gang)</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeGang === 'comfort'}
          className={`gang-tab-pill ${activeGang === 'comfort' ? 'is-active' : ''}`}
          onClick={() => setActiveGang('comfort')}
        >
          <span className="tab-glyph">🌀</span>
          <span>Climate & Drapes</span>
        </button>
      </div>

      {/* Satin-Aluminum Faceplate matching Manager's Reference Photo (Screenshot 2) */}
      <div className="manager-keypad-faceplate">
        <div className="manager-keypad-bay" role="group" aria-label="Keypad buttons">
          {activeGang === 'lighting' ? (
            <>
              {/* Left Column (4 buttons: Living On, Main Light, Chandelier, Cove) */}
              <div className="manager-column manager-column-left">
                {MANAGER_BUTTONS_LEFT.map((btn) => (
                  <KeypadButton
                    key={btn.id}
                    id={btn.id}
                    label={btn.label}
                    isActive={Boolean(circuits[btn.id])}
                    onShortPress={onShortPress}
                    onLongPress={onLongPress}
                    onLongPressEnd={onLongPressEnd}
                  />
                ))}
              </div>

              {/* Right Column (4 buttons: Living Off, Ceiling, Spotlights, Relax) */}
              <div className="manager-column manager-column-right">
                {MANAGER_BUTTONS_RIGHT.map((btn) => (
                  <KeypadButton
                    key={btn.id}
                    id={btn.id}
                    label={btn.label}
                    isActive={Boolean(circuits[btn.id])}
                    onShortPress={onShortPress}
                    onLongPress={onLongPress}
                    onLongPressEnd={onLongPressEnd}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Comfort Left Column (Fan Power, Fan Spd +, AC Power, Temp +) */}
              <div className="manager-column manager-column-left">
                {comfortButtonsLeft.map((btn) => (
                  <KeypadButton
                    key={btn.id}
                    id={btn.id}
                    label={btn.label}
                    isActive={btn.isActive}
                    onShortPress={() => onComfortAction?.(btn.id)}
                    onLongPress={() => onComfortAction?.(btn.id, true)}
                    onLongPressEnd={() => {}}
                  />
                ))}
              </div>

              {/* Comfort Right Column (Fan Spd -, AC Mode, Temp -, Drapes) */}
              <div className="manager-column manager-column-right">
                {comfortButtonsRight.map((btn) => (
                  <KeypadButton
                    key={btn.id}
                    id={btn.id}
                    label={btn.label}
                    isActive={btn.isActive}
                    onShortPress={() => onComfortAction?.(btn.id)}
                    onLongPress={() => onComfortAction?.(btn.id, true)}
                    onLongPressEnd={() => {}}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
