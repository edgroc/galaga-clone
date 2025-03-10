import React, { useEffect, useState } from 'react';

function LevelTransition({ level, onComplete }) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  if (!visible) return null;
  
  return (
    <div className="level-transition">
      <h2>LEVEL</h2>
      <div className="level-number">{level}</div>
    </div>
  );
}

export default LevelTransition;