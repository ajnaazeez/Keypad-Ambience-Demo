import React from 'react';
import KeypadButton from './KeypadButton';
import './Keypad.css';

// 8 buttons matching the manager's physical reference photo — 2 columns × 4 rows
export const LEFT_COLUMN_BUTTONS = [
  { id: 'living-on',  label: 'Living On' },
  { id: 'main-light', label: 'Main Light' },
  { id: 'spotlights', label: 'Spotlights' },
  { id: 'cove',       label: 'Cove' },
];

export const RIGHT_COLUMN_BUTTONS = [
  { id: 'living-off', label: 'Living Off' },
  { id: 'chandelier', label: 'Chandelier' },
  { id: 'ceiling',    label: 'Ceiling' },
  { id: 'relax',      label: 'Relax' },
];

/**
 * Keypad Component
 * Renders the 8-button architectural plate matching the physical hardware photo.
 * Restores authentic button proportions without any artificial display boxes.
 */
export default function Keypad({
  circuits = {},
  onShortPress,
  onLongPress,
  onLongPressEnd,
}) {
  return (
    <div className="keypad-plate-wrapper">
      <div className="keypad-faceplate">
        <div className="keypad-bay" role="group" aria-label="Keypad buttons">
          {/* Left Column (4 buttons) */}
          <div className="keypad-column keypad-column-left">
            {LEFT_COLUMN_BUTTONS.map((btn) => (
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

          {/* Right Column (4 buttons) */}
          <div className="keypad-column keypad-column-right">
            {RIGHT_COLUMN_BUTTONS.map((btn) => (
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
        </div>
      </div>
    </div>
  );
}
