import React from 'react';
import { useLongPress } from '../../hooks/useLongPress';
import './GridKeypad.css';

/**
 * GridKeypadButtonItem - Individual precision tactile button for Keypad Type 1
 */
function GridKeypadButtonItem({
  id,
  label,
  sublabel,
  isActive = false,
  onShortPress,
  onLongPress,
  onLongPressEnd,
}) {
  const { isPressed, isHolding, handlers } = useLongPress({
    thresholdMs: 380,
    onShortPress: () => onShortPress?.(id, label),
    onLongPress: () => onLongPress?.(id, label),
    onLongPressEnd: () => onLongPressEnd?.(id, label),
  });

  return (
    <button
      type="button"
      id={`grid-btn-${id}`}
      className={`grid-keypad-btn ${isActive ? 'is-active' : ''} ${isPressed ? 'is-pressed' : ''} ${isHolding ? 'is-holding' : ''}`}
      aria-label={`${label}${sublabel ? ` (${sublabel})` : ''} - ${isActive ? 'Active' : 'Inactive'}`}
      aria-pressed={isActive}
      {...handlers}
    >
      {/* Tactile beveled face of button */}
      <span className="grid-btn-surface">
        <span className="grid-btn-label">{label}</span>
        {sublabel && <span className="grid-btn-sublabel">{sublabel}</span>}
      </span>

      {/* Subtle active status line / LED accent */}
      <span className="grid-btn-status-accent" aria-hidden="true" />

      {/* Long-press progressive charge glow & bar */}
      <span className="grid-btn-hold-fill" aria-hidden="true" />
      <span className="grid-btn-hold-bar" aria-hidden="true" />
    </button>
  );
}

/**
 * GridKeypad Component (Reference Image 1)
 * 
 * Recreates the exact physical architectural keypad shown in Reference Image 1:
 * - Matte black outer bezel frame
 * - Recessed button bay
 * - 2 columns x 4 rows = 8 tactile rectangular push buttons
 * - Exact layout:
 *     Column 1: Living On, AC, Curtain, Morning
 *     Column 2: Living Off, Fan, Spotlights, Night
 * - Perfectly centered white labels, clean sans-serif typography
 * - Tactile depression, short-press and long-press support
 */
export default function GridKeypad({
  circuits = {},
  dimmers = {},
  fanState = { on: false, speed: 3 },
  acState = { on: false, temp: 22, mode: 'cool' },
  curtainState = { position: 100, isOpen: true },
  activeScene = 'living-off',
  bodyFinish = 'white',
  buttonColor = '#26384d',
  isButtonColorDark = true,
  onShortPress,
  onLongPress,
  onLongPressEnd,
}) {
  // Column 1 buttons (Left)
  const leftColumnButtons = [
    {
      id: 'living-on',
      label: 'Living On',
      sublabel: activeScene === 'living-on' ? 'Active' : null,
      isActive: activeScene === 'living-on' || Boolean(circuits['living-on']),
    },
    {
      id: 'ac',
      label: 'AC',
      sublabel: acState.on ? `${acState.temp}°C` : null,
      isActive: Boolean(acState.on),
    },
    {
      id: 'curtain',
      label: 'Curtain',
      sublabel: curtainState.position > 0 ? `${curtainState.position}%` : 'Closed',
      isActive: curtainState.position > 0,
    },
    {
      id: 'morning',
      label: 'Morning',
      sublabel: activeScene === 'morning' ? 'Sunrise' : null,
      isActive: activeScene === 'morning' || Boolean(circuits['morning']),
    },
  ];

  // Column 2 buttons (Right)
  const rightColumnButtons = [
    {
      id: 'living-off',
      label: 'Living Off',
      sublabel: activeScene === 'living-off' ? 'Standby' : null,
      isActive: activeScene === 'living-off' || Boolean(circuits['living-off']),
    },
    {
      id: 'fan',
      label: 'Fan',
      sublabel: fanState.on ? `Spd ${fanState.speed}` : null,
      isActive: Boolean(fanState.on),
    },
    {
      id: 'spotlights',
      label: 'Spotlights',
      sublabel: circuits['spotlights'] ? `${dimmers['spotlights'] || 100}%` : null,
      isActive: Boolean(circuits['spotlights']),
    },
    {
      id: 'night',
      label: 'Night',
      sublabel: activeScene === 'night' ? 'Nightfall' : null,
      isActive: activeScene === 'night' || Boolean(circuits['night']),
    },
  ];

  return (
    <div
      className={`grid-keypad-enclosure body-${bodyFinish}`}
      style={{
        '--keypad-btn-bg': buttonColor,
        '--keypad-btn-text': isButtonColorDark ? '#ffffff' : '#1e293b',
        '--keypad-btn-sublabel': isButtonColorDark ? 'rgba(255,255,255,0.65)' : 'rgba(30,41,59,0.7)',
      }}
      role="region"
      aria-label="8-Button Architectural Keypad (Type 1)"
    >
      {/* Matte Black Recessed Faceplate */}
      <div className="grid-keypad-faceplate">
        {/* Recessed Inner Button Bay */}
        <div className="grid-keypad-bay">
          {/* Left Column (Living On, AC, Curtain, Morning) */}
          <div className="grid-keypad-column grid-col-left">
            {leftColumnButtons.map((btn) => (
              <GridKeypadButtonItem
                key={btn.id}
                id={btn.id}
                label={btn.label}
                sublabel={btn.sublabel}
                isActive={btn.isActive}
                onShortPress={onShortPress}
                onLongPress={onLongPress}
                onLongPressEnd={onLongPressEnd}
              />
            ))}
          </div>

          {/* Right Column (Living Off, Fan, Spotlights, Night) */}
          <div className="grid-keypad-column grid-col-right">
            {rightColumnButtons.map((btn) => (
              <GridKeypadButtonItem
                key={btn.id}
                id={btn.id}
                label={btn.label}
                sublabel={btn.sublabel}
                isActive={btn.isActive}
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
