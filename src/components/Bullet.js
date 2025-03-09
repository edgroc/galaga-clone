// components/Bullet.js
import React from 'react';

function Bullet({ x, y, width, height, isSpecial, type }) {
  const className = type === 'player'
    ? `bullet ${isSpecial ? 'special-bullet' : ''}`
    : 'enemy-bullet';
  
  return (
    <div
      className={className}
      style={{ 
        left: x, 
        top: y,
        width: width,
        height: height
      }}
    />
  );
}

export default Bullet;
