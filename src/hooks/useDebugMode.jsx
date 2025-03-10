import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Debug mode hook for development and testing
 */
export function useDebugMode() {
  const [debugMode, setDebugMode] = useState(false);
  const [fps, setFps] = useState(0);
  const [entityCount, setEntityCount] = useState({});
  const [memoryUsage, setMemoryUsage] = useState(null);
  const [frameTime, setFrameTime] = useState(0);
  
  // Performance measurement references
  const fpsHistory = useRef([]);
  const lastFrameTime = useRef(performance.now());
  
  // Toggle debug mode
  useEffect(() => {
    const toggleDebug = (e) => {
      if (e.key === '`') {
        setDebugMode(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', toggleDebug);
    return () => window.removeEventListener('keydown', toggleDebug);
  }, []);
  
  // Calculate FPS
  const calculateFPS = useCallback(() => {
    const now = performance.now();
    const delta = now - lastFrameTime.current;
    lastFrameTime.current = now;
    
    // Convert to FPS
    const currentFps = 1000 / delta;
    
    // Update history (keep last 10 frames)
    fpsHistory.current.push(currentFps);
    if (fpsHistory.current.length > 10) {
      fpsHistory.current.shift();
    }
    
    // Calculate average
    const averageFps = fpsHistory.current.reduce((sum, fps) => sum + fps, 0) / fpsHistory.current.length;
    
    setFps(Math.round(averageFps));
    setFrameTime(delta.toFixed(2));
  }, []);
  
  // Update entity counts
  const updateEntityCount = useCallback((entities) => {
    setEntityCount({
      player: 1,
      bullets: entities.bullets?.length || 0,
      enemyBullets: entities.enemyBullets?.length || 0,
      enemies: entities.enemies?.length || 0,
      diveBombers: entities.diveBombers?.length || 0,
      powerUps: entities.powerUps?.length || 0,
      particles: entities.explosions?.length || 0,
      total: 1 + 
        (entities.bullets?.length || 0) + 
        (entities.enemyBullets?.length || 0) + 
        (entities.enemies?.length || 0) + 
        (entities.diveBombers?.length || 0) + 
        (entities.powerUps?.length || 0) + 
        (entities.explosions?.length || 0)
    });
  }, []);
  
  // Estimate memory usage (browser-dependent)
  const estimateMemoryUsage = useCallback(() => {
    if (window.performance && window.performance.memory) {
      setMemoryUsage({
        usedJSHeapSize: Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)),
        totalJSHeapSize: Math.round(window.performance.memory.totalJSHeapSize / (1024 * 1024))
      });
    } else {
      setMemoryUsage(null);
    }
  }, []);
  
  // Return debug info and update functions
  return {
    debugMode,
    debugInfo: debugMode ? {
      fps,
      frameTime,
      entityCount,
      memoryUsage
    } : null,
    updateDebugInfo: debugMode ? {
      calculateFPS,
      updateEntityCount,
      estimateMemoryUsage
    } : null
  };
}
