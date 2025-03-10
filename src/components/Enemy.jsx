// components/Enemy.js - Updated with SVG ships
import React from 'react';

function Enemy({ x, y, width, height, type, isTough, isDiveBomber }) {
  let className = `enemy ${isTough ? 'tough-enemy' : ''} ${isDiveBomber ? 'dive-bomber' : ''}`;
  
  const style = {
    left: x, 
    top: y,
    width: width,
    height: height,
    position: 'absolute',
    zIndex: 4
  };
  
  if (isDiveBomber) {
    style.transform = 'rotate(45deg)';
  }
  
  // Choose SVG based on enemy type
  const renderEnemyShip = () => {
    switch(type) {
      case 0:
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="enemy-svg">
            {/* Red Alien Battleship */}
            <defs>
              <radialGradient id="redGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#ff9999" />
                <stop offset="80%" stopColor="#ff0000" />
                <stop offset="100%" stopColor="#990000" />
              </radialGradient>
              <filter id="redBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>
            <path d="M50 10 L20 40 L20 70 L35 85 L65 85 L80 70 L80 40 L50 10" fill="url(#redGlow)" stroke="#ff0000" strokeWidth="2" />
            <circle cx="50" cy="55" r="15" fill="#ff3333" />
            <circle cx="50" cy="55" r="10" fill="#ffcccc" />
            <path d="M30 40 L45 50 L55 50 L70 40" fill="none" stroke="#ff0000" strokeWidth="3" />
            <path d="M20 60 L40 60 M60 60 L80 60" stroke="#ff5555" strokeWidth="2" />
            <path d="M35 85 L35 95 M65 85 L65 95" stroke="#ff0000" strokeWidth="3" />
            <circle cx="50" cy="55" r="18" fill="none" stroke="#ff0000" strokeWidth="1" filter="url(#redBlur)" />
          </svg>
        );
      case 1:
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="enemy-svg">
            {/* Yellow Scout Ship */}
            <defs>
              <radialGradient id="yellowGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#ffffaa" />
                <stop offset="80%" stopColor="#ffcc00" />
                <stop offset="100%" stopColor="#cc9900" />
              </radialGradient>
              <filter id="yellowBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>
            <ellipse cx="50" cy="50" rx="40" ry="25" fill="url(#yellowGlow)" stroke="#ffcc00" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" fill="#ffdd33" />
            <circle cx="50" cy="50" r="10" fill="#ffffcc" />
            <path d="M30 40 L70 40 M30 60 L70 60" stroke="#ffcc00" strokeWidth="2" />
            <path d="M50 25 L50 15 M45 15 L55 15" stroke="#ffcc00" strokeWidth="3" />
            <path d="M20 50 L10 50 M80 50 L90 50" stroke="#ffcc00" strokeWidth="3" />
            <path d="M50 75 L50 90" stroke="#ffcc00" strokeWidth="3" />
            <circle cx="50" cy="50" r="27" fill="none" stroke="#ffcc00" strokeWidth="1" filter="url(#yellowBlur)" />
          </svg>
        );
      case 2:
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="enemy-svg">
            {/* Green Alien Mothership */}
            <defs>
              <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#ccffcc" />
                <stop offset="80%" stopColor="#00cc00" />
                <stop offset="100%" stopColor="#006600" />
              </radialGradient>
              <filter id="greenBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>
            <path d="M20 40 L50 20 L80 40 L80 60 L50 80 L20 60 Z" fill="url(#greenGlow)" stroke="#00cc00" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" fill="#33cc33" />
            <circle cx="50" cy="50" r="10" fill="#ccffcc" />
            <path d="M35 35 L65 35 M35 65 L65 65" stroke="#00cc00" strokeWidth="2" />
            <path d="M35 35 L35 65 M65 35 L65 65" stroke="#00cc00" strokeWidth="2" />
            <path d="M42 27 L42 17 M58 27 L58 17" stroke="#00cc00" strokeWidth="3" />
            <path d="M42 73 L42 83 M58 73 L58 83" stroke="#00cc00" strokeWidth="3" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="#00cc00" strokeWidth="1" filter="url(#greenBlur)" />
          </svg>
        );
      default:
        // Fallback to type 0
        return (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="enemy-svg">
            <path d="M50 10 L20 40 L20 70 L35 85 L65 85 L80 70 L80 40 L50 10" fill="#ff0000" stroke="#ff0000" strokeWidth="2" />
            <circle cx="50" cy="55" r="15" fill="#ff3333" />
          </svg>
        );
    }
  };
  
  return (
    <div className={className} style={style}>
      {renderEnemyShip()}
    </div>
  );
}

export default Enemy;
