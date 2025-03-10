import React from 'react';
import AIBadge from './AIBadge';

function StartScreen({ highScore }) {
  return (
    <div className="start-screen">
      <h1>GALACTIC INVADERS</h1>
      <div className="game-tagline">AI-POWERED ARCADE ACTION</div>
      
      <div className="start-screen-ship">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="title-ship">
          <defs>
            <radialGradient id="titleShipGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#99ccff" />
              <stop offset="80%" stopColor="#0066cc" />
              <stop offset="100%" stopColor="#003366" />
            </radialGradient>
            <filter id="titleShipBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          
          {/* Ship body */}
          <path d="M25 60 L50 20 L75 60 L65 80 L35 80 Z" fill="url(#titleShipGlow)" stroke="#0066cc" strokeWidth="2" />
          
          {/* Cockpit */}
          <ellipse cx="50" cy="50" rx="10" ry="15" fill="#99ccff" />
          
          {/* Glow effect */}
          <ellipse cx="50" cy="50" rx="30" ry="35" fill="none" stroke="#0099ff" strokeWidth="1" filter="url(#titleShipBlur)" />
        </svg>
      </div>
      
      <p className="blinking">Press ENTER to start</p>
      <p className="controls-hint">Use LEFT/RIGHT arrows to move, SPACE to shoot</p>
      <p className="special-hint">Press Z to use special weapon when available</p>
      <p className="exit-hint">Press ESC to exit game</p>
      
      <div className="feature-highlights">
        <div className="feature">
          <span className="feature-icon">🎮</span>
          <span className="feature-text">ADAPTIVE DIFFICULTY</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🧠</span>
          <span className="feature-text">AI ENEMY BEHAVIOR</span>
        </div>
        <div className="feature">
          <span className="feature-icon">⭐</span>
          <span className="feature-text">BOSS BATTLES</span>
        </div>
      </div>
      
      <div className="high-score">High Score: {highScore}</div>
      
      <AIBadge />
    </div>
  );
}

export default StartScreen;