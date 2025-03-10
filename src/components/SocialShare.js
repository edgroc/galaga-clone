// components/SocialShare.js
import React from 'react';

function SocialShare({ score, level }) {
  const shareText = `I just reached Level ${level} with a score of ${score} on Galactic Invaders - an #AI-enhanced game! Can you beat my score? #GameDev #AIGaming`;
  const shareUrl = window.location.href;
  
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };
  
  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank');
  };
  
  return (
    <div className="social-share">
      <button className="share-button twitter" onClick={shareToTwitter}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Share on X
      </button>
      <button className="share-button linkedin" onClick={shareToLinkedIn}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        Share on LinkedIn
      </button>
    </div>
  );
}

export default SocialShare;

// components/AIBadge.js
import React from 'react';

function AIBadge() {
  return (
    <div className="ai-badge">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#0099ff">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm-6-8v-2h8v2h-8z"/>
      </svg>
      AI-POWERED
    </div>
  );
}

export default AIBadge;

// components/LevelTransition.js
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

// components/BossWarning.js
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

// components/ScorePopup.js
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
