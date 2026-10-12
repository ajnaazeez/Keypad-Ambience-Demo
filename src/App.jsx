import React, { useState, useCallback } from "react";
import Keypad from "./components/Keypad/Keypad";
import AmbienceBackdrop from "./components/Ambience/AmbienceBackdrop";
import "./App.css";

// 5 General lighting circuits
const GENERAL_CIRCUITS = ["main-light", "ceiling", "chandelier", "spotlights", "cove"];

// Per-button signature architectural ambience scenes
export const SCENE_CONFIGS = {
  "chandelier": {
    name: "Warm Golden Chandelier",
    cct: "2700K Warm Gold",
    circuits: {
      "chandelier": true,
      "cove": false,
      "spotlights": false,
      "main-light": false,
      "ceiling": false,
      "relax": false,
      "living-on": false,
      "living-off": false,
    },
    detail: "Chandelier Ambience engaged · 2700K warm golden focal crystal radiance centered over living table",
  },
  "spotlights": {
    name: "Architectural Gallery",
    cct: "3000K Gallery Accent",
    circuits: {
      "spotlights": true,
      "chandelier": false,
      "cove": false,
      "main-light": false,
      "ceiling": false,
      "relax": false,
      "living-on": false,
      "living-off": false,
    },
    detail: "Gallery Spotlights Ambience engaged · recessed directional downlight cones accenting artwork & fireplace",
  },
  "cove": {
    name: "Perimeter Cove Tray",
    cct: "2800K Perimeter Cove",
    circuits: {
      "cove": true,
      "chandelier": false,
      "spotlights": false,
      "main-light": false,
      "ceiling": false,
      "relax": false,
      "living-on": false,
      "living-off": false,
    },
    detail: "Cove Ambience engaged · 2800K soft perimeter ceiling tray LED channel lifting architectural volume",
  },
  "main-light": {
    name: "Neutral Daylight Wash",
    cct: "4000K Neutral Daylight",
    circuits: {
      "main-light": true,
      "ceiling": false,
      "chandelier": false,
      "spotlights": false,
      "cove": false,
      "relax": false,
      "living-on": false,
      "living-off": false,
    },
    detail: "Main Light Ambience engaged · 4000K clean neutral-white ceiling wash providing luminous task illumination",
  },
  "ceiling": {
    name: "Indirect Ceiling Canopy",
    cct: "3000K Indirect Canopy",
    circuits: {
      "ceiling": true,
      "main-light": false,
      "chandelier": false,
      "spotlights": false,
      "cove": false,
      "relax": false,
      "living-on": false,
      "living-off": false,
    },
    detail: "Ceiling Ambience engaged · soft 3000K indirect upward architectural bounce with glare-free canopy fill",
  },
  "relax": {
    name: "Sunset Amber Lounge",
    cct: "2200K Sunset Amber",
    circuits: {
      "relax": true,
      "chandelier": true,
      "cove": true,
      "main-light": false,
      "ceiling": false,
      "spotlights": false,
      "living-on": false,
      "living-off": false,
    },
    detail: "Relax Ambience engaged · ultra-warm 2200K sunset amber sanctuary with golden chandelier & perimeter cove glow",
  },
  "living-on": {
    name: "Master Living Showcase",
    cct: "3200K Master Harmony",
    circuits: {
      "living-on": true,
      "living-off": false,
      "main-light": true,
      "ceiling": true,
      "chandelier": true,
      "spotlights": true,
      "cove": true,
      "relax": false,
    },
    detail: "Master Living Showcase engaged · all architectural lighting circuits orchestrated in 3200K balanced harmony",
  },
  "living-off": {
    name: "Nighttime Calm Standby",
    cct: "Standby Calm",
    circuits: {
      "living-off": true,
      "living-on": false,
      "main-light": false,
      "ceiling": false,
      "chandelier": false,
      "spotlights": false,
      "cove": false,
      "relax": false,
    },
    detail: "Standby Ambience engaged · all fixtures smoothly extinguished into calm nighttime standby",
  },
};

// Fixture badges for display overlay
const FIXTURE_LABELS = {
  "chandelier": "Chandelier 2700K",
  "cove":       "Perimeter Cove",
  "spotlights": "Recessed Spots",
  "main-light": "Main Light 4000K",
  "ceiling":    "Ceiling Wash",
};

