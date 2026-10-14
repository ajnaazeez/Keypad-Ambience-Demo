import React from 'react';
import SmartKeypadButton from './SmartKeypadButton';
import KeypadDisplayStrip from './KeypadDisplayStrip';
import './SmartKeypad.css';

/**
 * SmartKeypad Component
 * 
 * Custom-designed architectural smart home keypad plate combining:
 * 1. Continuous dark-glass OLED display strip with real-time clock, temp, and live device HUD
 * 2. Section 1 (Architectural Lighting): Every single control from the manager's reference keypad:
 *    - Row 1: Living On | Living Off
 *    - Row 2: Main Light | Ceiling
 *    - Row 3: Chandelier | Spotlights
 *    - Row 4: Cove | Relax
 * 3. Section 2 (Climate & Motorization): Dedicated smart home automation controls:
 *    - Row 5: Fan (Power + Speed 1-5) | AC (Power + Temp 18-30°C)
 *    - Row 6: Curtains (Open/Close 0-100%) | Fireplace (Flame & Ambience)
 * 4. Rich Short-press & Long-press progressive hold interactions.
 */
export default function SmartKeypad({
  circuits = {},
  dimmers = {
    'main-light': 100,
    'ceiling': 100,
    'chandelier': 100,
    'spotlights': 100,
    'cove': 100,
  },
  fanState = { on: false, speed: 3 },
  acState = { on: false, temp: 22, mode: 'cool' },
  curtainState = { position: 100, isOpen: true },
  activeScene = 'living-off',
  lastInteraction = null,
  onShortPress,
  onLongPress,
  onLongPressEnd,
}) {
  // Buttons for Section 1: Architectural Lighting (From Reference)
  const lightingButtonsLeft = [
    {
      id: 'living-on',
      label: 'Living On',

      isActive: Boolean(circuits['living-on']),
      indicatorColor: '#38bdf8',
    },
    {
      id: 'main-light',
      label: 'Main Light',

      isActive: Boolean(circuits['main-light']),
      indicatorColor: '#e0f2fe',
    },
    {
      id: 'chandelier',
      label: 'Chandelier',

      isActive: Boolean(circuits['chandelier'] || circuits['relax']),
      indicatorColor: '#f59e0b',
    },
    {
      id: 'cove',
      label: 'Cove',

      isActive: Boolean(circuits['cove'] || circuits['relax']),
      indicatorColor: '#fbbf24',
    },
  ];

  const lightingButtonsRight = [
    {
      id: 'living-off',
      label: 'Living Off',

      isActive: Boolean(circuits['living-off']),
      indicatorColor: '#64748b',
    },
    {
      id: 'ceiling',
      label: 'Ceiling',

      isActive: Boolean(circuits['ceiling']),
      indicatorColor: '#93c5fd',
    },
    {
      id: 'spotlights',
      label: 'Spotlights',

      isActive: Boolean(circuits['spotlights']),
      indicatorColor: '#fbbf24',
    },
    {
      id: 'relax',
      label: 'Relax',

      isActive: Boolean(circuits['relax']),
      indicatorColor: '#f97316',
    },
  ];

  // Buttons for Section 2: Dedicated Climate & Motorization
  const fanButton = {
    id: 'fan',
    label: 'Fan',

    isActive: Boolean(fanState.on),
    indicatorColor: '#38bdf8',
  };

  const acButton = {
    id: 'ac',
    label: 'AC',

    isActive: Boolean(acState.on),
    indicatorColor: '#0284c7',
  };

  const curtainButton = {
    id: 'curtain',
    label: 'Curtains',

    isActive: curtainState.position > 0,
    indicatorColor: '#818cf8',
  };

  return (
    <div className="smart-keypad-station" role="region" aria-label="ARISS Island Custom Smart Keypad">
      {/* 1. Continuous Dark-Glass OLED Display Strip at Top */}
      <div className="keypad-oled-crown">
        <KeypadDisplayStrip
          lastInteraction={lastInteraction}
          fanState={fanState}
          acState={acState}
          curtainState={curtainState}
          activeScene={activeScene}
        />
      </div>

      {/* 2. Precision-Machined Satin-Anodized Aluminum Faceplate */}
      <div className="smart-keypad-faceplate">
        {/* Section 1: Architectural Lighting (From Reference) */}
        <div className="keypad-bay-section section-lighting">
          <div className="bay-column">
            {lightingButtonsLeft.map((btn) => (
              <SmartKeypadButton
                key={btn.id}
                id={btn.id}
                label={btn.label}
                sublabel={btn.sublabel}
                isActive={btn.isActive}
                indicatorColor={btn.indicatorColor}
                onShortPress={onShortPress}
                onLongPress={onLongPress}
                onLongPressEnd={onLongPressEnd}
              />
            ))}
          </div>
          <div className="bay-column">
            {lightingButtonsRight.map((btn) => (
              <SmartKeypadButton
                key={btn.id}
                id={btn.id}
                label={btn.label}
                sublabel={btn.sublabel}
                isActive={btn.isActive}
                indicatorColor={btn.indicatorColor}
                onShortPress={onShortPress}
                onLongPress={onLongPress}
                onLongPressEnd={onLongPressEnd}
              />
            ))}
          </div>
        </div>

        {/* Architectural Divider Seam */}
        <div className="keypad-section-divider">
          <span className="divider-line" />
          <span className="divider-label">CLIMATE & MOTORIZATION</span>
          <span className="divider-line" />
        </div>

        {/* Section 2: Dedicated Fan, AC & Motorized Curtains Controls */}
        <div className="keypad-bay-section section-automation">
          <SmartKeypadButton
            id={fanButton.id}
            label={fanButton.label}
            sublabel={fanButton.sublabel}
            isActive={fanButton.isActive}
            indicatorColor={fanButton.indicatorColor}
            onShortPress={onShortPress}
            onLongPress={onLongPress}
            onLongPressEnd={onLongPressEnd}
          />
          <SmartKeypadButton
            id={acButton.id}
            label={acButton.label}
            sublabel={acButton.sublabel}
            isActive={acButton.isActive}
            indicatorColor={acButton.indicatorColor}
            onShortPress={onShortPress}
            onLongPress={onLongPress}
            onLongPressEnd={onLongPressEnd}
          />
          <SmartKeypadButton
            id={curtainButton.id}
            label={curtainButton.label}
            sublabel={curtainButton.sublabel}
            isActive={curtainButton.isActive}
            indicatorColor={curtainButton.indicatorColor}
            className="smart-button-full"
            onShortPress={onShortPress}
            onLongPress={onLongPress}
            onLongPressEnd={onLongPressEnd}
          />
        </div>
      </div>
    </div>
  );
}
