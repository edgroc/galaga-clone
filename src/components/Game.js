// components/Game.js - Enhanced version with viral features
import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useGameLoop } from '../hooks/useGameLoop';
import GameBoard from './GameBoard';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import StatusBar from './StatusBar';
import Player from './Player';
import Bullet from './Bullet';
import Enemy from './Enemy';
import BossEnemy from './BossEnemy';
import PowerUp from './PowerUp';
import Explosion from './Explosion';
import LevelTransition from './LevelTransition';
import BossWarning from './BossWarning';
import SocialShare from './SocialShare';
import DifficultyIndicator from './DifficultyIndicator';
import ScorePopup from './ScorePopup';

/**
 * Main Game component with enhanced visual and AI features
 */
function Game() {
  const { state } = useGameState();
  const { entityState } = useGameLoop();
  
  // Player stats for adaptive difficulty
  const [playerDeaths, setPlayerDeaths] = useState(0);
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [showBossWarning, setShowBossWarning] = useState(false);
  const [scorePopups, setScorePopups] = useState([]);
  const [lastPlayerPos, setLastPlayerPos] = useState({ x: 0 });

  // Mock adaptive difficulty (since we don't have the actual hook implemented)
  const [difficultyMultiplier, setDifficultyMultiplier] = useState(1.0);
  const [playerSkillRating, setPlayerSkillRating] = useState(50);
  
  // Simulate skill rating changes based on score
  useEffect(() => {
    if (state.score > 1000) {
      setPlayerSkillRating(75);
      setDifficultyMultiplier(1.1);
    } else if (state.score > 500) {
      setPlayerSkillRating(60);
      setDifficultyMultiplier(1.0);
    }
  }, [state.score]);
  
  // Boss enemy state
  const [bossEnemy, setBossEnemy] = useState(null);
  
  const {
    player,
    bullets,
    enemyBullets,
    enemies,
    diveBombers,
    powerUps,
    explosions
  } = entityState;
  
  // Track player deaths
  useEffect(() => {
    if (state.lives < 3 - playerDeaths) {
      setPlayerDeaths(prev => prev + 1);
    }
  }, [state.lives, playerDeaths]);
  
  // Track player position
  useEffect(() => {
    if (player) {
      setLastPlayerPos({ x: player.x });
    }
  }, [player]);
  
  // Show level transition
  useEffect(() => {
    if (state.status === 'playing' && state.level > 1) {
      setShowLevelTransition(true);
      
      // Make sure we don't accidentally end the game during transition
      const transitionTimer = setTimeout(() => {
        setShowLevelTransition(false);
      }, 2000);
      
      // Check if this level should have a boss
      if (state.level % 5 === 0 && !bossEnemy) {
        // Schedule boss warning after level transition
        const bossWarningTimer = setTimeout(() => {
          setShowBossWarning(true);
          
          // Create boss after warning
          const bossTimer = setTimeout(() => {
            setBossEnemy({
              x: 300 - 60,
              y: 100,
              width: 120,
              height: 120,
              bossType: Math.floor(state.level / 5),
              health: 100 * Math.floor(state.level / 5),
              maxHealth: 100 * Math.floor(state.level / 5)
            });
          }, 3000);
          
          return () => clearTimeout(bossTimer);
        }, 2000);
        
        return () => clearTimeout(bossWarningTimer);
      }
      
      return () => clearTimeout(transitionTimer);
    }
  }, [state.level, state.status, bossEnemy]);
  
  
  // Add Console logging for state levels and enemies
  useEffect(() => {
    if (state.level > 1) {
      console.log(`Level ${state.level} started with ${enemies.length} enemies`);
    }
  }, [state.level, enemies.length]);
  
  // Add score popup when score changes
  useEffect(() => {
    if (state.score > 0 && state.status === 'playing') {
      // Check if enemy was just destroyed (simple heuristic)
      const isEnemyDestroyed = enemies.length < 5 && explosions.length > 0;
      
      if (isEnemyDestroyed) {
        const randomExplosion = explosions[Math.floor(Math.random() * explosions.length)];
        if (randomExplosion) {
          setScorePopups(prev => [
            ...prev,
            {
              id: Date.now(),
              value: 100,
              x: randomExplosion.x,
              y: randomExplosion.y
            }
          ]);
        }
      }
    }
  }, [state.score, state.status, enemies.length, explosions]);
  
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
            
            <DifficultyIndicator 
              skillRating={playerSkillRating}
              difficultyMultiplier={difficultyMultiplier}
            />
            
            <Player 
              x={player.x}
              y={player.y}
              width={player.width}
              height={player.height}
              isInvulnerable={state.isInvulnerable}
            />
            
            {/* Boss enemy */}
            {bossEnemy && (
              <BossEnemy
                x={bossEnemy.x}
                y={bossEnemy.y}
                width={bossEnemy.width}
                height={bossEnemy.height}
                bossType={bossEnemy.bossType}
                health={bossEnemy.health}
                maxHealth={bossEnemy.maxHealth}
              />
            )}
            
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
            
            {/* Score popups */}
            {scorePopups.map(popup => (
              <ScorePopup
                key={popup.id}
                value={popup.value}
                x={popup.x}
                y={popup.y}
              />
            ))}
            
            {/* Level transition overlay */}
            {showLevelTransition && (
              <LevelTransition 
                level={state.level} 
                onComplete={() => setShowLevelTransition(false)} 
              />
            )}
            
            {/* Boss warning */}
            {showBossWarning && (
              <BossWarning 
                onComplete={() => setShowBossWarning(false)} 
              />
            )}
            
          </>
        )}
        
        {state.status === 'paused' && (
          <div className="pause-overlay">
            <h2>PAUSED</h2>
            <p>Press P to resume</p>
          </div>
        )}
        
        {state.status === 'gameOver' && (
          <GameOverScreen 
            score={state.score} 
            level={state.level} 
            highScore={state.highScore}
          >
            <SocialShare 
              score={state.score}
              level={state.level}
            />
          </GameOverScreen>
        )}
      </GameBoard>
    </div>
  );
}

export default Game;