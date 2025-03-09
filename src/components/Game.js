import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { useGameLoop } from '../hooks/useGameLoop';
import GameBoard from './GameBoard';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import StatusBar from './StatusBar';
import Player from './Player';
import Bullet from './Bullet';
import Enemy from './Enemy';
import PowerUp from './PowerUp';
import Explosion from './Explosion';

/**
 * Main Game component
 */
function Game() {
  const { state } = useGameState();
  const { entityState } = useGameLoop();
  
  const {
    player,
    bullets,
    enemyBullets,
    enemies,
    diveBombers,
    powerUps,
    explosions
  } = entityState;
  
  return (
    <div className="game-container">
      <GameBoard>
        {state.status === 'idle' && (
          <StartScreen highScore={state.highScore} />
        )}
        
        {state.status === 'playing' && (
          <>
            <StatusBar 
              score={state.score} 
              level={state.level} 
              lives={state.lives} 
              specialWeapon={state.specialWeapon}
            />
            
            <Player 
              x={player.x}
              y={player.y}
              width={player.width}
              height={player.height}
              isInvulnerable={state.isInvulnerable}
            />
            
            {/* Player bullets */}
            {bullets.map(bullet => (
              <Bullet
                key={bullet.id}
                x={bullet.x}
                y={bullet.y}
                width={bullet.width}
                height={bullet.height}
                isSpecial={bullet.special}
                type="player"
              />
            ))}
            
            {/* Enemy bullets */}
            {enemyBullets.map(bullet => (
              <Bullet
                key={bullet.id}
                x={bullet.x}
                y={bullet.y}
                width={bullet.width}
                height={bullet.height}
                type="enemy"
              />
            ))}
            
            {/* Regular enemies */}
            {enemies.map(enemy => (
              <Enemy
                key={enemy.id}
                x={enemy.x}
                y={enemy.y}
                width={enemy.width}
                height={enemy.height}
                type={enemy.type}
                isTough={enemy.health > 1}
              />
            ))}
            
            {/* Dive bombers */}
            {diveBombers.map(bomber => (
              <Enemy
                key={bomber.id}
                x={bomber.x}
                y={bomber.y}
                width={bomber.width}
                height={bomber.height}
                type={bomber.type}
                isDiveBomber={true}
              />
            ))}
            
            {/* Power-ups */}
            {powerUps.map(powerUp => (
              <PowerUp
                key={powerUp.id}
                x={powerUp.x}
                y={powerUp.y}
                width={powerUp.width}
                height={powerUp.height}
                type={powerUp.type}
              />
            ))}
            
            {/* Explosions */}
            {explosions.map(particle => (
              <Explosion
                key={particle.id}
                x={particle.x}
                y={particle.y}
                size={particle.size}
                color={particle.color}
              />
            ))}
          </>
        )}
        
        {state.status === 'paused' && (
          <div className="pause-overlay">
            <h2>PAUSED</h2>
            <p>Press P to resume</p>
          </div>
        )}
        
        {state.status === 'gameOver' && (
          <GameOverScreen score={state.score} level={state.level} highScore={state.highScore} />
        )}
      </GameBoard>
    </div>
  );
}

export default Game;
