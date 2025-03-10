// components/PowerUp.js
import React from 'react';

function PowerUp({ x, y, width, height, type }) {
  return (
    <div
      className={`power-up-container power-up-${type}`}
      style={{ 
        left: x, 
        top: y,
        width: width,
        height: height,
        position: 'absolute',
        zIndex: 4
      }}
    >
      {type === 'life' ? (
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="power-up-svg">
          <defs>
            <radialGradient id="lifeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#ffffcc" />
              <stop offset="60%" stopColor="#ffcc00" />
              <stop offset="100%" stopColor="#cc9900" />
            </radialGradient>
            <filter id="lifePulse" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2">
                <animate attributeName="stdDeviation" values="2;3;2" dur="1s" repeatCount="indefinite" />
              </feGaussianBlur>
            </filter>
          </defs>
          
          {/* Base circle */}
          <circle cx="25" cy="25" r="20" fill="url(#lifeGradient)" />
          
          {/* Rotating outer ring */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="3s" repeatCount="indefinite" />
            <circle cx="25" cy="25" r="22" fill="none" stroke="#ffcc00" strokeWidth="2" strokeDasharray="5,5" />
          </g>
          
          {/* Life icon (heart) */}
          <path d="M25 15 L20 10 L15 15 L10 10 L15 25 L25 35 L35 25 L40 10 L35 15 L30 10 Z" fill="#ffffff" />
          
          {/* Glow effect */}
          <circle cx="25" cy="25" r="18" fill="#ffff00" opacity="0.5" filter="url(#lifePulse)" />
        </svg>
      ) : (
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="power-up-svg">
          <defs>
            <radialGradient id="specialGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#ffccff" />
              <stop offset="60%" stopColor="#cc00cc" />
              <stop offset="100%" stopColor="#660066" />
            </radialGradient>
            <filter id="specialPulse" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2">
                <animate attributeName="stdDeviation" values="2;3;2" dur="0.8s" repeatCount="indefinite" />
              </feGaussianBlur>
            </filter>
          </defs>
          
          {/* Base circle */}
          <circle cx="25" cy="25" r="20" fill="url(#specialGradient)" />
          
          {/* Rotating outer ring with lightning */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="-360 25 25" dur="4s" repeatCount="indefinite" />
            <circle cx="25" cy="25" r="22" fill="none" stroke="#cc00cc" strokeWidth="2" strokeDasharray="15,5" />
            <path d="M25 3 L28 10 L21 15 L28 20 L21 25 L28 30 L21 35 L28 40 L25 47" fill="none" stroke="#ff00ff" strokeWidth="2" />
          </g>
          
          {/* Special weapon icon (star) */}
          <path d="M25 15 L28 22 L35 22 L30 27 L32 35 L25 30 L18 35 L20 27 L15 22 L22 22 Z" fill="#ffffff" />
          
          {/* Glow effect */}
          <circle cx="25" cy="25" r="18" fill="#ff00ff" opacity="0.5" filter="url(#specialPulse)" />
        </svg>
      )}
    </div>
  );
}

export default PowerUp;
