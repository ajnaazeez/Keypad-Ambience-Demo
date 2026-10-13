import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * useLongPress - Reliable hook for separating short-press (tap/click) from long-press (hold).
 * Supports continuous progressive repeats while held down (e.g. stepping fan speed or AC temp).
 * 
 * Features:
 * - Robust Pointer Events with pointer capture support (mouse, touch, stylus)
 * - Keyboard accessibility (Enter/Space)
 * - Ref-backed callbacks to eliminate stale closure issues on re-render
 * - Movement threshold safeguards against mobile drag/scroll
 * - Progressive repeating timer while held down
 */
export function useLongPress({
  onShortPress,
  onLongPress,
  onLongPressEnd,
  thresholdMs = 380,
  moveThresholdPx = 30,
  repeatIntervalMs = 340,
}) {
  const timerRef = useRef(null);
  const repeatTimerRef = useRef(null);
  const startTimeRef = useRef(0);
  const startPosRef = useRef({ x: 0, y: 0 });
  const isLongPressActiveRef = useRef(false);
  const targetElementRef = useRef(null);

  // Keep references to latest callbacks so state changes during hold don't break callbacks
  const callbacksRef = useRef({ onShortPress, onLongPress, onLongPressEnd });
  useEffect(() => {
    callbacksRef.current = { onShortPress, onLongPress, onLongPressEnd };
  }, [onShortPress, onLongPress, onLongPressEnd]);

  // Visual states
  const [isPressed, setIsPressed] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const start = useCallback((event) => {
    // Only handle primary pointer (left mouse click, touch) or keyboard trigger
    if (event.button !== undefined && event.button !== 0) return;

    startTimeRef.current = Date.now();
    startPosRef.current = {
      x: event.clientX || 0,
      y: event.clientY || 0,
    };
    isLongPressActiveRef.current = false;
    targetElementRef.current = event.currentTarget || event.target;
    setIsPressed(true);
    setIsHolding(false);

    // Capture pointer so button depression and cursor boundary shifts do not lose events
    if (event.pointerId !== undefined && targetElementRef.current?.setPointerCapture) {
      try {
        targetElementRef.current.setPointerCapture(event.pointerId);
      } catch {}
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    if (repeatTimerRef.current) clearInterval(repeatTimerRef.current);

    timerRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      setIsHolding(true);
      if (callbacksRef.current.onLongPress) {
        callbacksRef.current.onLongPress(event);
      }

      // Progressive repeat while holding down
      if (repeatIntervalMs > 0) {
        repeatTimerRef.current = setInterval(() => {
          if (callbacksRef.current.onLongPress) {
            callbacksRef.current.onLongPress(event);
          }
        }, repeatIntervalMs);
      }
    }, thresholdMs);
  }, [thresholdMs, repeatIntervalMs]);

  const clear = useCallback((event, shouldTriggerShortPress = false) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (repeatTimerRef.current) {
      clearInterval(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }

    if (event?.pointerId !== undefined && targetElementRef.current?.releasePointerCapture) {
      try {
        targetElementRef.current.releasePointerCapture(event.pointerId);
      } catch {}
    }

    const wasLongPress = isLongPressActiveRef.current;
    const pressDuration = Date.now() - startTimeRef.current;

    setIsPressed(false);
    setIsHolding(false);
    isLongPressActiveRef.current = false;

    if (wasLongPress) {
      // Long press hold released
      if (callbacksRef.current.onLongPressEnd) {
        callbacksRef.current.onLongPressEnd(event);
      }
    } else if (shouldTriggerShortPress && pressDuration < thresholdMs) {
      // Short press tap/click
      if (callbacksRef.current.onShortPress) {
        callbacksRef.current.onShortPress(event);
      }
    }
  }, [thresholdMs]);

  const handleMove = useCallback((event) => {
    // Only cancel if initial timer pending and pointer moves significantly (e.g. mobile scroll)
    if (!timerRef.current || isLongPressActiveRef.current) return;

    const dx = event.clientX - startPosRef.current.x;
    const dy = event.clientY - startPosRef.current.y;
    if (Math.hypot(dx, dy) > moveThresholdPx) {
      clear(event, false);
    }
  }, [clear, moveThresholdPx]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (event.repeat) return;
      start(event);
    }
  }, [start]);

  const handleKeyUp = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      clear(event, true);
    }
  }, [clear]);

  return {
    isPressed,
    isHolding,
    handlers: {
      onPointerDown: start,
      onPointerUp: (e) => clear(e, true),
      onPointerMove: handleMove,
      onPointerCancel: (e) => clear(e, false),
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onContextMenu: (e) => e.preventDefault(),
    },
  };
}
