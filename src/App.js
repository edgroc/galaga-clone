import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [player, setPlayer] = useState({
    x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: GAME_HEIGHT - PLAYER_HEIGHT - 20,
  });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);

  // Enemy movement state
  const [enemyFormation, setEnemyFormation] = useState({
    direction: 1, // 1 for right, -1 for left
    moveDown: false,
    stepCount: 0
  });

  // Create a stable reference to the player state
  const playerRef = useRef(player);
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // Initialize enemies with increasing difficulty per level
  const initEnemies = useCallback(() => {
    const rowCount = Math.min(ENEMY_ROWS + Math.floor((level - 1) / 2), 6);
    const colCount = Math.min(ENEMY_COLS + Math.floor(level / 2), 10);
    
    const newEnemies = [];
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        newEnemies.push({
          id: `enemy-${row}-${col}`,
          x: col * (ENEMY_WIDTH + 10) + 50,
          y: row * (ENEMY_HEIGHT + 10) + 50,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
          type: row % 3
        });
      }
    }
    setEnemies(newEnemies);
    
    // Reset formation state
    setEnemyFormation({
      direction: 1,
      moveDown: false,
      stepCount: 0
    });
  }, [level]);

  // Key event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Start game or restart
      if (e.key === 'Enter') {
        if (gameOver) {
          restartGame();
        } else if (!gameStarted) {
          setGameStarted(true);
          initEnemies();
        }
      }

      // Shooting mechanism
      if (e.key === ' ' && gameStarted && !gameOver) {
        shoot();
      }
    };

    const handleKeyPress = (e) => {
      // Player movement
      if (gameStarted && !gameOver) {
        switch (e.key) {
          case 'ArrowLeft':
            setPlayer(prev => ({
              ...prev,
              x: Math.max(0, prev.x - 10)
            }));
            break;
          case 'ArrowRight':
            setPlayer(prev => ({
              ...prev,
              x: Math.min(GAME_WIDTH - PLAYER_WIDTH, prev.x + 10)
            }));
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameOver, initEnemies]);

  // Shooting mechanism
  const shoot = useCallback(() => {
    const currentPlayer = playerRef.current;
    setBullets(prevBullets => [
      ...prevBullets,
      {
        id: `bullet-${Date.now()}`,
        x: currentPlayer.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: currentPlayer.y
      }
    ]);
  }, []);

  // Game loop for bullets, collisions, and enemy movement
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Move bullets upward
      setBullets(prevBullets => 
        prevBullets
          .map(bullet => ({ ...bullet, y: bullet.y - 10 }))
          .filter(bullet => bullet.y > 0)
      );

      // Enemy movement logic
      setEnemyFormation(prev => {
        let newDirection = prev.direction;
        let moveDown = false;
        let newStepCount = prev.stepCount + 1;

        // Move every 30 frames
        if (newStepCount < 30) {
          return { ...prev, stepCount: newStepCount };
        }

        // Reset step count
        newStepCount = 0;

        // Check formation boundaries
        const leftmostEnemy = Math.min(...enemies.map(e => e.x));
        const rightmostEnemy = Math.max(...enemies.map(e => e.x + ENEMY_WIDTH));

        if (rightmostEnemy + 5 >= GAME_WIDTH && prev.direction === 1) {
          newDirection = -1;
          moveDown = true;
        } else if (leftmostEnemy - 5 <= 0 && prev.direction === -1) {
          newDirection = 1;
          moveDown = true;
        }

        return { 
          direction: newDirection, 
          moveDown, 
          stepCount: newStepCount 
        };
      });

      // Move enemies based on formation state
      setEnemies(prevEnemies => 
        prevEnemies.map(enemy => ({
          ...enemy,
          x: enemy.x + (enemyFormation.moveDown ? 0 : 5 * enemyFormation.direction),
          y: enemy.y + (enemyFormation.moveDown ? 20 : 0)
        }))
      );

      // Check bullet-enemy collisions
      setBullets(prevBullets => {
        let updatedBullets = [...prevBullets];
        let updatedEnemies = [...enemies];

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
              break;
            }
          }
        }

        // Check if all enemies are destroyed
        if (updatedEnemies.length === 0) {
          setLevel(prev => prev + 1);
          initEnemies();
        }

        setEnemies(updatedEnemies);
        return updatedBullets;
      });

      // Check if enemies reach the bottom
      const enemyReachedBottom = enemies.some(
        enemy => enemy.y + enemy.height >= player.y
      );

      if (enemyReachedBottom) {
        setGameOver(true);
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, enemies, player, initEnemies]);

  // Restart game
  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setGameStarted(true);
    initEnemies();
    setPlayer({
      x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: GAME_HEIGHT - PLAYER_HEIGHT - 20,
    });
    setBullets([]);
  };

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
                left: player.x, 
                top: player.y,
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
