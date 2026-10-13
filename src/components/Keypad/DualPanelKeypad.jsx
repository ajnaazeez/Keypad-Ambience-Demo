import React from 'react';
import { useLongPress } from '../../hooks/useLongPress';
import './DualPanelKeypad.css';

/**
 * DualPanelQuadrant - Individual touch quadrant for Keypad Type 2
 */
function DualPanelQuadrant({
  id,
  label,
  sublabel,
  positionClass,
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
      id={`dual-btn-${id}`}
      className={`dual-quadrant-btn ${positionClass} ${isActive ? 'is-active' : ''} ${isPressed ? 'is-pressed' : ''} ${isHolding ? 'is-holding' : ''}`}
      aria-label={`${label}${sublabel ? ` (${sublabel})` : ''} - ${isActive ? 'Active' : 'Inactive'}`}
      aria-pressed={isActive}
      {...handlers}
    >
      <div className="dual-quadrant-content">
        <span className="dual-quadrant-label">{label}</span>
        {sublabel && <span className="dual-quadrant-sublabel">{sublabel}</span>}
      </div>

      {/* Subtle corner touch status indicator */}
      <span className="dual-status-pip" aria-hidden="true" />

      {/* Hold radial glow and edge bar */}
      <span className="dual-hold-radial" aria-hidden="true" />
      <span className="dual-hold-bar" aria-hidden="true" />
    </button>
  );
}

/**
 * DualPanelKeypad Component (Reference Image 2)
 * 
 * Recreates the exact physical architectural touch/rocker plate shown in Reference Image 2:
 * - Two large horizontal plates (Top Plate & Bottom Plate)
 * - Sleek horizontal center divider bar / groove
 * - 4 corner touch zones per plate = 8 functional zones
 * - Exact layout:
 *     Top Plate:
 *       Top-Left: Living On       | Top-Right: Living Off
 *       Bottom-Left: AC           | Bottom-Right: Fan
 *     Bottom Plate:
 *       Top-Left: Curtain         | Top-Right: Spotlights
 *       Bottom-Left: Morning      | Bottom-Right: Night
 * - Frameless flush architectural dark charcoal metallic finish
 * - Crisp corner-aligned typography, tactile depression, short/long press support
 */
export default function DualPanelKeypad({
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
  return (
    <div
      className={`dual-keypad-enclosure body-${bodyFinish}`}
      style={{
        '--keypad-btn-bg': buttonColor,
        '--keypad-btn-text': isButtonColorDark ? '#ffffff' : '#1e293b',
        '--keypad-btn-sublabel': isButtonColorDark ? 'rgba(255,255,255,0.65)' : 'rgba(30,41,59,0.7)',
      }}
      role="region"
      aria-label="Dual-Panel Architectural Touch Keypad (Type 2)"
    >
      <div className="dual-keypad-plate">
        {/* TOP PLATE */}
        <div className="dual-plate-half dual-plate-top">
          {/* Top-Left: Living On */}
          <DualPanelQuadrant
            id="living-on"
            label="Living On"
            sublabel={activeScene === 'living-on' ? 'Active' : null}
            positionClass="quad-top-left"
            isActive={activeScene === 'living-on' || Boolean(circuits['living-on'])}
            onShortPress={onShortPress}
            onLongPress={onLongPress}
            onLongPressEnd={onLongPressEnd}
          />

          {/* Top-Right: Living Off */}
          <DualPanelQuadrant
            id="living-off"
            label="Living Off"
            sublabel={activeScene === 'living-off' ? 'Standby' : null}
            positionClass="quad-top-right"
            isActive={activeScene === 'living-off' || Boolean(circuits['living-off'])}
            onShortPress={onShortPress}
            onLongPress={onLongPress}
            onLongPressEnd={onLongPressEnd}
          />

          {/* Bottom-Left: AC */}
          <DualPanelQuadrant
            id="ac"
            label="AC"
            sublabel={acState.on ? `${acState.temp}°C` : null}
            positionClass="quad-bottom-left"
            isActive={Boolean(acState.on)}
            onShortPress={onShortPress}
            onLongPress={onLongPress}
            onLongPressEnd={onLongPressEnd}
          />

          {/* Bottom-Right: Fan */}
          <DualPanelQuadrant
            id="fan"
            label="Fan"
            sublabel={fanState.on ? `Spd ${fanState.speed}` : null}
            positionClass="quad-bottom-right"
            isActive={Boolean(fanState.on)}
            onShortPress={onShortPress}
            onLongPress={onLongPress}
            onLongPressEnd={onLongPressEnd}
          />
        </div>

        {/* Center Horizontal Divider Bar */}
        <div className="dual-center-divider" aria-hidden="true">
          <div className="divider-channel-groove" />
        </div>

        {/* BOTTOM PLATE */}
        <div className="dual-plate-half dual-plate-bottom">
          {/* Top-Left: Curtain */}
          <DualPanelQuadrant
            id="curtain"
            label="Curtain"
            sublabel={curtainState.position > 0 ? `${curtainState.position}%` : 'Closed'}
            positionClass="quad-top-left"
            isActive={curtainState.position > 0}
            onShortPress={onShortPress}
            onLongPress={onLongPress}
            onLongPressEnd={onLongPressEnd}
          />

          {/* Top-Right: Spotlights */}
          <DualPanelQuadrant
            id="spotlights"
            label="Spotlights"
            sublabel={circuits['spotlights'] ? `${dimmers['spotlights'] || 100}%` : null}
            positionClass="quad-top-right"
            isActive={Boolean(circuits['spotlights'])}
            onShortPress={onShortPress}
            onLongPress={onLongPress}
            onLongPressEnd={onLongPressEnd}
          />

          {/* Bottom-Left: Morning */}
          <DualPanelQuadrant
            id="morning"
            label="Morning"
            sublabel={activeScene === 'morning' ? 'Sunrise' : null}
            positionClass="quad-bottom-left"
            isActive={activeScene === 'morning' || Boolean(circuits['morning'])}
            onShortPress={onShortPress}
            onLongPress={onLongPress}
            onLongPressEnd={onLongPressEnd}
          />

          {/* Bottom-Right: Night */}
          <DualPanelQuadrant
            id="night"
            label="Night"
            sublabel={activeScene === 'night' ? 'Nightfall' : null}
            positionClass="quad-bottom-right"
            isActive={activeScene === 'night' || Boolean(circuits['night'])}
            onShortPress={onShortPress}
            onLongPress={onLongPress}
            onLongPressEnd={onLongPressEnd}
          />
        </div>
      </div>
    </div>
  );
}
