// components/GameOverScreen.js
import React from 'react';

function GameOverScreen({ score, level, highScore }) {
  const isNewHighScore = score > highScore;
  
  return (
    <div className="game-over">
      <h1>GAME OVER</h1>
      <p>Final Score: {score}</p>
      <p>Final Level: {level}</p>
      <p className="blinking">Press ENTER to restart</p>
      {isNewHighScore && <div className="new-highscore">NEW HIGH SCORE!</div>}
    </div>
  );
}

export default GameOverScreen;
