// components/StartScreen.js
import React from 'react';

function StartScreen({ highScore }) {
  return (
    <div className="start-screen">
      <h1>GALACTIC INVADERS</h1>
      <p className="blinking">Press ENTER to start</p>
      <p>Use LEFT/RIGHT arrows to move, SPACE to shoot</p>
      <p>Press Z to use special weapon when available</p>
      <p>Press ESC to exit game</p>
      <div className="high-score">High Score: {highScore}</div>
    </div>
  );
}

export default StartScreen;
