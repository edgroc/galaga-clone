// components/StatusBar.js
import React from 'react';

function StatusBar({ score, level, lives, specialWeapon }) {
  return (
    <div className="top-ui">
      <div className="score-display">Score: {score}</div>
      <div className="level-display">Level: {level}</div>
      <div className="lives-display">
        {[...Array(lives)].map((_, i) => (
          <div key={i} className="life-icon"></div>
        ))}
      </div>
      {specialWeapon && <div className="special-indicator">SPECIAL WEAPON</div>}
    </div>
  );
}

export default StatusBar;