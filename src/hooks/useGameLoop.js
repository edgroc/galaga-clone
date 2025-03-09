import { useEffect, useRef } from 'react';
import { useGameState, GameActions } from './useGameState';
import { useEntityState } from './useEntityState';
import { useInputSystem } from './useInputSystem';
import { useCollision } from './useCollision';
import CONFIG, { DIFFICULTY } from '../config/gameConfig';

/**
 * Main game loop hook
 */
export function useGameLoop() {
  const { state, dispatch } = useGameState();
  const { inputs, canFire } = useInputSystem();
  
  // Entity state management
  const entityState = useEntityState(state.level);
  const {
    player,
    bullets,
    enemyBullets,
    enemies,
    diveBombers,
    powerUps,
    explosions,
    
    // Entity creation methods
    initEnemies,
    resetEntities,
    createPlayerBullet,
    createEnemyBullet,
    createDiveBomber,
    createPowerUp,
    createExplosion,
    
    // Entity update methods
    updatePlayerPosition,
    updateBullets,
    updateEnemyPositions,
    updateDiveBombers,
    updatePowerUps,
    updateExplosions,
    
    // Entity utility methods
    checkEnemyBoundaries,
    clearAllEnemies
  } = entityState;
  
  // Collision detection
  const {
    checkBulletEnemyCollisions,
    checkBulletDiveBomberCollisions,
    checkPlayerEnemyBulletCollisions,
    checkPlayerDiveBomberCollisions,
    checkPlayerPowerUpCollisions,
    checkEnemiesReachedBottom
  } = useCollision();
  
  // Game state references
  const enemyDirection = useRef(1);
  const lastEnemyShootTime = useRef(0);
  const moveDownThisFrame = useRef(false);
  
  // Initialize level
  useEffect(() => {
    if (state.status === 'playing') {
      resetEntities();
    }
  }, [state.status, state.level, resetEntities]);
  
  // Main game loop
  useEffect(() => {
    if (state.status !== 'playing') return;
    
    const gameLoop = setInterval(() => {
      // Get difficulty parameters for current level
      const { enemyFireRate, diveBomberChance, powerUpChance } = {
        enemyFireRate: DIFFICULTY.enemyFireRate(state.level),
        diveBomberChance: DIFFICULTY.diveBomberChance(state.level),
        powerUpChance: DIFFICULTY.powerUpChance(state.level)
      };
      
      // 1. Handle player movement
      updatePlayerPosition(inputs.moveLeft, inputs.moveRight);
      
      // 2. Handle player shooting
      if (inputs.fire && canFire()) {
        createPlayerBullet(state.specialWeapon);
      }
      
      // 3. Handle special weapon activation
      if (inputs.specialWeapon && state.specialWeapon) {
        clearAllEnemies();
        dispatch(GameActions.resetSpecialWeapon());
      }
      
      // 4. Update special weapon timer
      if (state.specialWeapon) {
        dispatch(GameActions.updateSpecialWeaponTimer());
      }
      
      // 5. Process enemy shooting
      const now = Date.now();
      if (now - lastEnemyShootTime.current > enemyFireRate && enemies.length > 0) {
        const shootingEnemies = enemies.filter(enemy => enemy.y > 0);
        if (shootingEnemies.length > 0) {
          const randomEnemy = shootingEnemies[Math.floor(Math.random() * shootingEnemies.length)];
          createEnemyBullet(randomEnemy);
          lastEnemyShootTime.current = now;
        }
      }
      
      // 6. Check for dive bombers
      if (state.level >= 3 && enemies.length > 0) {
        enemies.forEach(enemy => {
          if (Math.random() < diveBomberChance && enemy.y < CONFIG.game.height / 3) {
            createDiveBomber(enemy);
          }
        });
      }
      
      // 7. Generate power-ups
      if (Math.random() < powerUpChance) {
        createPowerUp();
      }
      
      // 8. Check enemy boundaries and update direction
      const { hitBoundary, direction } = checkEnemyBoundaries();
      if (hitBoundary) {
        enemyDirection.current = direction;
        moveDownThisFrame.current = true;
      } else {
        moveDownThisFrame.current = false;
      }
      
      // 9. Update entity positions
      updateBullets();
      updateEnemyPositions(enemyDirection.current, moveDownThisFrame.current);
      updateDiveBombers();
      updatePowerUps();
      updateExplosions();
      
      // 10. Check for collisions
      
      // Bullet-enemy collisions
      checkBulletEnemyCollisions(
        bullets,
        enemies,
        createExplosion,
        state.level,
        // Remove bullet callback
        (index) => {
          entityState.setBullets(prev => {
            const newBullets = [...prev];
            newBullets.splice(index, 1);
            return newBullets;
          });
        },
        // Remove enemy callback
        (index) => {
          entityState.setEnemies(prev => {
            const newEnemies = [...prev];
            newEnemies.splice(index, 1);
            return newEnemies;
          });
        },
        // Damage enemy callback
        (index) => {
          entityState.setEnemies(prev => {
            const newEnemies = [...prev];
            newEnemies[index] = {
              ...newEnemies[index],
              health: newEnemies[index].health - 1
            };
            return newEnemies;
          });
        }
      );
      
      // Bullet-diveBomber collisions
      checkBulletDiveBomberCollisions(
        bullets,
        diveBombers,
        createExplosion,
        // Remove bullet callback
        (index) => {
          entityState.setBullets(prev => {
            const newBullets = [...prev];
            newBullets.splice(index, 1);
            return newBullets;
          });
        },
        // Remove diveBomber callback
        (index) => {
          entityState.setDiveBombers(prev => {
            const newDiveBombers = [...prev];
            newDiveBombers.splice(index, 1);
            return newDiveBombers;
          });
        }
      );
      
      // Player-enemyBullet collisions
      checkPlayerEnemyBulletCollisions(
        player,
        enemyBullets,
        createExplosion,
        // Remove enemyBullet callback
        (index) => {
          entityState.setEnemyBullets(prev => {
            const newEnemyBullets = [...prev];
            newEnemyBullets.splice(index, 1);
            return newEnemyBullets;
          });
        }
      );
      
      // Player-diveBomber collisions
      checkPlayerDiveBomberCollisions(
        player,
        diveBombers,
        createExplosion,
        // Remove diveBomber callback
        (index) => {
          entityState.setDiveBombers(prev => {
            const newDiveBombers = [...prev];
            newDiveBombers.splice(index, 1);
            return newDiveBombers;
          });
        }
      );
      
      // Player-powerUp collisions
      checkPlayerPowerUpCollisions(
        player,
        powerUps,
        createExplosion,
        // Remove powerUp callback
        (index) => {
          entityState.setPowerUps(prev => {
            const newPowerUps = [...prev];
            newPowerUps.splice(index, 1);
            return newPowerUps;
          });
        }
      );
      
      // 11. Check game over conditions
      
      // Enemies reached bottom
      if (checkEnemiesReachedBottom(enemies, player)) {
        dispatch(GameActions.gameOver());
      }
      
      // 12. Check level completion
      if (enemies.length === 0 && diveBombers.length === 0) {
        dispatch(GameActions.nextLevel());
      }
      
    }, CONFIG.game.tickRate);
    
    return () => clearInterval(gameLoop);
  }, [
    state.status,
    state.level,
    state.specialWeapon,
    inputs,
    player,
    bullets,
    enemyBullets,
    enemies,
    diveBombers,
    powerUps,
    explosions,
    canFire,
    updatePlayerPosition,
    updateBullets,
    updateEnemyPositions,
    updateDiveBombers,
    updatePowerUps,
    updateExplosions,
    createPlayerBullet,
    createEnemyBullet,
    createDiveBomber,
    createPowerUp,
    createExplosion,
    checkEnemyBoundaries,
    clearAllEnemies,
    checkBulletEnemyCollisions,
    checkBulletDiveBomberCollisions,
    checkPlayerEnemyBulletCollisions,
    checkPlayerDiveBomberCollisions,
    checkPlayerPowerUpCollisions,
    checkEnemiesReachedBottom,
    dispatch
  ]);
  
  return {
    gameState: state,
    entityState
  };
}
