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