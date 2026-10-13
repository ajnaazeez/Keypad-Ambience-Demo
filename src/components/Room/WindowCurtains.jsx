import React, { useState } from 'react';
import './WindowCurtains.css';

/**
 * WindowCurtains Component
 * 
 * Renders motorized luxury floor-to-ceiling pleated drapery over the panoramic terrace window.
 * Features:
 * - Left and Right fabric panels that physically slide apart to open and slide together to close
 * - Ripple fold drapery structure with vertical pleat shadows and specular linen highlights
 * - Continuous position interpolation (0% = fully closed, 100% = fully open)
 * - Realistic fabric stacking & expansion physics
 * - Top concealed architectural track and mounting brackets
 * - Window illumination diffusion layer when curtains are closed
 * - Interactive hover HUD & direct click toggle
 */
export default function WindowCurtains({
  curtainState = { position: 100, isOpen: true },
  onToggle,
  onOpenControls,
}) {
  const { position = 100, isOpen = true } = curtainState;
  const [isHovered, setIsHovered] = useState(false);

  // Effective open percentage
  const openPercent = position !== undefined ? position : (isOpen ? 100 : 0);
  const isFullyClosed = openPercent === 0;
  const isFullyOpen = openPercent === 100;

  // Transform width for each panel:
  // When closed: covers 51% (overlap at center)
  // When open: compresses to 14% at edges
  const stackWidthPercent = 14 + (1 - openPercent / 100) * 37;

  const handleClick = () => {
    if (onOpenControls) {
      onOpenControls('curtain');
    } else if (onToggle) {
      onToggle();
    }
  };

  return (
    <div
      className={`window-curtains-system ${isFullyOpen ? 'is-open' : ''} ${isFullyClosed ? 'is-closed' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Window curtains: ${openPercent}% open. Click to toggle or adjust.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Top Concealed Architectural Header Track */}
      <div className="curtain-header-track">
        <div className="track-rail" />
        <div className="track-bracket bracket-left" />
        <div className="track-bracket bracket-center" />
        <div className="track-bracket bracket-right" />
      </div>

      {/* Behind-Curtain Window Glow / City Backing */}
      <div
        className="curtain-window-backdrop-diffuser"
        style={{ opacity: 1 - openPercent / 100 }}
      />

      {/* Drapery Travel Bay */}
      <div className="curtain-drape-bay">
        {/* Left Curtain Panel (Slides from Left to Center) */}
        <div
          className="curtain-panel panel-left"
          style={{ width: `${stackWidthPercent}%` }}
        >
          <div className="pleat-folds-container">
            <span className="pleat pleat-1" />
            <span className="pleat pleat-2" />
            <span className="pleat pleat-3" />
            <span className="pleat pleat-4" />
            <span className="pleat pleat-5" />
            <span className="pleat pleat-6" />
            <span className="pleat pleat-7" />
          </div>
          <div className="panel-bottom-hem" />
        </div>

        {/* Right Curtain Panel (Slides from Right to Center) */}
        <div
          className="curtain-panel panel-right"
          style={{ width: `${stackWidthPercent}%` }}
        >
          <div className="pleat-folds-container">
            <span className="pleat pleat-7" />
            <span className="pleat pleat-6" />
            <span className="pleat pleat-5" />
            <span className="pleat pleat-4" />
            <span className="pleat pleat-3" />
            <span className="pleat pleat-2" />
            <span className="pleat pleat-1" />
          </div>
          <div className="panel-bottom-hem" />
        </div>
      </div>

      {/* Permanent Architectural Identification Beacon */}
      <div className={`curtain-beacon-pill ${isFullyOpen ? 'is-open' : 'is-closed'}`}>
        <span className="beacon-dot" />
        <span className="beacon-label">Drapes</span>
        <span className="beacon-val">{openPercent}% {isFullyOpen ? 'Open' : isFullyClosed ? 'Closed' : ''}</span>
      </div>

      {/* Interactive Room HUD Badge on Hover */}
      <div className={`curtain-hover-badge ${isHovered ? 'badge-visible' : ''}`}>
        <span className="badge-icon">🪟</span>
        <span className="badge-text">
          Curtains · {openPercent}% {isFullyOpen ? 'Open' : isFullyClosed ? 'Closed' : 'Position'}
        </span>
        <span className="badge-action">Tap to Toggle</span>
      </div>
    </div>
  );
}
