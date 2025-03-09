// components/Enemy.js
import React from 'react';

function Enemy({ x, y, width, height, type, isTough, isDiveBomber }) {
  let className = `enemy enemy-type-${type}`;
  
  if (isTough) {
    className += ' tough-enemy';
  }
  
  if (isDiveBomber) {
    className += ' dive-bomber';
  }
  
  const style = {
    left: x, 
    top: y,
    width: width,
    height: height
  };
  
  if (isDiveBomber) {
    style.transform = 'rotate(45deg)';
  }
  
  return (
    <div
      className={className}
      style={style}
    />
  );
}

export default Enemy;
