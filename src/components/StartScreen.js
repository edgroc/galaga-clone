// components/StartScreen.js - Enhanced version
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

// components/GameOverScreen.js - Enhanced version
import React, { useEffect, useState } from 'react';

function GameOverScreen({ score, level, highScore, children }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confetti, setConfetti] = useState([]);
  
  // Check if high score was achieved
  const isNewHighScore = score >= highScore;
  
  // Generate confetti for high score celebration
  useEffect(() => {
    if (isNewHighScore) {
      setShowConfetti(true);
      
      // Create confetti pieces
      const confettiPieces = [];
      const colors = ['#ffcc00', '#ff3366', '#33cc33', '#3399ff', '#cc66ff'];
      
      for (let i = 0; i < 100; i++) {
        confettiPieces.push({
          id: i,
          x: Math.random() * 100 + '%',
          y: Math.random() * 100 + '%',
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          animationDuration: Math.random() * 3 + 2 + 's',
          animationDelay: Math.random() * 2 + 's'
        });
      }
      
      setConfetti(confettiPieces);
    }
  }, [isNewHighScore]);
  
  return (
    <div className="game-over">
      <h1>GAME OVER</h1>
      
      <div className="stats-container">
        <div className="stat-row">
          <span className="stat-label">Final Score:</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Final Level:</span>
          <span className="stat-value">{level}</span>
        </div>
        <div className="stat-row performance-rating">
          <span className="stat-label">Performance:</span>
          <span className="stat-value">
            {score > 5000 ? "LEGENDARY" : 
             score > 3000 ? "MASTER" : 
             score > 1500 ? "EXPERT" : 
             score > 800 ? "SKILLED" : 
             score > 300 ? "NOVICE" : "ROOKIE"}
          </span>
        </div>
      </div>
      
      <p className="blinking">Press ENTER to restart</p>
      
      {isNewHighScore && <div className="new-highscore">NEW HIGH SCORE!</div>}
      
      {children}
      
      {/* Confetti celebration */}
      {showConfetti && (
        <div className="high-score-celebration">
          {confetti.map(piece => (
            <div
              key={piece.id}
              className="celebration-confetti"
              style={{
                left: piece.x,
                top: piece.y,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                animation: `fall ${piece.animationDuration} linear ${piece.animationDelay} forwards`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="ai-powered-footer">
        Powered by AI-Enhanced Gameplay
      </div>
    </div>
  );
}

export default GameOverScreen;
