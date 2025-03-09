// components/Explosion.js
import React from 'react';

function Explosion({ x, y, size, color }) {
  return (
    <div
      className="particle"
      style={{ 
        left: x, 
        top: y,
        width: size,
        height: size,
        backgroundColor: color
      }}
    />
  );
}

export default Explosion;
