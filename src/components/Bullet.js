// components/Bullet.js
import React from 'react';

function Bullet({ x, y, width, height, isSpecial, type }) {
  if (type === 'player') {
    if (isSpecial) {
      // Special weapon - purple energy beam
      return (
        <div
          className="special-bullet-container"
          style={{ 
            left: x - width, 
            top: y - height,
            position: 'absolute',
            zIndex: 3,
            width: width * 3,
            height: height * 1.5
          }}
        >
          <svg viewBox="0 0 30 45" xmlns="http://www.w3.org/2000/svg" className="bullet-svg">
            <defs>
              <radialGradient id="specialBulletGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#ff66ff" />
                <stop offset="100%" stopColor="#cc00cc" />
              </radialGradient>
              <filter id="specialBulletBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>
            
            {/* Special bullet beam */}
            <ellipse cx="15" cy="15" rx="6" ry="15" fill="url(#specialBulletGlow)" filter="url(#specialBulletBlur)" />
            <ellipse cx="15" cy="15" rx="3" ry="12" fill="#ffffff" />
            
            {/* Energy trails */}
            <path d="M10 25 L13 35 L17 35 L20 25" fill="#ff66ff" opacity="0.6" />
          </svg>
        </div>
      );
    } else {
      // Regular player bullet - blue laser
      return (
        <div
          className="player-bullet-container"
          style={{ 
            left: x - width/2, 
            top: y,
            position: 'absolute',
            zIndex: 3,
            width: width * 2,
            height: height
          }}
        >
          <svg viewBox="0 0 8 15" xmlns="http://www.w3.org/2000/svg" className="bullet-svg">
            <defs>
              <linearGradient id="bulletGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#99ccff" />
                <stop offset="50%" stopColor="#0099ff" />
                <stop offset="100%" stopColor="#0066cc" />
              </linearGradient>
              <filter id="bulletGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" />
              </filter>
            </defs>
            
            {/* Bullet core */}
            <rect x="3" y="0" width="2" height="15" fill="url(#bulletGradient)" />
            <rect x="2" y="0" width="4" height="3" fill="#0099ff" />
            
            {/* Glow effect */}
            <rect x="3" y="0" width="2" height="15" fill="#66ccff" filter="url(#bulletGlow)" opacity="0.7" />
          </svg>
        </div>
      );
    }
  } else {
    // Enemy bullet - red energy
    return (
      <div
        className="enemy-bullet-container"
        style={{ 
          left: x - width/2, 
          top: y,
          position: 'absolute',
          zIndex: 3,
          width: width * 2,
          height: height
        }}
      >
        <svg viewBox="0 0 8 10" xmlns="http://www.w3.org/2000/svg" className="bullet-svg">
          <defs>
            <linearGradient id="enemyBulletGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff9999" />
              <stop offset="50%" stopColor="#ff3333" />
              <stop offset="100%" stopColor="#cc0000" />
            </linearGradient>
            <filter id="enemyBulletGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>
          
          {/* Enemy bullet */}
          <path d="M4 0 L1 10 L7 10 Z" fill="url(#enemyBulletGradient)" />
          
          {/* Glow effect */}
          <path d="M4 0 L1 10 L7 10 Z" fill="#ff6666" filter="url(#enemyBulletGlow)" opacity="0.7" />
        </svg>
      </div>
    );
  }
}

export default Bullet;
