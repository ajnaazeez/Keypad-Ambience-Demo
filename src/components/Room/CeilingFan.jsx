import React, { useEffect, useRef, useState, useCallback } from 'react';
import './CeilingFan.css';

/**
 * CeilingFan Component
 * 
 * Renders a visible, realistic 3D-perspective ceiling fan mounted on the room canopy.
 * Features:
 * - Natural 3D perspective orientation matching the high tray ceiling geometry
 * - Rotational speed dynamically tied to selected speed (1 to 5)
 * - Inertial coasting deceleration when turned OFF (stops naturally, no sudden halting)
 * - Motion-blur trails at higher speeds (Levels 3–5)
 * - Dynamic ceiling shadow cast beneath the rotating blades
 * - Interactive hotspot for direct room manipulation
 */
export default function CeilingFan({
  fanState = { on: false, speed: 3 },
  onToggle,
  onOpenControls,
}) {
  const { on, speed } = fanState;
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isBlurActive, setIsBlurActive] = useState(false);
  
  // Animation frame tracking for natural physics & coasting
  const animFrameRef = useRef(null);
  const angleRef = useRef(0);
  const currentVelocityRef = useRef(0);
  const targetVelocityRef = useRef(0);

  // Speed 1 to 5 mapped to angular velocity (degrees per second)
  const getTargetVelocity = useCallback(() => {
    if (!on) return 0;
    switch (speed) {
      case 1: return 140;
      case 2: return 240;
      case 3: return 380;
      case 4: return 540;
      case 5: return 720;
      default: return 380;
    }
  }, [on, speed]);

  useEffect(() => {
    targetVelocityRef.current = getTargetVelocity();
  }, [getTargetVelocity]);

  useEffect(() => {
    let lastTime = performance.now();

    const updateLoop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const target = targetVelocityRef.current;
      const current = currentVelocityRef.current;

      // Acceleration vs Deceleration inertia rates
      if (current < target) {
        currentVelocityRef.current = Math.min(target, current + 260 * dt);
      } else if (current > target) {
        currentVelocityRef.current = Math.max(target, current - 180 * dt);
      }

      const vel = currentVelocityRef.current;
      setIsSpinning(vel > 5);
      setIsBlurActive(vel > 300);

      if (vel > 0.5) {
        angleRef.current = (angleRef.current + vel * dt) % 360;
        setCurrentAngle(angleRef.current);
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleClick = () => {
    if (onOpenControls) {
      onOpenControls('fan');
    } else if (onToggle) {
      onToggle();
    }
  };

  return (
    <div
      className={`ceiling-fan-fixture ${on ? 'is-active' : 'is-idle'}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Ceiling fan: ${on ? `Running at speed ${speed}` : 'Off'}. Click to adjust.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Ceiling Mount Rose & Downrod */}
      <div className="fan-mounting-canopy">
        <div className="fan-ceiling-flange" />
        <div className="fan-downrod" />
      </div>

      {/* Rotating Blade Assembly Container with 3D perspective */}
      <div className="fan-rotor-assembly">
        {/* Dynamic Shadow Cast on Ceiling Surface */}
        <div
          className={`fan-ceiling-shadow ${isSpinning ? 'shadow-blur' : ''}`}
          style={{ transform: `rotate(${currentAngle}deg)` }}
        />

        {/* 4 Aerodynamic Blades */}
        <div
          className={`fan-blades-disc ${isBlurActive ? 'has-motion-blur' : ''}`}
          style={{ transform: `rotate(${currentAngle}deg)` }}
        >
          {/* Blade 0° */}
          <div className="fan-blade fan-blade-0">
            <div className="blade-fin" />
            <div className="blade-bracket" />
          </div>

          {/* Blade 90° */}
          <div className="fan-blade fan-blade-90">
            <div className="blade-fin" />
            <div className="blade-bracket" />
          </div>

          {/* Blade 180° */}
          <div className="fan-blade fan-blade-180">
            <div className="blade-fin" />
            <div className="blade-bracket" />
          </div>

          {/* Blade 270° */}
          <div className="fan-blade fan-blade-270">
            <div className="blade-fin" />
            <div className="blade-bracket" />
          </div>
        </div>

        {/* Central Motor Hub (Stationary Shell & Spindle) */}
        <div className="fan-motor-housing">
          <div className="motor-casing-rim" />
          <div className="motor-center-cap">
            <span className={`fan-status-dot ${on ? 'dot-active' : ''}`} />
          </div>
        </div>
      </div>

      {/* Permanent Architectural Identification Beacon */}
      <div className={`fan-beacon-pill ${on ? 'is-on' : 'is-standby'}`}>
        <span className="beacon-dot" />
        <span className="beacon-label">Ceiling Fan</span>
        <span className="beacon-val">{on ? `Spd ${speed}` : 'OFF'}</span>
      </div>

      {/* Interactive Room HUD Badge on Hover */}
      <div className={`fan-hover-badge ${isHovered ? 'badge-visible' : ''}`}>
        <span className="badge-icon">🌀</span>
        <span className="badge-text">
          Ceiling Fan · {on ? `Speed ${speed}` : 'Off'}
        </span>
        <span className="badge-action">Tap to Cycle</span>
      </div>
    </div>
  );
}
