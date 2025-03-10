// components/Explosion.js
import React from 'react';

function Explosion({ x, y, size, color }) {
  // Generate a unique ID for this explosion instance's gradient
  const gradientId = `explosion-gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine explosion type based on size
  const isLarge = size > 4;
  const isMedium = size > 2 && size <= 4;
  
  // Choose explosion style based on size
  if (isLarge) {
    return (
      <div
        className="explosion-container"
        style={{ 
          left: x - size*2, 
          top: y - size*2,
          position: 'absolute',
          zIndex: 6,
          width: size * 4,
          height: size * 4
        }}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="explosion-svg">
          <defs>
            <radialGradient id={gradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor={color} />
              <stop offset="60%" stopColor={color.replace('ff', '99')} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="explosionBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          
          {/* Outer explosion ring */}
          <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="2" opacity="0.7">
            <animate attributeName="r" from="20" to="45" dur="0.3s" />
            <animate attributeName="opacity" from="0.7" to="0" dur="0.3s" />
          </circle>
          
          {/* Main explosion */}
          <circle cx="50" cy="50" r="30" fill={`url(#${gradientId})`} filter="url(#explosionBlur)">
            <animate attributeName="r" from="10" to="30" dur="0.3s" />
          </circle>
          
          {/* Debris particles */}
          <circle cx="30" cy="30" r="3" fill="#ffffff">
            <animate attributeName="cx" from="50" to="30" dur="0.3s" />
            <animate attributeName="cy" from="50" to="30" dur="0.3s" />
          </circle>
          <circle cx="70" cy="30" r="2" fill="#ffffff">
            <animate attributeName="cx" from="50" to="70" dur="0.3s" />
            <animate attributeName="cy" from="50" to="30" dur="0.3s" />
          </circle>
          <circle cx="30" cy="70" r="2" fill="#ffffff">
            <animate attributeName="cx" from="50" to="30" dur="0.3s" />
            <animate attributeName="cy" from="50" to="70" dur="0.3s" />
          </circle>
          <circle cx="70" cy="70" r="3" fill="#ffffff">
            <animate attributeName="cx" from="50" to="70" dur="0.3s" />
            <animate attributeName="cy" from="50" to="70" dur="0.3s" />
          </circle>
          <circle cx="50" cy="20" r="2" fill="#ffffff">
            <animate attributeName="cy" from="50" to="20" dur="0.3s" />
          </circle>
          <circle cx="50" cy="80" r="2" fill="#ffffff">
            <animate attributeName="cy" from="50" to="80" dur="0.3s" />
          </circle>
          <circle cx="20" cy="50" r="2" fill="#ffffff">
            <animate attributeName="cx" from="50" to="20" dur="0.3s" />
          </circle>
          <circle cx="80" cy="50" r="2" fill="#ffffff">
            <animate attributeName="cx" from="50" to="80" dur="0.3s" />
          </circle>
        </svg>
      </div>
    );
  } else if (isMedium) {
    return (
      <div
        className="explosion-container"
        style={{ 
          left: x - size*1.5, 
          top: y - size*1.5,
          position: 'absolute',
          zIndex: 6,
          width: size * 3,
          height: size * 3
        }}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="explosion-svg">
          <defs>
            <radialGradient id={gradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor={color} />
              <stop offset="70%" stopColor={color.replace('ff', '99')} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="mediumBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          
          {/* Main explosion */}
          <circle cx="50" cy="50" r="25" fill={`url(#${gradientId})`} filter="url(#mediumBlur)">
            <animate attributeName="r" from="10" to="25" dur="0.2s" />
          </circle>
          
          {/* Debris particles */}
          <circle cx="35" cy="35" r="2" fill="#ffffff">
            <animate attributeName="cx" from="50" to="35" dur="0.2s" />
            <animate attributeName="cy" from="50" to="35" dur="0.2s" />
          </circle>
          <circle cx="65" cy="35" r="2" fill="#ffffff">
            <animate attributeName="cx" from="50" to="65" dur="0.2s" />
            <animate attributeName="cy" from="50" to="35" dur="0.2s" />
          </circle>
          <circle cx="35" cy="65" r="2" fill="#ffffff">
            <animate attributeName="cx" from="50" to="35" dur="0.2s" />
            <animate attributeName="cy" from="50" to="65" dur="0.2s" />
          </circle>
          <circle cx="65" cy="65" r="2" fill="#ffffff">
            <animate attributeName="cx" from="50" to="65" dur="0.2s" />
            <animate attributeName="cy" from="50" to="65" dur="0.2s" />
          </circle>
        </svg>
      </div>
    );
  } else {
    // Small explosion (particle)
    return (
      <div
        className="particle"
        style={{ 
          left: x, 
          top: y,
          width: size,
          height: size,
          backgroundColor: color,
          position: 'absolute',
          borderRadius: '50%',
          zIndex: 2,
          boxShadow: `0 0 ${size/2}px ${color}`
        }}
      />
    );
  }
}

export default Explosion;
