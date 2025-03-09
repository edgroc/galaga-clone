import { useState, useEffect, useCallback } from 'react';
import { useGameState, GameActions } from './useGameState';

/**
 * Custom hook to handle game inputs
 */
export function useInputSystem() {
  const { state, dispatch } = useGameState();
  
  // Track input states
  const [inputs, setInputs] = useState({
    moveLeft: false,
    moveRight: false,
    fire: false,
    specialWeapon: false,
    start: false,
    pause: false,
    exit: false
  });
  
  // Track last fire time for rate limiting
  const [lastFireTime, setLastFireTime] = useState(0);
  
  // Key mappings configuration
  const keyMap = {
    'ArrowLeft': 'moveLeft',
    'ArrowRight': 'moveRight',
    ' ': 'fire',
    'Space': 'fire',
    'z': 'specialWeapon',
    'Z': 'specialWeapon',
    'Enter': 'start',
    'p': 'pause',
    'P': 'pause',
    'Escape': 'exit'
  };
  
  // Handle key down events
  const handleKeyDown = useCallback((e) => {
    const action = keyMap[e.key];
    if (action) {
      setInputs(prev => ({ ...prev, [action]: true }));
      
      // Prevent default behavior for game keys
      e.preventDefault();
    }
  }, [keyMap]);
  
  // Handle key up events
  const handleKeyUp = useCallback((e) => {
    const action = keyMap[e.key];
    if (action) {
      setInputs(prev => ({ ...prev, [action]: false }));
      
      // Prevent default behavior for game keys
      e.preventDefault();
    }
  }, [keyMap]);
  
  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
  
  // Process game controls based on state
  useEffect(() => {
    // Start game
    if (inputs.start && (state.status === 'idle' || state.status === 'gameOver')) {
      dispatch(GameActions.startGame());
    }
    
    // Pause/unpause game
    if (inputs.pause && state.status === 'playing') {
      dispatch(GameActions.pauseGame());
    } else if (inputs.pause && state.status === 'paused') {
      dispatch(GameActions.resumeGame());
    }
    
    // Exit game
    if (inputs.exit && (state.status === 'playing' || state.status === 'paused')) {
      dispatch(GameActions.gameOver());
    }
  }, [inputs.start, inputs.pause, inputs.exit, state.status, dispatch]);
  
  // Check if can fire (rate limited)
  const canFire = useCallback(() => {
    const now = Date.now();
    const fireInterval = state.specialWeapon ? 150 : 300; // Faster firing with special weapon
    
    if (now - lastFireTime > fireInterval) {
      setLastFireTime(now);
      return true;
    }
    
    return false;
  }, [lastFireTime, state.specialWeapon]);
  
  return {
    inputs,
    canFire
  };
}
