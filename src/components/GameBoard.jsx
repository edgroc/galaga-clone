// components/GameBoard.js
import React from 'react';
import CONFIG from '../config/gameConfig';

function GameBoard({ children }) {
  return (
    <div 
      className="game" 
      style={{ 
        width: CONFIG.game.width, 
        height: CONFIG.game.height 
      }}
    >
      {children}
    </div>
  );
}

export default GameBoard;
