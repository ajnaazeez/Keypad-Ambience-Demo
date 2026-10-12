import React from 'react';
import { useLongPress } from '../../hooks/useLongPress';
import './Keypad.css';

/**
 * Individual precision-machined button for the architectural keypad.
 * Features:
 * - Pointer-based short-press and long-press detection
 * - Active illuminated state with pinhole status LED
 * - Real-time hold charge animation and progress bar along bottom seam
 * - Tactile depression animation matching physical satin-aluminum hardware
 */
export default function KeypadButton({
  id,
  label,
  isActive = false,
  onShortPress,
  onLongPress,
  onLongPressEnd,
}) {
  const { isPressed, isHolding, handlers } = useLongPress({
    thresholdMs: 450,
    onShortPress: () => onShortPress?.(id, label),
    onLongPress: () => onLongPress?.(id, label),
    onLongPressEnd: () => onLongPressEnd?.(id, label),
  });

  return (
    <button
      type="button"
      id={`keypad-btn-${id}`}
      className={`keypad-button ${isActive ? 'is-active' : ''} ${isPressed ? 'is-pressed' : ''} ${isHolding ? 'is-holding' : ''}`}
      aria-label={`${label} (${isActive ? 'Active' : 'Inactive'})`}
      aria-pressed={isActive}
      {...handlers}
    >
      {/* Subtle architectural status pinhole LED */}
      <span className={`keypad-status-led ${isActive ? 'is-lit' : ''}`} aria-hidden="true" />

      {/* Button label */}
      <span className="keypad-button-label">{label}</span>

      {/* Long-press hold aura / glow */}
      <span className="keypad-hold-charge" aria-hidden="true" />

      {/* Real-time hold progress indicator along the bottom seam */}
      <span className="keypad-hold-bar" aria-hidden="true" />
    </button>
  );
}