export default function App() {
  // Lighting circuit states
  const [circuits, setCircuits] = useState({
    "living-on":  false,
    "living-off": true,
    "main-light": false,
    "ceiling":    false,
    "chandelier": false,
    "spotlights": false,
    "cove":       false,
    "relax":      false,
  });

  // Current active lighting scene ambience
  const [activeScene, setActiveScene] = useState("living-off");

  // Real-time button being held down (> 450ms)
  const [activeHold, setActiveHold] = useState(null);

  // HUD action feedback
  const [lastAction, setLastAction] = useState({
    type:   "ready",
    label:  null,
    detail: "Tap to toggle a circuit — or long-press (450ms) to transform the room's ambience.",
  });

  /** Short-press: standard toggle switch action */
  const handleShortPress = useCallback((id, label) => {
    setCircuits((prev) => {
      const next = { ...prev };

      // Master Living On
      if (id === "living-on") {
        next["living-on"]  = true;
        next["living-off"] = false;
        GENERAL_CIRCUITS.forEach((c) => { next[c] = true; });
        next["relax"] = false;
        setActiveScene("living-on");
        setLastAction({
          type: "short-press",
          label,
          detail: "All circuits ON · broad 3200K warm-white balanced illumination",
        });
        return next;
      }

      // Master Living Off
      if (id === "living-off") {
        next["living-off"] = true;
        next["living-on"]  = false;
        GENERAL_CIRCUITS.forEach((c) => { next[c] = false; });
        next["relax"] = false;
        setActiveScene("living-off");
        setLastAction({
          type: "short-press",
          label,
          detail: "Standby mode engaged · all lighting circuits powered down",
        });
        return next;
      }

      // Relax preset toggle
      if (id === "relax") {
        const turningOn = !prev["relax"];
        next["relax"] = turningOn;
        if (turningOn) {
          next["chandelier"] = true;
          next["cove"]       = true;
          next["main-light"] = false;
          next["ceiling"]    = false;
          next["spotlights"] = false;
          next["living-off"] = false;
          next["living-on"]  = false;
          setActiveScene("relax");
        } else {
          next["chandelier"] = false;
          next["cove"]       = false;
        }
        setLastAction({
          type: "short-press",
          label,
          detail: turningOn
            ? "Relax Scene ON · warm chandelier & cove at 2200K sunset amber"
            : "Relax Scene OFF · ambient circuits dimmed",
        });
        return next;
      }

      // Individual circuit toggle
      const isNowOn = !prev[id];
      next[id] = isNowOn;

      if (isNowOn) {
        next["living-off"] = false;
      }

      const anyOn = GENERAL_CIRCUITS.some((c) => next[c]) || next["relax"];
      const allOn = GENERAL_CIRCUITS.every((c) => next[c]);

      if (!anyOn) {
        next["living-off"] = true;
        next["living-on"]  = false;
        setActiveScene("living-off");
      } else if (allOn) {
        next["living-on"]  = true;
        next["living-off"] = false;
        setActiveScene("living-on");
      } else {
        next["living-on"]  = false;
        next["living-off"] = false;
      }

      setLastAction({
        type:   "short-press",
        label,
        detail: isNowOn
          ? `${label} circuit ON · fixture illuminated`
          : `${label} circuit OFF · fixture extinguished`,
      });

      return next;
    });
  }, []);

  /**
   * Long-press: TRANSFORMS THE ROOM AMBIENCE!
   * Triggered when a user presses and holds any button for 450ms.
   */
  const handleLongPress = useCallback((id, label) => {
    const config = SCENE_CONFIGS[id];
    setActiveHold(id);
    setActiveScene(id);

    if (config) {
      setCircuits(() => ({ ...config.circuits }));
    }

    setLastAction({
      type:   "long-press",
      label,
      detail: config ? config.detail : `Ambience transformed to ${label}`,
    });
  }, []);

  /**
   * Long-press end: PERSISTS THE AMBIENCE UPON BUTTON RELEASE!
   * The signature lighting ambience remains actively engaged.
   */
  const handleLongPressEnd = useCallback((id, label) => {
    const config = SCENE_CONFIGS[id];
    setActiveHold(null);
    setActiveScene(id); // Confirms persistence

    if (config) {
      setCircuits(() => ({ ...config.circuits }));
    }

    setLastAction({
      type:   "long-press-settled",
      label,
      detail: `✓ Ambience Settled · ${config ? config.name : label} scene engaged`,
    });
  }, []);

  // Active lighting circuit count
  const activeCount = GENERAL_CIRCUITS.filter((c) => circuits[c]).length;

  // Active fixture chips
  const activeFixtures = Object.entries(FIXTURE_LABELS)
    .filter(([id]) => circuits[id])
    .map(([id, lbl]) => ({ id, lbl }));

  // Room illumination status
  const isStandby = Boolean(circuits["living-off"]) && !activeHold;

  // Active color temperature badge
  const activeConfig = SCENE_CONFIGS[activeHold || activeScene];
  const colorTempLabel = isStandby ? "Standby Calm" : (activeConfig ? activeConfig.cct : "3000K Architectural");

  return (
    <div className="showroom-app">
      {/* Top Navbar */}
      <header className="showroom-nav">
        <div className="nav-brand">
          <span className="brand-badge">ARISS</span>
          <span className="brand-series">ISLAND SERIES</span>
          <span className="brand-sub">Architectural Lighting Demo</span>
        </div>
        <div className="nav-status">
          <span className={`status-dot ${isStandby ? "dot-off" : "dot-on"}`} />
          <span className="status-text">
            {isStandby
              ? "Standby Mode"
              : `${activeCount} Circuit${activeCount !== 1 ? "s" : ""} Active`}
          </span>
          <span className="temp-badge">{colorTempLabel}</span>
        </div>
      </header>

      {/* Main Two-Pane Stage */}
      <main className="showroom-main-stage">
        {/* Left Pane: Living Room Architectural Showcase */}
        <section className="showroom-room-pane" aria-label="Living Room Lighting Showcase">
          <div className="room-viewport-frame">
            <AmbienceBackdrop
              circuits={circuits}
              activeScene={activeScene}
              activeHold={activeHold}
            />

            {/* Top Room Banner Overlay */}
            <div className="room-header-overlay">
              <span className="room-title-tag">
                <span className="room-icon">✦</span> Luxury Penthouse · Living Room
              </span>
              <span className={`room-scene-badge ${activeHold ? "scene-morphing" : "scene-settled"}`}>
                {activeHold
                  ? `Hold: Transforming to ${SCENE_CONFIGS[activeHold]?.name || activeHold}...`
                  : `✦ Ambience: ${SCENE_CONFIGS[activeScene]?.name || "Architectural Showcase"}`}
              </span>
            </div>

            {/* Bottom Overlay: Active Fixture Chips */}
            {activeFixtures.length > 0 && (
              <div className="room-footer-overlay">
                <div className="active-chips-list">
                  {activeFixtures.map(({ id, lbl }) => (
                    <span key={id} className="fixture-chip chip-active">
                      {lbl}
                    </span>
                  ))}
                  {circuits["relax"] && (
                    <span className="fixture-chip chip-relax">Relax 2200K</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Pane: Wall Controller Keypad */}
        <aside className={`showroom-control-pane${!isStandby ? " pane-lit" : ""}`} aria-label="Wall Controller Keypad">
          <div className="controller-wall-panel">
            <div className="panel-header">
              <span className="panel-kicker">Wall Mounted Controller</span>
              <h2 className="panel-title">8-Button Keypad</h2>
              <p className="panel-desc">
                Tap to toggle · <strong>Long-press (450ms) to transform ambience</strong>
              </p>
            </div>

            <div className="keypad-mount-area">
              <Keypad
                circuits={circuits}
                onShortPress={handleShortPress}
                onLongPress={handleLongPress}
                onLongPressEnd={handleLongPressEnd}
              />
            </div>

            {/* Real-Time Action HUD */}
            <div className="panel-hud">
              <div className="hud-action-row">
                <span className={`hud-action-tag tag-${lastAction.type}`}>
                  {lastAction.type === "short-press"       && "Tap"}
                  {lastAction.type === "long-press"        && "Hold"}
                  {lastAction.type === "long-press-settled" && "Settled"}
                  {lastAction.type === "ready"             && "Ready"}
                </span>
                <span className="hud-action-label">
                  {lastAction.label && <strong>{lastAction.label}: </strong>}
                  {lastAction.detail}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
