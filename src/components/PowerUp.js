// components/PowerUp.js
import React from 'react';

function PowerUp({ x, y, width, height, type }) {
  return (
    <div
      className={`power-up ${type}-power`}
      style={{ 
        left: x, 
        top: y,
        width: width,
        height: height
      }}
    />
  );
}

export default PowerUp;
