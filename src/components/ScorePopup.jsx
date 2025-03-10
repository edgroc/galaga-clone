import React, { useEffect, useState } from 'react';

function ScorePopup({ value, x, y }) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div 
      className="score-popup"
      style={{ left: x, top: y }}
    >
      +{value}
    </div>
  );
}

export default ScorePopup;