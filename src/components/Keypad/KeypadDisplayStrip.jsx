import React, { useEffect, useState } from 'react';
import './KeypadDisplayStrip.css';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * KeypadDisplayStrip Component
 * 
 * Recreates the authentic continuous glass OLED display strip found in the ARISS Island Series.
 * Features:
 * - Left pane: Live real-time clock, blinking seconds separator, calendar date, and room temp
 * - Right pane: Context-aware interactive device feedback when buttons are tapped or held:
 *   - Fan: Velocity level bars (1 to 5) + speed readout
 *   - AC: Target temperature + mode glyph (Cool ❄, Dry 💧, Fan 💨)
 *   - Curtain: Travel state (Open, Closed, % position)
 *   - Lighting: Signature scene name + color temperature (e.g. 2700K Warm Gold)
 */
export default function KeypadDisplayStrip({
  lastInteraction = null,
  fanState = { on: false, speed: 3 },
  acState = { on: false, temp: 22, mode: 'cool' },
  curtainState = { position: 100, isOpen: true },
  activeScene = 'living-off',
}) {
  // Live clock state
  const [clock, setClock] = useState(() => {
    const now = new Date();
    const h = String(now.getHours() % 12 || 12).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const dateStr = `${String(now.getDate()).padStart(2, '0')} ${MONTH_NAMES[now.getMonth()]}`;
    return { h, m, ampm, dateStr };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours() % 12 || 12).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      const dateStr = `${String(now.getDate()).padStart(2, '0')} ${MONTH_NAMES[now.getMonth()]}`;
      setClock({ h, m, ampm, dateStr });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine what to display on the right OLED pane
  const renderFeedbackContent = () => {
    if (!lastInteraction) {
      // Default idle state: shows room status
      return (
        <div className="oled-idle-feedback">
          <span className="feedback-badge">ARISS ISLAND</span>
          <span className="feedback-status-line">
            {fanState.on ? `Fan Spd ${fanState.speed}` : ''}
            {fanState.on && acState.on ? ' · ' : ''}
            {acState.on ? `${acState.temp}°C ${acState.mode.toUpperCase()}` : ''}
            {!fanState.on && !acState.on ? 'System Ready' : ''}
          </span>
        </div>
      );
    }

    const { type, id, label } = lastInteraction;

    // Fan interaction
    if (id === 'fan-power' || id === 'fan-speed' || type === 'fan') {
      return (
        <div className="oled-device-feedback feedback-fan">
          <div className="device-feedback-header">
            <span className="feedback-title">FAN</span>
            <span className="feedback-state">{fanState.on ? `SPD ${fanState.speed}` : 'OFF'}</span>
          </div>
          {/* 5 speed segment bars matching reference */}
          <div className="fan-display-segments">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <span
                key={lvl}
                className={`fan-seg-bar ${fanState.on && fanState.speed >= lvl ? 'seg-lit' : ''}`}
              />
            ))}
          </div>
        </div>
      );
    }

    // AC interaction
    if (id === 'ac-power' || id === 'ac-temp' || type === 'ac') {
      return (
        <div className="oled-device-feedback feedback-ac">
          <div className="device-feedback-header">
            <span className="feedback-title">CLIMATE</span>
            <span className="feedback-state">{acState.on ? `${acState.temp}°C` : 'OFF'}</span>
          </div>
          <div className="ac-display-indicators">
            <span className="ac-mode-tag">{acState.mode.toUpperCase()}</span>
            <span className="ac-fan-tag">{acState.fanSpeed || 'MED'}</span>
          </div>
        </div>
      );
    }

    // Curtain interaction
    if (id === 'curtain-open' || id === 'curtain-close' || type === 'curtain') {
      return (
        <div className="oled-device-feedback feedback-curtain">
          <div className="device-feedback-header">
            <span className="feedback-title">DRAPES</span>
            <span className="feedback-state">{curtainState.position}%</span>
          </div>
          <div className="curtain-display-progress">
            <div
              className="curtain-progress-fill"
              style={{ width: `${curtainState.position}%` }}
            />
          </div>
        </div>
      );
    }

    // Lighting interaction
    return (
      <div className="oled-device-feedback feedback-lighting">
        <div className="device-feedback-header">
          <span className="feedback-title">{label || 'LIGHTING'}</span>
          <span className="feedback-state">{type === 'long-press' ? 'HOLD' : 'ACTIVE'}</span>
        </div>
        <span className="lighting-scene-name">
          {activeScene === 'relax' ? '2200K Relax Scene' : activeScene === 'living-on' ? 'Master 3200K' : 'Circuit Engaged'}
        </span>
      </div>
    );
  };

  return (
    <div className="keypad-display-strip" aria-label="Keypad OLED Display Strip">
      {/* Specular glass reflection overlay */}
      <div className="display-glass-specular" />

      {/* Left OLED pane: Clock, date, room temp */}
      <div className="display-pane pane-left">
        <div className="oled-time-cluster">
          <span className="time-hours">{clock.h}</span>
          <span className="time-colon">:</span>
          <span className="time-minutes">{clock.m}</span>
          <span className="time-ampm">{clock.ampm}</span>
        </div>
        <div className="oled-sub-line">
          <span className="sub-date">{clock.dateStr}</span>
          <span className="sub-temp">24°C</span>
        </div>
      </div>

      {/* Center divider seam */}
      <div className="display-center-divider" />

      {/* Right OLED pane: Live interactive feedback */}
      <div className="display-pane pane-right">
        {renderFeedbackContent()}
      </div>
    </div>
  );
}
