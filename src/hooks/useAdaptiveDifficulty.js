// hooks/useAdaptiveDifficulty.js
import { useState, useEffect } from 'react';

/**
 * AI-powered adaptive difficulty system that adjusts game difficulty based on player performance
 */
export function useAdaptiveDifficulty(playerScore, playerDeaths, level) {
  const [difficultyMultiplier, setDifficultyMultiplier] = useState(1.0);
  const [playerSkillRating, setPlayerSkillRating] = useState(50); // 0-100 scale
  const [adaptationHistory, setAdaptationHistory] = useState([]);
  
  // Analyze player performance and adapt difficulty
  useEffect(() => {
    // Skip initial render
    if (playerScore === 0) return;
    
    // Calculate player performance metrics
    const scorePerLevel = playerScore / Math.max(1, level);
    const deathRatio = playerDeaths / Math.max(1, level);
    
    // Determine player skill level (0-100)
    let newSkillRating = playerSkillRating;
    
    // High score with few deaths = skilled player
    if (scorePerLevel > 1000 && deathRatio < 1) {
      newSkillRating += 5;
    } 
    // Low score with many deaths = struggling player
    else if (scorePerLevel < 500 && deathRatio > 2) {
      newSkillRating -= 5;
    }
    // Moderate adjustments for other cases
    else if (scorePerLevel > 800) {
      newSkillRating += 2;
    } else if (scorePerLevel < 300) {
      newSkillRating -= 2;
    }
    
    // Clamp skill rating between 0-100
    newSkillRating = Math.max(0, Math.min(100, newSkillRating));
    setPlayerSkillRating(newSkillRating);
    
    // Adjust difficulty based on skill rating
    // Skilled players (>70) get harder game, struggling players (<30) get easier game
    let newMultiplier = 1.0;
    if (newSkillRating > 70) {
      newMultiplier = 1.0 + ((newSkillRating - 70) / 100); // Up to 1.3x harder
    } else if (newSkillRating < 30) {
      newMultiplier = 1.0 - ((30 - newSkillRating) / 150); // Up to 0.8x easier
    }
    
    setDifficultyMultiplier(newMultiplier);
    
    // Record adaptation for analytics
    setAdaptationHistory(prev => [
      ...prev, 
      {
        level,
        skillRating: newSkillRating,
        multiplier: newMultiplier,
        timestamp: Date.now()
      }
    ]);
    
  }, [level, playerScore, playerDeaths, playerSkillRating]);
  
  return {
    difficultyMultiplier,
    playerSkillRating,
    adaptationHistory
  };
}

// hooks/useEnemyAI.js
import { useCallback } from 'react';

/**
 * AI-powered enemy behavior system
 */
export function useEnemyAI(level, difficultyMultiplier, playerPosition) {
  // Basic formation patterns
  const formationPatterns = [
    'standard',     // Basic side-to-side
    'zigzag',       // Zigzag pattern
    'pincer',       // Split and attack from sides
    'wave',         // Wave-like motion
    'spiral',       // Spiral down
    'intelligent'   // Reacts to player position
  ];
  
  // Get current AI pattern based on level
  const getAIPattern = useCallback(() => {
    if (level < 3) return 'standard';
    if (level < 5) return 'zigzag';
    if (level < 7) return 'pincer';
    if (level < 9) return 'wave';
    if (level < 12) return 'spiral';
    return 'intelligent';
  }, [level]);
  
  // Calculate dive bomber targeting
  const calculateDiveBomberTarget = useCallback((bomberPosition) => {
    const pattern = getAIPattern();
    let targetX = playerPosition.x;
    
    if (pattern === 'intelligent') {
      // Predict player movement and aim slightly ahead
      const horizontalDistance = Math.abs(bomberPosition.x - playerPosition.x);
      const verticalDistance = Math.abs(bomberPosition.y - playerPosition.y);
      const timeToImpact = verticalDistance / (10 * difficultyMultiplier);
      
      // Predict future player position (simple linear extrapolation)
      const predictedMovement = playerPosition.velocityX * timeToImpact;
      targetX = playerPosition.x + predictedMovement;
    }
    
    return {
      x: targetX,
      y: playerPosition.y
    };
  }, [getAIPattern, playerPosition, difficultyMultiplier]);
  
  // Determine if enemies should perform special maneuvers
  const shouldPerformSpecialManeuver = useCallback((enemyCount) => {
    const pattern = getAIPattern();
    const baseChance = 0.005 * difficultyMultiplier;
    
    if (pattern === 'standard') return false;
    if (pattern === 'intelligent' && enemyCount < 10) return Math.random() < baseChance * 3;
    
    return Math.random() < baseChance;
  }, [getAIPattern, difficultyMultiplier]);
  
  // Get enemy fire rate multiplier
  const getFireRateMultiplier = useCallback(() => {
    return difficultyMultiplier * (1 + (level * 0.05));
  }, [difficultyMultiplier, level]);
  
  return {
    getAIPattern,
    calculateDiveBomberTarget,
    shouldPerformSpecialManeuver,
    getFireRateMultiplier
  };
}

// components/BossEnemy.js
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

// components/DifficultyIndicator.js
import React from 'react';

function DifficultyIndicator({ skillRating, difficultyMultiplier }) {
  // Determine difficulty level text
  const getDifficultyText = () => {
    if (difficultyMultiplier > 1.2) return "CHALLENGING";
    if (difficultyMultiplier > 1.1) return "HARD";
    if (difficultyMultiplier < 0.9) return "EASIER";
    if (difficultyMultiplier < 0.95) return "EASY";
    return "BALANCED";
  };
  
  // Get color based on difficulty
  const getDifficultyColor = () => {
    if (difficultyMultiplier > 1.2) return "#ff3333";
    if (difficultyMultiplier > 1.1) return "#ff9900";
    if (difficultyMultiplier < 0.9) return "#33cc33";
    if (difficultyMultiplier < 0.95) return "#66cc66";
    return "#ffffff";
  };
  
  return (
    <div className="difficulty-indicator">
      <div className="difficulty-label">AI DIFFICULTY:</div>
      <div 
        className="difficulty-value"
        style={{ color: getDifficultyColor() }}
      >
        {getDifficultyText()}
      </div>
      <div className="skill-meter">
        <div 
          className="skill-fill"
          style={{ width: `${skillRating}%` }}
        />
      </div>
    </div>
  );
}

export default DifficultyIndicator;
