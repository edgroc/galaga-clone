import React, { useEffect, useState } from 'react';

function BossWarning({ onComplete }) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  if (!visible) return null;
  
  return (
    <div className="boss-warning">
      WARNING: BOSS APPROACHING!
    </div>
  );
}

export default BossWarning;