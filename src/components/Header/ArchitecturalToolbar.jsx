import React from 'react';
import { BUTTON_PALETTES } from '../../constants/palettes';
import './ArchitecturalToolbar.css';

/**
 * ArchitecturalToolbar Component
 * Replaces the old navbar status pills with:
 * 1. [📱 APP] button (opens companion mobile simulator)
 * 2. [LIGHT / DARK] theme toggle button
 * 3. BODY finish selector (White / Black)
 * 4. BUTTONS color swatches selector (8 architectural colors)
 */
export default function ArchitecturalToolbar({
  theme = 'dark',
  onToggleTheme,
  bodyFinish = 'white',
  onSelectBodyFinish,
  selectedButtonColor = '#26384d',
  onSelectButtonColor,
  onOpenAppModal,
}) {
  return (
    <div className="arch-toolbar" role="region" aria-label="Keypad Style & Mode Controls">
      {/* 1. Mobile App Companion Button */}
      <button
        type="button"
        className="arch-btn arch-btn-app"
        onClick={onOpenAppModal}
        title="Open Mobile Companion App Simulator"
      >
        <span className="app-icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
            <rect x="3" y="1" width="10" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="12.5" r="0.9" />
          </svg>
        </span>
        <span className="arch-btn-text">APP</span>
      </button>

      {/* 2. Light / Dark Website Background Theme Toggle */}
      <button
        type="button"
        className={`arch-btn arch-btn-theme ${theme === 'light' ? 'is-light-active' : 'is-dark-active'}`}
        onClick={onToggleTheme}
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      >
        {theme === 'dark' ? (
          <>
            <span className="theme-badge-icon icon-sun" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="#ffffff">
                <circle cx="8" cy="8" r="3.2" />
                <path d="M8 1v2m0 10v2M1 8h2m10 0h2m-2.9-4.9l-1.4 1.4m-7.4 7.4l-1.4 1.4m0-10.2l1.4 1.4m7.4 7.4l1.4 1.4" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="theme-text">LIGHT</span>
          </>
        ) : (
          <>
            <span className="theme-badge-icon icon-moon" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="13" height="13" fill="#38bdf8">
                <path d="M6 2a6 6 0 1 0 8 8 7 7 0 0 1-8-8z" />
              </svg>
            </span>
            <span className="theme-text">DARK</span>
          </>
        )}
      </button>

      {/* 3. Combined Body & Button Customizer Bay */}
      <div className="arch-customizer-bay">
        {/* BODY Selection: White vs Black */}
        <div className="bay-group bay-body-group">
          <span className="bay-label">BODY</span>
          <div className="swatches-row">
            {/* White Body Finish */}
            <button
              type="button"
              className={`body-swatch swatch-white ${bodyFinish === 'white' ? 'is-selected' : ''}`}
              onClick={() => onSelectBodyFinish?.('white')}
              title="White Body Finish"
              aria-label="White Body"
            >
              {bodyFinish === 'white' && (
                <span className="swatch-check" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 8 6.5 11.5 13 4.5" />
                  </svg>
                </span>
              )}
            </button>

            {/* Black Body Finish */}
            <button
              type="button"
              className={`body-swatch swatch-black ${bodyFinish === 'black' ? 'is-selected' : ''}`}
              onClick={() => onSelectBodyFinish?.('black')}
              title="Black Body Finish"
              aria-label="Black Body"
            >
              {bodyFinish === 'black' && (
                <span className="swatch-check" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 8 6.5 11.5 13 4.5" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Vertical Divider Seam */}
        <span className="bay-divider-line" aria-hidden="true" />

        {/* BUTTONS Selection: 8 Curated Colors */}
        <div className="bay-group bay-buttons-group">
          <span className="bay-label">BUTTONS</span>
          <div className="swatches-row">
            {BUTTON_PALETTES.map((palette) => {
              const isSelected = selectedButtonColor.toLowerCase() === palette.color.toLowerCase();
              return (
                <button
                  key={palette.id}
                  type="button"
                  className={`color-swatch ${isSelected ? 'is-selected' : ''}`}
                  style={{ backgroundColor: palette.color }}
                  onClick={() => onSelectButtonColor?.(palette.color)}
                  title={`${palette.name} Keypad Buttons`}
                  aria-label={palette.name}
                >
                  {isSelected && (
                    <span className="swatch-check" aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke={palette.isDark ? '#ffffff' : '#1e293b'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 8 6.5 11.5 13 4.5" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
