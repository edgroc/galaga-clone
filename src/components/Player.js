// components/Player.js
import React from 'react';

function Player({ x, y, width, height, isInvulnerable }) {
  return (
    <div 
      className={`player-container ${isInvulnerable ? 'invulnerable' : ''}`}
      style={{ 
        left: x, 
        top: y,
        width: width,
        height: height,
        position: 'absolute',
        zIndex: 5
      }}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="player-svg">
        <defs>
          <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#99ccff" />
            <stop offset="80%" stopColor="#0066cc" />
            <stop offset="100%" stopColor="#003366" />
          </radialGradient>
          <linearGradient id="thrusterGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff9900" />
            <stop offset="50%" stopColor="#ff3300" />
            <stop offset="100%" stopColor="#ff9900" />
          </linearGradient>
          <filter id="blueBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="thrusterBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        
        {/* Thrusters */}
        <path d="M35 80 L40 100 L45 80" fill="url(#thrusterGlow)" filter="url(#thrusterBlur)" />
        <path d="M55 80 L60 100 L65 80" fill="url(#thrusterGlow)" filter="url(#thrusterBlur)" />
        
        {/* Main ship body */}
        <path d="M25 60 L50 20 L75 60 L65 80 L35 80 Z" fill="url(#blueGlow)" stroke="#0066cc" strokeWidth="2" />
        
        {/* Cockpit */}
        <ellipse cx="50" cy="50" rx="10" ry="15" fill="#99ccff" />
        <ellipse cx="50" cy="50" rx="6" ry="10" fill="#ffffff" />
        
        {/* Wings */}
        <path d="M25 60 L10 70 L35 80" fill="#0066cc" stroke="#0099ff" strokeWidth="1" />
        <path d="M75 60 L90 70 L65 80" fill="#0066cc" stroke="#0099ff" strokeWidth="1" />
        
        {/* Details */}
        <path d="M40 35 L60 35" stroke="#0099ff" strokeWidth="2" />
        <path d="M35 45 L65 45" stroke="#0099ff" strokeWidth="2" />
        <path d="M30 55 L70 55" stroke="#0099ff" strokeWidth="2" />
        
        {/* Glow effect */}
        <ellipse cx="50" cy="50" rx="30" ry="35" fill="none" stroke="#0099ff" strokeWidth="1" filter="url(#blueBlur)" />
        
        {/* Weapons */}
        <rect x="30" y="60" width="3" height="10" fill="#0099ff" />
        <rect x="67" y="60" width="3" height="10" fill="#0099ff" />
      </svg>
    </div>
  );
}

export default Player;
