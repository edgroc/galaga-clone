// components/Player.js
import React from 'react';

function Player({ x, y, width, height, isInvulnerable }) {
  return (
    <div 
      className={`player ${isInvulnerable ? 'invulnerable' : ''}`}
      style={{ 
        left: x, 
        top: y,
        width: width,
        height: height
      }}
    />
  );
}

export default Player;
