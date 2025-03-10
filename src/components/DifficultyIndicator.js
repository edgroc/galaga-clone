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