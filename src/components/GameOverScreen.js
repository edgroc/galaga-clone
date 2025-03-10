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
      
    </div>
  );
}

export default GameOverScreen;