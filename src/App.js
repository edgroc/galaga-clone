import React, { useState, useEffect } from 'react';
import './App.css';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 800;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 15;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;
const ENEMY_ROWS = 4;
const ENEMY_COLS = 8;

function App() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  // Player state
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [playerY] = useState(GAME_HEIGHT - PLAYER_HEIGHT - 20);

  // Enemy state
  const [enemies, setEnemies] = useState([]);
  const [enemyDirection, setEnemyDirection] = useState(1); // 1 = right, -1 = left
  const [enemySpeed] = useState(2);
  const [moveDown, setMoveDown] = useState(false);

  // Bullet state
  const [bullets, setBullets] = useState([]);

  // Key tracking
  const [keys, setKeys] = useState({
    ArrowLeft: false,
    ArrowRight: false,
    Space: false
  });

  // Initialize the game
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Create enemies
      const newEnemies = [];
      for (let row = 0; row < ENEMY_ROWS; row++) {
        for (let col = 0; col < ENEMY_COLS; col++) {
          newEnemies.push({
            id: `enemy-${row}-${col}`,
            x: col * (ENEMY_WIDTH + 20) + 60,
            y: row * (ENEMY_HEIGHT + 20) + 60,
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT,
            type: row % 3
          });
        }
      }
      setEnemies(newEnemies);
    }
  }, [gameStarted, gameOver, level]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (gameOver) {
          // Restart game
          setGameOver(false);
          setScore(0);
          setLevel(1);
          setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
          setBullets([]);
          setGameStarted(true);
        } else if (!gameStarted) {
          setGameStarted(true);
        }
      } else if (e.key === 'Escape') {
        setGameStarted(false);
        setGameOver(true);
      } else if (e.key === ' ' || e.key === 'Space') {
        setKeys(prev => ({ ...prev, Space: true }));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setKeys(prev => ({ ...prev, [e.key]: true }));
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === ' ' || e.key === 'Space') {
        setKeys(prev => ({ ...prev, Space: false }));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setKeys(prev => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let lastShootTime = 0;
    
    const gameLoop = setInterval(() => {
      // Handle player movement
      if (keys.ArrowLeft) {
        setPlayerX(prev => Math.max(0, prev - 8));
      }
      if (keys.ArrowRight) {
        setPlayerX(prev => Math.min(GAME_WIDTH - PLAYER_WIDTH, prev + 8));
      }

      // Handle shooting
      const now = Date.now();
      if (keys.Space && now - lastShootTime > 300) { // Limit firing rate
        setBullets(prev => [
          ...prev,
          {
            id: `bullet-${now}`,
            x: playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
            y: playerY - BULLET_HEIGHT
          }
        ]);
        lastShootTime = now;
      }

      // Move bullets
      setBullets(prev => 
        prev
          .map(bullet => ({ ...bullet, y: bullet.y - 10 }))
          .filter(bullet => bullet.y > 0)
      );

      // Move enemies
      setEnemies(prev => {
        if (prev.length === 0) return prev;

        // Check if enemies need to change direction
        const leftmostEnemy = Math.min(...prev.map(e => e.x));
        const rightmostEnemy = Math.max(...prev.map(e => e.x + ENEMY_WIDTH));

        let newDirection = enemyDirection;
        let shouldMoveDown = false;

        if (rightmostEnemy + enemySpeed >= GAME_WIDTH && enemyDirection === 1) {
          newDirection = -1;
          shouldMoveDown = true;
        } else if (leftmostEnemy - enemySpeed <= 0 && enemyDirection === -1) {
          newDirection = 1;
          shouldMoveDown = true;
        }

        if (newDirection !== enemyDirection) {
          setEnemyDirection(newDirection);
          setMoveDown(shouldMoveDown);
        }

        // Move enemies
        return prev.map(enemy => ({
          ...enemy,
          x: enemy.x + (enemySpeed * enemyDirection),
          y: shouldMoveDown ? enemy.y + 20 : enemy.y
        }));
      });

      // Clear moveDown flag after one frame
      if (moveDown) {
        setMoveDown(false);
      }

      // Check for bullet-enemy collisions
      const updatedEnemies = [...enemies];
      const updatedBullets = [...bullets];
      let enemiesDestroyed = false;

      for (let i = updatedBullets.length - 1; i >= 0; i--) {
        const bullet = updatedBullets[i];
        
        for (let j = updatedEnemies.length - 1; j >= 0; j--) {
          const enemy = updatedEnemies[j];
          
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + BULLET_WIDTH > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + BULLET_HEIGHT > enemy.y
          ) {
            // Remove bullet and enemy
            updatedBullets.splice(i, 1);
            updatedEnemies.splice(j, 1);
            setScore(prev => prev + 100);
            enemiesDestroyed = true;
            break;
          }
        }
      }

      if (enemiesDestroyed) {
        setBullets(updatedBullets);
        setEnemies(updatedEnemies);
      }

      // Check if all enemies are destroyed
      if (updatedEnemies.length === 0) {
        setLevel(prev => prev + 1);
      }

      // Check if enemies reach the bottom
      const enemyReachedBottom = updatedEnemies.some(
        enemy => enemy.y + enemy.height >= playerY
      );

      if (enemyReachedBottom) {
        setGameOver(true);
      }
    }, 33); // ~30 FPS

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, keys, playerX, playerY, bullets, enemies, enemyDirection, enemySpeed, moveDown]);

  return (
    <div className="game-container">
      <div 
        className="game" 
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {!gameStarted ? (
          <div className="start-screen">
            <h1>Galaga Clone</h1>
            <p>Press ENTER to start</p>
            <p>Use LEFT/RIGHT arrows to move, SPACE to shoot</p>
            <p>Press ESC to exit game</p>
          </div>
        ) : (
          <>
            <div className="score-level">
              <div>Score: {score}</div>
              <div>Level: {level}</div>
            </div>
            
            {/* Player Ship */}
            <div 
              className="player" 
              style={{ 
                left: playerX, 
                top: playerY,
                width: PLAYER_WIDTH,
                height: PLAYER_HEIGHT
              }}
            />
            
            {/* Bullets */}
            {bullets.map((bullet) => (
              <div
                key={bullet.id}
                className="bullet"
                style={{ 
                  left: bullet.x, 
                  top: bullet.y,
                  width: BULLET_WIDTH,
                  height: BULLET_HEIGHT
                }}
              />
            ))}
            
            {/* Enemies */}
            {enemies.map((enemy) => (
              <div
                key={enemy.id}
                className={`enemy enemy-type-${enemy.type}`}
                style={{ 
                  left: enemy.x, 
                  top: enemy.y,
                  width: enemy.width,
                  height: enemy.height
                }}
              />
            ))}
            
            {gameOver && (
              <div className="game-over">
                <h1>Game Over</h1>
                <p>Final Score: {score}</p>
                <p>Final Level: {level}</p>
                <p>Press ENTER to restart</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
