import { useCallback } from 'react';
import { useGameState, GameActions } from './useGameState';
import CONFIG from '../config/gameConfig';

/**
 * Custom hook for collision detection and handling
 */
export function useCollision() {
  const { state, dispatch } = useGameState();
  
  /**
   * Check for collision between two entities
   */
  const isColliding = useCallback((entity1, entity2) => {
    return (
      entity1.x < entity2.x + entity2.width &&
      entity1.x + entity1.width > entity2.x &&
      entity1.y < entity2.y + entity2.height &&
      entity1.y + entity1.height > entity2.y
    );
  }, []);
  
  /**
   * Check bullet-enemy collisions and handle results
   */
  const checkBulletEnemyCollisions = useCallback((
    bullets, 
    enemies, 
    createExplosion, 
    level,
    removeBullet,
    removeEnemy,
    damageEnemy
  ) => {
    const collisions = [];
    
    bullets.forEach((bullet, bulletIndex) => {
      let bulletRemoved = false;
      
      enemies.forEach((enemy, enemyIndex) => {
        if (bulletRemoved) return;
        
        if (isColliding(bullet, enemy)) {
          // Create small explosion
          createExplosion(bullet.x, bullet.y, 0.5);
          
          // Reduce enemy health or destroy
          if (enemy.health > 1 && !bullet.special) {
            damageEnemy(enemyIndex);
          } else {
            // Create large explosion
            createExplosion(
              enemy.x + enemy.width/2, 
              enemy.y + enemy.height/2
            );
            
            // Add score
            const pointMultiplier = level > 10 ? 2 : 1;
            dispatch(GameActions.addScore(CONFIG.enemies.points.basic * pointMultiplier));
            
            // Remove enemy
            removeEnemy(enemyIndex);
          }
          
          // Remove bullet unless it's special and has penetration
          if (!bullet.special || Math.random() > CONFIG.bullets.specialBullet.penetration) {
            removeBullet(bulletIndex);
            bulletRemoved = true;
          }
          
          collisions.push({ bullet, enemy });
        }
      });
    });
    
    return collisions;
  }, [isColliding, dispatch]);
  
  /**
   * Check bullet-diveBomber collisions
   */
  const checkBulletDiveBomberCollisions = useCallback((
    bullets, 
    diveBombers,
    createExplosion,
    removeBullet,
    removeDiveBomber
  ) => {
    const collisions = [];
    
    bullets.forEach((bullet, bulletIndex) => {
      let bulletRemoved = false;
      
      diveBombers.forEach((bomber, bomberIndex) => {
        if (bulletRemoved) return;
        
        if (isColliding(bullet, bomber)) {
          // Create large explosion
          createExplosion(
            bomber.x + bomber.width/2, 
            bomber.y + bomber.height/2, 
            1.5, 
            '#ffff00'
          );
          
          // Add score
          dispatch(GameActions.addScore(CONFIG.enemies.diveBomber.points));
          
          // Remove dive bomber
          removeDiveBomber(bomberIndex);
          
          // Remove bullet
          removeBullet(bulletIndex);
          bulletRemoved = true;
          
          collisions.push({ bullet, bomber });
        }
      });
    });
    
    return collisions;
  }, [isColliding, dispatch]);
  
  /**
   * Check player-enemyBullet collisions
   */
  const checkPlayerEnemyBulletCollisions = useCallback((
    player, 
    enemyBullets,
    createExplosion,
    removeEnemyBullet
  ) => {
    if (state.isInvulnerable) return false;
    
    for (let i = 0; i < enemyBullets.length; i++) {
      const bullet = enemyBullets[i];
      
      if (isColliding(player, bullet)) {
        // Create explosion
        createExplosion(
          player.x + player.width/2, 
          player.y + player.height/2, 
          2, 
          '#ff00ff'
        );
        
        // Remove bullet
        removeEnemyBullet(i);
        
        // Player loses a life
        dispatch(GameActions.loseLife());
        
        return true;
      }
    }
    
    return false;
  }, [isColliding, dispatch, state.isInvulnerable]);
  
  /**
   * Check player-diveBomber collisions
   */
  const checkPlayerDiveBomberCollisions = useCallback((
    player, 
    diveBombers,
    createExplosion,
    removeDiveBomber
  ) => {
    if (state.isInvulnerable) return false;
    
    for (let i = 0; i < diveBombers.length; i++) {
      const bomber = diveBombers[i];
      
      if (isColliding(player, bomber)) {
        // Create explosion
        createExplosion(
          player.x + player.width/2, 
          player.y + player.height/2, 
          2, 
          '#ff00ff'
        );
        
        // Remove dive bomber
        removeDiveBomber(i);
        
        // Player loses a life
        dispatch(GameActions.loseLife());
        
        return true;
      }
    }
    
    return false;
  }, [isColliding, dispatch, state.isInvulnerable]);
  
  /**
   * Check player-powerUp collisions
   */
  const checkPlayerPowerUpCollisions = useCallback((
    player, 
    powerUps,
    createExplosion,
    removePowerUp
  ) => {
    const collisions = [];
    
    powerUps.forEach((powerUp, index) => {
      if (isColliding(player, powerUp)) {
        // Create effect
        createExplosion(
          powerUp.x + powerUp.width/2, 
          powerUp.y + powerUp.height/2, 
          1, 
          '#00ff00'
        );
        
        // Apply power-up effect
        if (powerUp.type === 'life') {
          dispatch(GameActions.gainLife());
        } else if (powerUp.type === 'special') {
          dispatch(GameActions.setSpecialWeapon(true));
        }
        
        // Remove power-up
        removePowerUp(index);
        
        collisions.push(powerUp);
      }
    });
    
    return collisions;
  }, [isColliding, dispatch]);
  
  /**
   * Check if enemies have reached the bottom
   */
  const checkEnemiesReachedBottom = useCallback((enemies, player) => {
    return enemies.some(enemy => enemy.y + enemy.height >= player.y);
  }, []);
  
  return {
    isColliding,
    checkBulletEnemyCollisions,
    checkBulletDiveBomberCollisions,
    checkPlayerEnemyBulletCollisions,
    checkPlayerDiveBomberCollisions,
    checkPlayerPowerUpCollisions,
    checkEnemiesReachedBottom
  };
}