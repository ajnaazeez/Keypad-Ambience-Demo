import React from 'react';
import { useLongPress } from '../../hooks/useLongPress';
import './SmartKeypad.css';

/**
 * SmartKeypadButton Component
 * 
 * Precision-machined tactile button with:
 * - Satin aluminum specular reflection
 * - Dynamic status sublabel (e.g. "Speed 3", "22°C", "85%")
 * - Pinhole status LED glowing with realistic optics
 * - Progressive repeating long-press for continuous adjustment while holding down
 * - Tactile press depression feedback
 */
export default function SmartKeypadButton({
  id,
  label,
  sublabel,
  isActive = false,
  indicatorColor = '#38bdf8',
  className = '',
  onShortPress,
  onLongPress,
  onLongPressEnd,
}) {
  const { isPressed, isHolding, handlers } = useLongPress({
    thresholdMs: 360,
    repeatIntervalMs: 340, // Continuously steps values (e.g. speed, temp, dimmer) while held
    onShortPress: () => onShortPress?.(id, label),
    onLongPress: () => onLongPress?.(id, label),
    onLongPressEnd: () => onLongPressEnd?.(id, label),
  });

  return (
    <button
      type="button"
      id={`smart-keypad-${id}`}
      className={`smart-button ${isActive ? 'is-active' : ''} ${isPressed ? 'is-pressed' : ''} ${isHolding ? 'is-holding' : ''} ${className}`}
      aria-label={`${label}: ${sublabel || ''} (${isActive ? 'Active' : 'Inactive'})`}
      aria-pressed={isActive}
      {...handlers}
    >
      {/* Pinhole status optical LED */}
      <span
        className={`smart-status-led ${isActive ? 'is-lit' : ''}`}
        style={isActive ? { backgroundColor: indicatorColor, boxShadow: `0 0 6px ${indicatorColor}` } : {}}
        aria-hidden="true"
      />

      {/* Button labels */}
      <div className="smart-button-content">
        <span className="smart-button-title">{label}</span>
        {sublabel && <span className="smart-button-sub">{sublabel}</span>}
      </div>

      {/* Real-time hold charge progress line along bottom seam */}
      <span className="smart-hold-charge-bar" aria-hidden="true" />
    </button>
  );
}
