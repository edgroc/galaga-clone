import { useEffect, useRef, useCallback } from 'react';
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
    formationDirection,
    
    // Entity state setters - only include the ones we use
    setBullets,
    setEnemyBullets,
    setEnemies,
    setDiveBombers,
    setPowerUps,
    
    // Entity creation methods
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
  const lastEnemyShootTime = useRef(0);
  const frameCounter = useRef(0);

  // Memoized callback for entity reset to include in dependency array
  const resetEntitiesCallback = useCallback(() => {
    resetEntities();
  }, [resetEntities]);
  
  // Initialize level
  useEffect(() => {
    if (state.status === 'playing') {
      resetEntitiesCallback();
    }
  }, [state.status, state.level, resetEntitiesCallback]);
  
  // Main game loop
  useEffect(() => {
    if (state.status !== 'playing') return;
    
    const gameLoop = setInterval(() => {
      // Increment frame counter
      frameCounter.current += 1;
      
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
      
      // 8. Check enemy boundaries and update movement
      // Only move enemies every several frames to control speed
      if (frameCounter.current % 30 === 0) { // Adjust this value to change enemy movement speed
        const { moveDown } = checkEnemyBoundaries();
        updateEnemyPositions(moveDown);
      }
      
      // 9. Update entity positions
      updateBullets();
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
          setBullets(prev => {
            const newBullets = [...prev];
            newBullets.splice(index, 1);
            return newBullets;
          });
        },
        // Remove enemy callback
        (index) => {
          setEnemies(prev => {
            const newEnemies = [...prev];
            newEnemies.splice(index, 1);
            return newEnemies;
          });
        },
        // Damage enemy callback
        (index) => {
          setEnemies(prev => {
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
          setBullets(prev => {
            const newBullets = [...prev];
            newBullets.splice(index, 1);
            return newBullets;
          });
        },
        // Remove diveBomber callback
        (index) => {
          setDiveBombers(prev => {
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
          setEnemyBullets(prev => {
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
          setDiveBombers(prev => {
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
          setPowerUps(prev => {
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
    formationDirection,
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
    dispatch,
    setBullets,
    setEnemyBullets,
    setEnemies,
    setDiveBombers,
    setPowerUps
  ]);
  
  return {
    gameState: state,
    entityState
  };
}
