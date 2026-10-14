import React, { useState, useCallback } from "react";
import CodeLuxuryRoom from "./components/Room/CodeLuxuryRoom";
import GridKeypad from "./components/Keypad/GridKeypad";
import DualPanelKeypad from "./components/Keypad/DualPanelKeypad";
import KeypadCrownDisplay from "./components/Keypad/KeypadCrownDisplay";
import ArchitecturalToolbar from "./components/Header/ArchitecturalToolbar";
import { BUTTON_PALETTES } from "./constants/palettes";
import InlineAppView from "./components/AppSimulator/InlineAppView";
import "./App.css";

// All architectural lighting circuits for global shutoff (Living Off)
const ALL_LIGHTING_FIXTURES = ["spotlights", "chandelier", "cove", "main-light", "ceiling"];
// Ambient architectural lighting circuits engaged by Living On (Spotlights are independent!)
const LIVING_ROOM_FIXTURES = ["chandelier", "cove", "main-light", "ceiling"];

export default function App() {
  // Keypad design selector: 'grid' (Reference Image 1) vs 'dual-panel' (Reference Image 2)
  const [keypadType, setKeypadType] = useState("grid");
  // Controller view mode: 'keypad' (default physical wall keypad) vs 'app' (in-place smartphone app simulator)
  const [controllerView, setControllerView] = useState("keypad");

  // Customization & Architectural Mode States (Reference Images 2, 3, 4, 5)
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light' (website background theme)
  const [bodyFinish, setBodyFinish] = useState("black"); // 'white' | 'black' (keypad bezel body finish)
  const [buttonColor, setButtonColor] = useState("#000000"); // '#000000' Obsidian Black default

  // Compute label text contrast based on selected button color
  const selectedPalette = BUTTON_PALETTES.find(
    (p) => p.color.toLowerCase() === buttonColor.toLowerCase()
  );
  const isButtonColorDark = selectedPalette ? selectedPalette.isDark : true;

  // 1. Lighting Circuit ON/OFF States (DEFAULT: Living On active)
  const [circuits, setCircuits] = useState({
    "living-on":  true,
    "living-off": false,
    "spotlights": false,
    "chandelier": true,
    "cove":       true,
    "main-light": true,
    "ceiling":    true,
    "morning":    false,
    "night":      false,
    "relax":      false,
  });

  // 2. Dimmer Brightness Levels (25%, 50%, 75%, 100%)
  const [dimmers, setDimmers] = useState({
    "spotlights": 100,
    "chandelier": 100,
    "cove":       100,
    "main-light": 100,
    "ceiling":    100,
  });

  // Current active lighting & environment scene (DEFAULT: 'living-on')
  const [activeScene, setActiveScene] = useState("living-on");

  // 3. Ceiling Fan State (DEFAULT: OFF)
  const [fanState, setFanState] = useState({
    on: false,
    speed: 2,
  });

  // 4. Wall AC State (DEFAULT: OFF)
  const [acState, setAcState] = useState({
    on: false,
    temp: 22,
    mode: "cool",
  });

  // 5. Motorized Curtains State (DEFAULT: Closed / 0%)
  const [curtainState, setCurtainState] = useState({
    position: 0,
    isOpen: false,
  });

  // 6. Live Interaction HUD (DEFAULT: Living On active)
  const [lastInteraction, setLastInteraction] = useState({
    type:   "scene",
    id:     "living-on",
    label:  "Living On",
    detail: "Living On engaged · chandelier and cove lighting illuminated (Spotlights remain independent)",
  });

  // Direct Fan Speed Setter (from Crown Display pills 1, 2, 3, 4)
  const handleSetFanSpeed = useCallback((speed) => {
    setFanState({ on: true, speed });
    setLastInteraction({
      type: "fan",
      id: "fan-speed",
      label: "Fan Speed",
      detail: `Fan Speed set to ${speed} of 4 · rotation velocity accelerating`,
    });
  }, []);

  /**
   * Short-Press Handler (Tap / Click < 380ms)
   * Instantly toggles the target circuit or device ON/OFF
   */
  const handleShortPress = useCallback((id, _label) => {
    // 1. Ceiling Fan Toggle
    if (id === "fan") {
      setFanState((prev) => {
        const nextOn = !prev.on;
        setLastInteraction({
          type: "fan",
          id: "fan-power",
          label: "Ceiling Fan",
          detail: nextOn
            ? `Fan ON (Speed ${prev.speed}) · blades rotating with physics inertia`
            : "Fan OFF · blades coasting to stop",
        });
        return { ...prev, on: nextOn };
      });
      return;
    }

    // 2. Wall AC Toggle
    if (id === "ac") {
      setAcState((prev) => {
        const nextOn = !prev.on;
        setLastInteraction({
          type: "ac",
          id: "ac-power",
          label: "Wall AC",
          detail: nextOn
            ? `AC ON at ${prev.temp}°C · louver opened & airflow streams active`
            : "AC powered OFF · motorized louver closed",
        });
        return { ...prev, on: nextOn };
      });
      return;
    }

    // 3. Motorized Curtain Toggle (Open <-> Close)
    if (id === "curtain") {
      setCurtainState((prev) => {
        const nextPos = prev.position > 0 ? 0 : 100;
        setLastInteraction({
          type: "curtain",
          id: nextPos > 0 ? "curtain-open" : "curtain-close",
          label: "Motorized Curtains",
          detail: nextPos > 0
            ? "Curtains sliding open · panoramic city skyline & balcony revealed"
            : "Curtains sliding closed · window draped in luxury ivory bouclé",
        });
        return { position: nextPos, isOpen: nextPos > 0 };
      });
      return;
    }

    // 4. Spotlights Toggle (Visible ceiling fixtures & downlight cones)
    if (id === "spotlights") {
      setCircuits((prev) => {
        const nextOn = !prev.spotlights;
        setLastInteraction({
          type: "spotlights",
          id: "spotlights",
          label: "Recessed Spotlights",
          detail: nextOn
            ? `Spotlights ON (${dimmers.spotlights || 100}%) · 5 visible ceiling brass fixtures illuminated`
            : "Spotlights extinguished · fixture lenses dark",
        });
        return { ...prev, spotlights: nextOn };
      });
      return;
    }

    // 5. Morning Scene Mode
    if (id === "morning") {
      setActiveScene("morning");
      setCircuits((prev) => ({
        ...prev,
        morning: true,
        night: false,
        "living-off": false,
        "living-on": false,
      }));
      // Curtains smoothly glide open for natural morning light
      setCurtainState({ position: 100, isOpen: true });
      setLastInteraction({
        type: "morning",
        id: "morning",
        label: "Morning Ambience",
        detail: "Morning sunrise engaged · radiant golden sunbeams streaming through window & natural daylight fill",
      });
      return;
    }

    // 6. Night Scene Mode
    if (id === "night") {
      setActiveScene("night");
      setCircuits((prev) => ({
        ...prev,
        night: true,
        morning: false,
        "living-off": false,
        "living-on": false,
      }));
      setLastInteraction({
        type: "night",
        id: "night",
        label: "Night Ambience",
        detail: "Night mode engaged · nocturnal starry skyline, glowing tower windows & calm evening room illumination",
      });
      return;
    }

    // 7. Master Living On (Turns on ambient living room fixtures; Spotlights remain independent!)
    if (id === "living-on") {
      setActiveScene("living-on");
      setCircuits((prev) => {
        const next = { ...prev };
        next["living-on"]  = true;
        next["living-off"] = false;
        next["morning"]    = false;
        next["night"]      = false;
        // Turn ON ambient living room fixtures (Chandelier, Cove, Ceiling, Main Light)
        // Spotlights remain independent and OFF unless specifically toggled!
        LIVING_ROOM_FIXTURES.forEach((f) => { next[f] = true; });
        return next;
      });
      setLastInteraction({
        type: "scene",
        id: "living-on",
        label: "Living On",
        detail: "Living On engaged · chandelier and cove lighting illuminated (Spotlights remain independent)",
      });
      return;
    }

    // 8. Master Living Off (Turns off all lighting circuits)
    if (id === "living-off") {
      setActiveScene("living-off");
      setCircuits((prev) => {
        const next = { ...prev };
        next["living-off"] = true;
        next["living-on"]  = false;
        next["morning"]    = false;
        next["night"]      = false;
        next["relax"]      = false;
        ALL_LIGHTING_FIXTURES.forEach((f) => { next[f] = false; });
        return next;
      });
      setLastInteraction({
        type: "scene",
        id: "living-off",
        label: "Living Off",
        detail: "Standby calm engaged · all lighting circuits smoothly extinguished",
      });
      return;
    }

    // 9. Architectural Lights Toggle (from 6-Button Keypad & Crown Display)
    if (id === "lights") {
      setCircuits((prev) => {
        const nextOn = !prev["living-on"];
        const next = { ...prev, "living-on": nextOn, "living-off": !nextOn };
        if (nextOn) {
          LIVING_ROOM_FIXTURES.forEach((f) => { next[f] = true; });
        } else {
          ALL_LIGHTING_FIXTURES.forEach((f) => { next[f] = false; });
        }
        setActiveScene(nextOn ? "living-on" : "living-off");
        setLastInteraction({
          type: "scene",
          id: "lights",
          label: "Lights",
          detail: nextOn
            ? "Room lights illuminated · chandelier and cove lighting active (Spotlights independent)"
            : "Room lights extinguished · standby mode",
        });
        return next;
      });
      return;
    }

    // 10. Master Switch Toggle (from 6-Button Keypad & Crown Display)
    if (id === "switch") {
      setCircuits((prev) => {
        const nextOn = !prev["living-on"];
        const next = { ...prev, "living-on": nextOn, "living-off": !nextOn };
        if (nextOn) {
          LIVING_ROOM_FIXTURES.forEach((f) => { next[f] = true; });
        } else {
          ALL_LIGHTING_FIXTURES.forEach((f) => { next[f] = false; });
        }
        setActiveScene(nextOn ? "living-on" : "living-off");
        setLastInteraction({
          type: "scene",
          id: "switch",
          label: "Master Switch",
          detail: nextOn ? "Master switch ON · room circuits active" : "Master switch OFF · room standby",
        });
        return next;
      });
      return;
    }

    // 11. Relax Ambience Toggle (from 6-Button Keypad & Crown Display)
    if (id === "relax") {
      setCircuits((prev) => {
        const nextRelax = !prev.relax;
        setLastInteraction({
          type: "scene",
          id: "relax",
          label: "Relax Mode",
          detail: nextRelax
            ? "Warm 2200K amber sanctuary engaged · soothing cove & chandelier"
            : "Relax scene disengaged",
        });
        return {
          ...prev,
          relax: nextRelax,
          cove: true,
          chandelier: true,
          "living-on": true,
          "living-off": false,
        };
      });
      return;
    }

    // 12. AC Temp Steppers (from Crown Display)
    if (id === "ac-up") {
      setAcState((prev) => {
        const nextTemp = Math.min(30, prev.temp + 1);
        setLastInteraction({
          type: "ac",
          id: "ac-temp",
          label: "Wall AC",
          detail: `Target temperature adjusted to ${nextTemp}°C`,
        });
        return { ...prev, on: true, temp: nextTemp };
      });
      return;
    }

    if (id === "ac-down") {
      setAcState((prev) => {
        const nextTemp = Math.max(18, prev.temp - 1);
        setLastInteraction({
          type: "ac",
          id: "ac-temp",
          label: "Wall AC",
          detail: `Target temperature adjusted to ${nextTemp}°C`,
        });
        return { ...prev, on: true, temp: nextTemp };
      });
      return;
    }
  }, [dimmers]);

  /**
   * Progressive Long-Press Handler (Hold >= 380ms & Continuous Repeat while Held)
   * Progressively steps values (Fan Speed 1-5, AC Temp 18-30°C, Curtain 0-100%, Spotlights 25-100%)
   */
  const handleLongPress = useCallback((id, _label) => {
    // 1. Progressive Fan Speed Adjustment (Speed 1 -> 2 -> 3 -> 4 -> 1...)
    if (id === "fan") {
      setFanState((prev) => {
        const nextSpeed = prev.speed >= 4 ? 1 : prev.speed + 1;
        setLastInteraction({
          type: "fan",
          id: "fan-speed",
          label: "Fan Speed",
          detail: `Holding: Speed stepped to ${nextSpeed} of 4 · rotation velocity accelerating`,
        });
        return { on: true, speed: nextSpeed };
      });
      return;
    }

    // 2. Progressive AC Temperature Adjustment (18°C -> 19°C ... -> 30°C -> 18°C)
    if (id === "ac") {
      setAcState((prev) => {
        const nextTemp = prev.temp >= 30 ? 18 : prev.temp + 1;
        setLastInteraction({
          type: "ac",
          id: "ac-temp",
          label: "AC Temperature",
          detail: `Holding: Target temperature stepped to ${nextTemp}°C · airflow active`,
        });
        return { on: true, temp: nextTemp, mode: prev.mode };
      });
      return;
    }

    // 3. Progressive Curtain Travel (0% -> 25% -> 50% -> 75% -> 100% -> 0%)
    if (id === "curtain") {
      setCurtainState((prev) => {
        const step = 25;
        const nextPos = prev.position >= 100 ? 0 : prev.position + step;
        setLastInteraction({
          type: "curtain",
          id: "curtain-hold",
          label: "Curtain Travel",
          detail: `Holding: Drapes stepped to ${nextPos}% ${nextPos === 100 ? "Fully Open" : nextPos === 0 ? "Fully Closed" : "Position"}`,
        });
        return { position: nextPos, isOpen: nextPos > 0 };
      });
      return;
    }

    // 4. Progressive Spotlight Dimming (25% -> 50% -> 75% -> 100% -> 25%)
    if (id === "spotlights") {
      setDimmers((prev) => {
        const curLevel = prev.spotlights || 100;
        const levels = [25, 50, 75, 100];
        const nextIndex = (levels.indexOf(curLevel) + 1) % levels.length;
        const nextLevel = levels[nextIndex];
        setCircuits((c) => ({ ...c, spotlights: true, "living-off": false }));
        setLastInteraction({
          type: "dimmer",
          id: "spotlights",
          label: "Spotlight Dimmer",
          detail: `Holding: Spotlights dimmed to ${nextLevel}% intensity · 5 downward beam cones adjusted`,
        });
        return { ...prev, spotlights: nextLevel };
      });
      return;
    }

    // 5. Master Living On Hold (Living Room Fixtures Boost)
    if (id === "living-on") {
      setDimmers((prev) => ({ ...prev, chandelier: 100, cove: 100, "main-light": 100, ceiling: 100 }));
      setCircuits((prev) => ({
        ...prev,
        "living-on": true,
        "living-off": false,
        chandelier: true,
        cove: true,
        "main-light": true,
        ceiling: true,
      }));
      setActiveScene("living-on");
      setLastInteraction({
        type: "scene",
        id: "living-on",
        label: "Master Brilliance",
        detail: "Holding: Living room architectural circuits boosted to 100% luminance",
      });
      return;
    }

    // 6. Morning Mode Hold (Max Sunrise Daylight)
    if (id === "morning") {
      setCurtainState({ position: 100, isOpen: true });
      setActiveScene("morning");
      setCircuits((prev) => ({ ...prev, morning: true, night: false, "living-off": false }));
      setLastInteraction({
        type: "morning",
        id: "morning",
        label: "Sunrise Brilliance",
        detail: "Holding: Curtains 100% open · golden morning sunlight & natural daylight boosted",
      });
      return;
    }

    // 7. Night Mode Hold (Nocturnal Sanctuary)
    if (id === "night") {
      setCurtainState({ position: 0, isOpen: false });
      setActiveScene("night");
      setCircuits((prev) => ({ ...prev, night: true, morning: false, "living-off": false }));
      setLastInteraction({
        type: "night",
        id: "night",
        label: "Nocturnal Sanctuary",
        detail: "Holding: Curtains closed 0% for privacy · serene nocturnal calmness",
      });
      return;
    }

    // 8. Living Off Hold
    if (id === "living-off") {
      setLastInteraction({
        type: "scene",
        id: "living-off",
        label: "Standby Calm",
        detail: "Holding: Architectural lighting locked into nighttime calm standby",
      });
      return;
    }

    // 9. Lights / Switch Hold Dimming
    if (id === "lights" || id === "switch") {
      setDimmers((prev) => {
        const curLevel = prev.chandelier || 100;
        const levels = [25, 50, 75, 100];
        const nextIndex = (levels.indexOf(curLevel) + 1) % levels.length;
        const nextLevel = levels[nextIndex];
        setCircuits((c) => ({ ...c, "living-on": true, "living-off": false, chandelier: true, cove: true, "main-light": true, ceiling: true }));
        setLastInteraction({
          type: "dimmer",
          id: "lights",
          label: "Lights Dimmer",
          detail: `Holding: Living room lighting dimmed to ${nextLevel}% intensity`,
        });
        return { ...prev, chandelier: nextLevel, cove: nextLevel, "main-light": nextLevel, ceiling: nextLevel };
      });
      return;
    }

    // 10. Relax Sanctuary Hold
    if (id === "relax") {
      setCircuits((prev) => ({ ...prev, relax: true, "living-on": true, "living-off": false, cove: true, chandelier: true }));
      setLastInteraction({
        type: "scene",
        id: "relax",
        label: "Relax Sanctuary",
        detail: "Holding: Deep amber 2200K relaxation mode locked in",
      });
    }
  }, []);

  /**
   * Hold Release Handler
   */
  const handleLongPressEnd = useCallback((id, label) => {
    setLastInteraction((prev) => ({
      ...prev,
      detail: `✓ ${label} settled · state locked in`,
    }));
  }, []);



  return (
    <div className={`showroom-app theme-${theme}`}>
      {/* Top Navbar */}
      <header className="showroom-nav">
        <div className="nav-brand">
          <span className="brand-badge">LUMINA</span>
          <span className="brand-series">ARCHITECTURAL SERIES</span>
          <span className="brand-sub">Smart Keypad & Living Room Simulator</span>
        </div>

        {/* Architectural Toolbar replacing old navbar status pills (Reference Images 2, 4) */}
        <ArchitecturalToolbar
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          bodyFinish={bodyFinish}
          onSelectBodyFinish={setBodyFinish}
          selectedButtonColor={buttonColor}
          onSelectButtonColor={setButtonColor}
          activeViewMode={controllerView}
          onToggleViewMode={() => setControllerView((prev) => (prev === "app" ? "keypad" : "app"))}
        />
      </header>

      {/* Main Two-Pane Showroom Composition */}
      <main className="showroom-main-stage">
        {/* Left Pane: 100% Code-Generated Architectural Living Room (Zero External Images) */}
        <section className="showroom-room-pane" aria-label="Living Room Smart Home Showcase">
          <div className="room-viewport-frame">
            <CodeLuxuryRoom
              circuits={circuits}
              dimmers={dimmers}
              activeScene={activeScene}
              fanState={fanState}
              acState={acState}
              curtainState={curtainState}
              onToggleDevice={(dev) => handleShortPress(dev, dev)}
              onToggleFixture={(fix) => handleShortPress(fix, fix)}
            />
          </div>
        </section>

        {/* Right Pane: Keypad Selector & Architectural Keypad Station */}
        <aside className="showroom-control-pane" aria-label="Smart Wall Controller Keypad">
          <div className="controller-wall-panel">
            {/* Keypad Type Selection Option (visible in Keypad mode) */}
            {controllerView === "keypad" && (
              <div className="keypad-type-bar" role="tablist" aria-label="Select Keypad Type">
                <button
                  type="button"
                  role="tab"
                  id="tab-keypad-grid"
                  aria-selected={keypadType === "grid"}
                  aria-controls="keypad-grid-view"
                  className={`keypad-type-btn ${keypadType === "grid" ? "is-active" : ""}`}
                  onClick={() => setKeypadType("grid")}
                >
                  <div className="type-icon-grid" aria-hidden="true">
                    <span /><span />
                    <span /><span />
                    <span /><span />
                    <span /><span />
                  </div>
                  <div className="type-btn-text">
                    <span className="type-btn-title">8-Button Grid</span>
                    <span className="type-btn-ref">Keypad Type 1</span>
                  </div>
                </button>

                <button
                  type="button"
                  role="tab"
                  id="tab-keypad-dual"
                  aria-selected={keypadType === "dual-panel"}
                  aria-controls="keypad-dual-view"
                  className={`keypad-type-btn ${keypadType === "dual-panel" ? "is-active" : ""}`}
                  onClick={() => setKeypadType("dual-panel")}
                >
                  <div className="type-icon-dual" aria-hidden="true">
                    <span className="dual-bar-top" />
                    <span className="dual-divider-line" />
                    <span className="dual-bar-bottom" />
                  </div>
                  <div className="type-btn-text">
                    <span className="type-btn-title">Dual-Panel Rocker</span>
                    <span className="type-btn-ref">Keypad Type 2</span>
                  </div>
                </button>
              </div>
            )}

            {/* Display Selected Keypad Design or Inline Smart App Interface */}
            <div className="keypad-mount-area">
              {controllerView === "keypad" ? (
                <div className="keypad-unified-station">
                  {/* Capsule OLED Crown Display matching Reference Images */}
                  <KeypadCrownDisplay
                    circuits={circuits}
                    dimmers={dimmers}
                    fanState={fanState}
                    acState={acState}
                    curtainState={curtainState}
                    activeScene={activeScene}
                    lastInteraction={lastInteraction}
                    onControlAction={handleShortPress}
                    onStepCurtain={(pos) => setCurtainState({ position: pos, isOpen: pos > 0 })}
                    onSetFanSpeed={handleSetFanSpeed}
                  />

                  {/* The Selected Keypad itself */}
                  {keypadType === "grid" ? (
                    <GridKeypad
                      circuits={circuits}
                      dimmers={dimmers}
                      fanState={fanState}
                      acState={acState}
                      curtainState={curtainState}
                      activeScene={activeScene}
                      bodyFinish={bodyFinish}
                      buttonColor={buttonColor}
                      isButtonColorDark={isButtonColorDark}
                      onShortPress={handleShortPress}
                      onLongPress={handleLongPress}
                      onLongPressEnd={handleLongPressEnd}
                    />
                  ) : (
                    <DualPanelKeypad
                      circuits={circuits}
                      dimmers={dimmers}
                      fanState={fanState}
                      acState={acState}
                      curtainState={curtainState}
                      activeScene={activeScene}
                      bodyFinish={bodyFinish}
                      buttonColor={buttonColor}
                      isButtonColorDark={isButtonColorDark}
                      onShortPress={handleShortPress}
                      onLongPress={handleLongPress}
                      onLongPressEnd={handleLongPressEnd}
                    />
                  )}
                </div>
              ) : (
                <InlineAppView
                  circuits={circuits}
                  dimmers={dimmers}
                  fanState={fanState}
                  acState={acState}
                  curtainState={curtainState}
                  activeScene={activeScene}
                  onControlAction={handleShortPress}
                  onStepCurtain={(pos) => setCurtainState({ position: pos, isOpen: pos > 0 })}
                  onSetFanSpeed={handleSetFanSpeed}
                  onClose={() => setControllerView("keypad")}
                />
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
