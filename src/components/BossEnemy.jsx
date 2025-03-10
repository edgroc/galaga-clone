import React from 'react';

function BossEnemy({ x, y, width, height, bossType, health, maxHealth }) {
  // Calculate health percentage
  const healthPercent = (health / maxHealth) * 100;
  
  return (
    <div
      className="boss-enemy"
      style={{ 
        left: x, 
        top: y,
        width: width,
        height: height,
        position: 'absolute',
        zIndex: 5
      }}
    >
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="boss-svg">
        <defs>
          <radialGradient id="bossGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#ccffff" />
            <stop offset="50%" stopColor="#00ffff" />
            <stop offset="80%" stopColor="#0099cc" />
            <stop offset="100%" stopColor="#006699" />
          </radialGradient>
          <filter id="bossBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        
        {/* Boss ship body - larger and more complex */}
        <path d="M60 20 L30 40 L20 60 L30 80 L60 100 L90 80 L100 60 L90 40 Z" fill="url(#bossGlow)" stroke="#00ccff" strokeWidth="2" />
        
        {/* Central core */}
        <circle cx="60" cy="60" r="20" fill="#0099cc" />
        <circle cx="60" cy="60" r="15" fill="#00ccff" />
        <circle cx="60" cy="60" r="10" fill="#ffffff" />
        
        {/* Weapon arrays */}
        <rect x="25" y="55" width="10" height="10" fill="#00ccff" />
        <rect x="85" y="55" width="10" height="10" fill="#00ccff" />
        <rect x="55" y="25" width="10" height="10" fill="#00ccff" />
        <rect x="55" y="85" width="10" height="10" fill="#00ccff" />
        
        {/* Energy conduits */}
        <path d="M35 45 L55 55 L65 55 L85 45" fill="none" stroke="#00ffff" strokeWidth="3" />
        <path d="M35 75 L55 65 L65 65 L85 75" fill="none" stroke="#00ffff" strokeWidth="3" />
        
        {/* Shield generators */}
        <circle cx="40" cy="50" r="5" fill="#ffffff" opacity="0.8" />
        <circle cx="80" cy="50" r="5" fill="#ffffff" opacity="0.8" />
        <circle cx="40" cy="70" r="5" fill="#ffffff" opacity="0.8" />
        <circle cx="80" cy="70" r="5" fill="#ffffff" opacity="0.8" />
        
        {/* Damage indicators (visible as health decreases) */}
        {healthPercent < 75 && (
          <path d="M70 40 L80 50" stroke="#ff3300" strokeWidth="2" />
        )}
        {healthPercent < 50 && (
          <>
            <path d="M40 45 L50 55" stroke="#ff3300" strokeWidth="2" />
            <circle cx="45" cy="50" r="3" fill="#ff3300">
              <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
            </circle>
          </>
        )}
        {healthPercent < 25 && (
          <>
            <path d="M60 70 L70 80" stroke="#ff3300" strokeWidth="2" />
            <path d="M30 60 L40 70" stroke="#ff3300" strokeWidth="2" />
            <circle cx="65" cy="75" r="5" fill="#ff3300">
              <animate attributeName="r" values="3;5;3" dur="0.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}
        
        {/* Aura effect */}
        <circle cx="60" cy="60" r="50" fill="none" stroke="#00ffff" strokeWidth="1" filter="url(#bossBlur)" opacity="0.7">
          <animate attributeName="r" values="50;55;50" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
      
      {/* Health bar */}
      <div 
        className="boss-health-bar"
        style={{ 
          position: 'absolute',
          top: -10,
          left: 0,
          width: '100%',
          height: 5,
          backgroundColor: '#333'
        }}
      >
        <div 
          className="boss-health-fill"
          style={{ 
            width: `${healthPercent}%`,
            height: '100%',
            backgroundColor: healthPercent > 50 ? '#00ff00' : healthPercent > 25 ? '#ffcc00' : '#ff0000',
            transition: 'width 0.3s'
          }}
        />
      </div>
    </div>
  );
}

export default BossEnemy;
