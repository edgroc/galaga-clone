import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CONFIG, { DIFFICULTY } from '../config/gameConfig';

/**
 * Custom hook for managing game entities
 */
export function useEntityState(level) {
  // Player state
  const [player, setPlayer] = useState({
    x: CONFIG.game.width / 2 - CONFIG.player.width / 2,
    y: CONFIG.game.height - CONFIG.player.height - 20,
    width: CONFIG.player.width,
    height: CONFIG.player.height
  });
  
  // Entities state
  const [bullets, setBullets] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [diveBombers, setDiveBombers] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [explosions, setExplosions] = useState([]);
  
  // Initialize enemies for current level
  const initEnemies = useCallback(() => {
    const { rows, cols } = DIFFICULTY.enemyCount(level);
    const newEnemies = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newEnemies.push({
          id: uuidv4(),
          x: col * (CONFIG.enemies.width + 20) + 60,
          y: row * (CONFIG.enemies.height + 20) + 60,
          width: CONFIG.enemies.width,
          height: CONFIG.enemies.height,
          type: row % 3,
          health: DIFFICULTY.enemyHealth(level)
        });
      }
    }
    
    setEnemies(newEnemies);
  }, [level]);
  
  // Reset all entities (called when starting a new game/level)
  const resetEntities = useCallback(() => {
    setBullets([]);
    setEnemyBullets([]);
    setDiveBombers([]);
    setPowerUps([]);
    setExplosions([]);
    setPlayer({
      x: CONFIG.game.width / 2 - CONFIG.player.width / 2,
      y: CONFIG.game.height - CONFIG.player.height - 20,
      width: CONFIG.player.width,
      height: CONFIG.player.height
    });
    initEnemies();
  }, [initEnemies]);
  
  // Create a player bullet
  const createPlayerBullet = useCallback((isSpecial = false) => {
    const newBullet = {
      id: uuidv4(),
      x: player.x + player.width / 2 - CONFIG.bullets.playerBullet.width / 2,
      y: player.y - CONFIG.bullets.playerBullet.height,
      width: CONFIG.bullets.playerBullet.width,
      height: CONFIG.bullets.playerBullet.height,
      speed: isSpecial ? CONFIG.bullets.specialBullet.speed : CONFIG.bullets.playerBullet.speed,
      special: isSpecial
    };
    
    setBullets(prev => [...prev, newBullet]);
    
    // Create side bullets if special weapon
    if (isSpecial) {
      const leftBullet = {
        ...newBullet,
        id: uuidv4(),
        x: player.x + player.width / 2 - CONFIG.bullets.playerBullet.width / 2 - 15
      };
      
      const rightBullet = {
        ...newBullet,
        id: uuidv4(),
        x: player.x + player.width / 2 - CONFIG.bullets.playerBullet.width / 2 + 15
      };
      
      setBullets(prev => [...prev, leftBullet, rightBullet]);
    }
  }, [player]);
  
  // Create an enemy bullet
  const createEnemyBullet = useCallback((enemy) => {
    setEnemyBullets(prev => [
      ...prev,
      {
        id: uuidv4(),
        x: enemy.x + enemy.width / 2 - CONFIG.bullets.enemyBullet.width / 2,
        y: enemy.y + enemy.height,
        width: CONFIG.bullets.enemyBullet.width,
        height: CONFIG.bullets.enemyBullet.height,
        speed: CONFIG.bullets.enemyBullet.baseSpeed + level * 0.5
      }
    ]);
  }, [level]);
  
  // Create a dive bomber enemy
  const createDiveBomber = useCallback((enemy) => {
    setDiveBombers(prev => [
      ...prev,
      {
        id: uuidv4(),
        x: enemy.x,
        y: enemy.y,
        width: enemy.width,
        height: enemy.height,
        type: enemy.type,
        targetX: player.x + player.width / 2,
        speed: CONFIG.enemies.diveBomber.speed + level * 0.5
      }
    ]);
  }, [level, player]);
  
  // Create a power-up
  const createPowerUp = useCallback(() => {
    const isPowerUpLife = Math.random() < CONFIG.powerUps.types.life.probability;
    
    setPowerUps(prev => [
      ...prev,
      {
        id: uuidv4(),
        x: Math.random() * (CONFIG.game.width - CONFIG.powerUps.width),
        y: -CONFIG.powerUps.height,
        width: CONFIG.powerUps.width,
        height: CONFIG.powerUps.height,
        type: isPowerUpLife ? 'life' : 'special',
        speed: CONFIG.powerUps.speed
      }
    ]);
  }, []);
  
  // Create explosion particles
  const createExplosion = useCallback((x, y, size = 1, color = '#ff4500') => {
    const particleCount = size < 1 
      ? CONFIG.particles.count.small 
      : size < 1.5 
        ? CONFIG.particles.count.medium 
        : CONFIG.particles.count.large;
    
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      
      newParticles.push({
        id: uuidv4(),
        x, 
        y,
        vx: Math.cos(angle) * speed * size,
        vy: Math.sin(angle) * speed * size,
        color,
        size: 2 + Math.random() * 3 * size,
        life: CONFIG.particles.duration.medium + Math.random() * 20
      });
    }
    
    setExplosions(prev => [...prev, ...newParticles]);
  }, []);
  
  // Update player position
  const updatePlayerPosition = useCallback((moveLeft, moveRight) => {
    setPlayer(prev => {
      let newX = prev.x;
      
      if (moveLeft) {
        newX = Math.max(0, prev.x - CONFIG.player.speed);
      }
      
      if (moveRight) {
        newX = Math.min(CONFIG.game.width - prev.width, prev.x + CONFIG.player.speed);
      }
      
      return { ...prev, x: newX };
    });
  }, []);
  
  // Update bullets position
  const updateBullets = useCallback(() => {
    setBullets(prev => 
      prev
        .map(bullet => ({ 
          ...bullet, 
          y: bullet.y - bullet.speed 
        }))
        .filter(bullet => bullet.y > -bullet.height)
    );
    
    setEnemyBullets(prev => 
      prev
        .map(bullet => ({ 
          ...bullet, 
          y: bullet.y + bullet.speed 
        }))
        .filter(bullet => bullet.y < CONFIG.game.height)
    );
  }, []);
  
  // Update enemy positions
  const updateEnemyPositions = useCallback((direction, moveDown) => {
    const speed = DIFFICULTY.enemySpeed(level);
    
    setEnemies(prev => 
      prev.map(enemy => ({
        ...enemy,
        x: enemy.x + (speed * direction),
        y: moveDown ? enemy.y + 20 : enemy.y
      }))
    );
  }, [level]);
  
  // Update dive bomber positions
  const updateDiveBombers = useCallback(() => {
    setDiveBombers(prev => 
      prev
        .map(bomber => {
          // Calculate direction vector to target
          const dx = bomber.targetX - bomber.x;
          const dy = CONFIG.game.height - bomber.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          return {
            ...bomber,
            x: bomber.x + (dx / dist) * bomber.speed,
            y: bomber.y + (dy / dist) * bomber.speed * 0.7
          };
        })
        .filter(bomber => bomber.y < CONFIG.game.height)
    );
  }, []);
  
  // Update power-ups position
  const updatePowerUps = useCallback(() => {
    setPowerUps(prev => 
      prev
        .map(powerUp => ({ 
          ...powerUp, 
          y: powerUp.y + powerUp.speed 
        }))
        .filter(powerUp => powerUp.y < CONFIG.game.height)
    );
  }, []);
  
  // Update explosions
  const updateExplosions = useCallback(() => {
    setExplosions(prev => 
      prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1,
          size: particle.size * 0.95
        }))
        .filter(particle => particle.life > 0)
    );
  }, []);
  
  // Check for enemy-boundary collisions
  const checkEnemyBoundaries = useCallback(() => {
    if (enemies.length === 0) return { hitBoundary: false, direction: 1 };
    
    const leftmostEnemy = Math.min(...enemies.map(e => e.x));
    const rightmostEnemy = Math.max(...enemies.map(e => e.x + e.width));
    const currentDirection = rightmostEnemy - leftmostEnemy > 0 ? 1 : -1;
    
    if (rightmostEnemy >= CONFIG.game.width - 10 && currentDirection === 1) {
      return { hitBoundary: true, direction: -1 };
    }
    
    if (leftmostEnemy <= 10 && currentDirection === -1) {
      return { hitBoundary: true, direction: 1 };
    }
    
    return { hitBoundary: false, direction: currentDirection };
  }, [enemies]);
  
  // Clear all enemies (used for special weapons)
  const clearAllEnemies = useCallback(() => {
    enemies.forEach(enemy => {
      createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 1.5, '#00ffff');
    });
    
    setEnemies([]);
    setEnemyBullets([]);
    setDiveBombers([]);
  }, [enemies, createExplosion]);
  
  return {
    // Entity states
    player,
    bullets,
    enemyBullets,
    enemies,
    diveBombers,
    powerUps,
    explosions,
    
    // Entity state setters
    setPlayer,
    setBullets,
    setEnemyBullets,
    setEnemies,
    setDiveBombers,
    setPowerUps,
    setExplosions,
    
    // Entity creation
    initEnemies,
    resetEntities,
    createPlayerBullet,
    createEnemyBullet,
    createDiveBomber,
    createPowerUp,
    createExplosion,
    
    // Entity updates
    updatePlayerPosition,
    updateBullets,
    updateEnemyPositions,
    updateDiveBombers,
    updatePowerUps,
    updateExplosions,
    
    // Collision and boundaries
    checkEnemyBoundaries,
    clearAllEnemies
  };
}
