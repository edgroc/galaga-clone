import React, { createContext, useContext, useReducer, useMemo } from 'react';
import CONFIG from '../config/gameConfig';

// Initial game state
const initialGameState = {
  status: 'idle', // 'idle', 'playing', 'paused', 'gameOver'
  score: 0,
  level: 1,
  lives: CONFIG.game.initialLives,
  highScore: 0,
  specialWeapon: false,
  specialWeaponTimer: 0,
  isInvulnerable: false
};

// Game state reducer
function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialGameState,
        status: 'playing',
        highScore: state.highScore // Preserve high score
      };
      
    case 'GAME_OVER':
      return {
        ...state,
        status: 'gameOver',
        highScore: Math.max(state.score, state.highScore)
      };
      
    case 'PAUSE_GAME':
      return {
        ...state,
        status: 'paused'
      };
      
    case 'RESUME_GAME':
      return {
        ...state,
        status: 'playing'
      };
      
    case 'EXIT_GAME':
      return {
        ...state,
        status: 'idle'
      };
      
    case 'ADD_SCORE':
      return {
        ...state,
        score: state.score + action.payload
      };
      
    case 'NEXT_LEVEL':
      return {
        ...state,
        level: state.level + 1
      };
      
    case 'LOSE_LIFE':
      const newLives = state.lives - 1;
      return {
        ...state,
        lives: newLives,
        isInvulnerable: true,
        status: newLives <= 0 ? 'gameOver' : state.status,
        highScore: newLives <= 0 ? Math.max(state.score, state.highScore) : state.highScore
      };
      
    case 'GAIN_LIFE':
      return {
        ...state,
        lives: state.lives + 1
      };
      
    case 'SET_INVULNERABLE':
      return {
        ...state,
        isInvulnerable: action.payload
      };
      
    case 'SET_SPECIAL_WEAPON':
      return {
        ...state,
        specialWeapon: action.payload
      };
      
    case 'UPDATE_SPECIAL_WEAPON_TIMER':
      const newTimer = state.specialWeaponTimer + 1;
      return {
        ...state,
        specialWeaponTimer: newTimer,
        specialWeapon: newTimer < CONFIG.player.specialWeaponDuration / CONFIG.game.tickRate ? state.specialWeapon : false
      };
      
    case 'RESET_SPECIAL_WEAPON':
      return {
        ...state,
        specialWeapon: false,
        specialWeaponTimer: 0
      };
      
    case 'LOAD_HIGH_SCORE':
      return {
        ...state,
        highScore: action.payload
      };
      
    default:
      return state;
  }
}

// Create context
const GameStateContext = createContext();

// Provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  
  // Load high score from localStorage on component mount
  React.useEffect(() => {
    try {
      const storedHighScore = localStorage.getItem('galagaHighScore');
      if (storedHighScore) {
        dispatch({ type: 'LOAD_HIGH_SCORE', payload: parseInt(storedHighScore, 10) });
      }
    } catch (e) {
      console.error('Error loading high score:', e);
    }
  }, []);
  
  // Save high score to localStorage when it changes
  React.useEffect(() => {
    try {
      localStorage.setItem('galagaHighScore', state.highScore.toString());
    } catch (e) {
      console.error('Error saving high score:', e);
    }
  }, [state.highScore]);
  
  // Manage invulnerability timer
  React.useEffect(() => {
    if (state.isInvulnerable) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_INVULNERABLE', payload: false });
      }, CONFIG.player.invulnerabilityTime);
      
      return () => clearTimeout(timer);
    }
  }, [state.isInvulnerable]);
  
  // Create memoized context value
  const value = useMemo(() => ({ state, dispatch }), [state]);
  
  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

// Custom hook to use the game state
export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}

// Helper actions
export const GameActions = {
  startGame: () => ({ type: 'START_GAME' }),
  gameOver: () => ({ type: 'GAME_OVER' }),
  pauseGame: () => ({ type: 'PAUSE_GAME' }),
  resumeGame: () => ({ type: 'RESUME_GAME' }),
  exitGame: () => ({ type: 'EXIT_GAME' }),
  addScore: (points) => ({ type: 'ADD_SCORE', payload: points }),
  nextLevel: () => ({ type: 'NEXT_LEVEL' }),
  loseLife: () => ({ type: 'LOSE_LIFE' }),
  gainLife: () => ({ type: 'GAIN_LIFE' }),
  setInvulnerable: (value) => ({ type: 'SET_INVULNERABLE', payload: value }),
  setSpecialWeapon: (value) => ({ type: 'SET_SPECIAL_WEAPON', payload: value }),
  updateSpecialWeaponTimer: () => ({ type: 'UPDATE_SPECIAL_WEAPON_TIMER' }),
  resetSpecialWeapon: () => ({ type: 'RESET_SPECIAL_WEAPON' })
};
