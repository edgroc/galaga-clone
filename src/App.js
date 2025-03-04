// src/App.js
import React, { useState, useEffect, useRef } from 'react';
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
const ENEMY_ROW_SPACING = 60;
const ENEMY_COL_SPACING = 60;

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
  const [formation, setFormation] = useState({
    direction: 1, // 1 for right, -1 for left
    moveDown: false,
    step: 0,
  });
  
  const gameRef = useRef(null);
  const frameIdRef = useRef(null);
  const keysPressed = useRef({});

  // Initialize enemies
  useEffect(() => {
    if (gameStarted) {
      initEnemies();
    }
  }, [gameStarted]);

  const initEnemies = () => {
    const newEnemies = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        newEnemies.push({
          x: col * ENEMY_COL_SPACING + 80,
          y: row * ENEMY_ROW_SPACING + 60,
          width: ENEMY_WIDTH,
          height: ENEMY_HEIGHT,
          row,
          col,
        });
      }
    }
    setEnemies(newEnemies);
  };

  // Set up key listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      
      // Space key to shoot
      if (e.key === ' ' && gameStarted && !gameOver) {
        shoot();
      }
      
      // Enter key to start/restart game
      if (e.key === 'Enter') {
        if (gameOver) {
          restartGame();
        } else if (!gameStarted) {
          setGameStarted(true);
        }
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver]);

  // Main game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let lastTime = 0;
    const FRAME_RATE = 1000 / 60; // 60 FPS

    const gameLoop = (timestamp) => {
      const deltaTime = timestamp - lastTime;
      
      if (deltaTime >= FRAME_RATE) {
        updateGame();
        lastTime = timestamp;
      }
      
      frameIdRef.current = requestAnimationFrame(gameLoop);
    };

    frameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  const updateGame = () => {
    // Move player based on key presses
    if (keysPressed.current.ArrowLeft) {
      setPlayer((prev) => ({
        ...prev,
        x: Math.max(0, prev.x - 8),
      }));
    }
    if (keysPressed.current.ArrowRight) {
      setPlayer((prev) => ({
        ...prev,
        x: Math.min(GAME_WIDTH - PLAYER_WIDTH, prev.x + 8),
      }));
    }

    // Update bullets
    setBullets((prevBullets) => {
      return prevBullets
        .map((bullet) => ({
          ...bullet,
          y: bullet.y - 10, // Bullet speed
        }))
        .filter((bullet) => bullet.y > 0);
    });

    // Move enemies in formation
    updateEnemyFormation();

    // Check collisions
    checkCollisions();
  };

  const updateEnemyFormation = () => {
    // Only move enemies every few frames for a slower pace
    setFormation((prev) => {
      const newStep = prev.step + 1;
      if (newStep < 20) {
        return { ...prev, step: newStep };
      }

      let moveDown = false;
      let newDirection = prev.direction;

      // Check if formation should change direction
      const leftmostEnemy = Math.min(...enemies.map((e) => e.x));
      const rightmostEnemy = Math.max(...enemies.map((e) => e.x + ENEMY_WIDTH));

      if (rightmostEnemy + 5 >= GAME_WIDTH && prev.direction === 1) {
        newDirection = -1;
        moveDown = true;
      } else if (leftmostEnemy - 5 <= 0 && prev.direction === -1) {
        newDirection = 1;
        moveDown = true;
      }

      setEnemies((prevEnemies) => {
        return prevEnemies.map((enemy) => {
          return {
            ...enemy,
            x: enemy.x + (moveDown ? 0 : 5 * newDirection),
            y: enemy.y + (moveDown ? 20 : 0),
          };
        });
      });

      return { direction: newDirection, moveDown: false, step: 0 };
    });
  };

  const checkCollisions = () => {
    // Check for bullet collisions with enemies
    let newScore = score;
    const newEnemies = [...enemies];
    const newBullets = [...bullets];

    for (let i = newBullets.length - 1; i >= 0; i--) {
      const bullet = newBullets[i];
      
      for (let j = newEnemies.length - 1; j >= 0; j--) {
        const enemy = newEnemies[j];
        
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + BULLET_WIDTH > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + BULLET_HEIGHT > enemy.y
        ) {
          // Collision detected
          newEnemies.splice(j, 1);
          newBullets.splice(i, 1);
          newScore += 100;
          break;
        }
      }
    }

    // Check if player is hit by an enemy
    const playerHit = newEnemies.some(
      (enemy) =>
        enemy.x < player.x + PLAYER_WIDTH &&
        enemy.x + enemy.width > player.x &&
        enemy.y < player.y + PLAYER_HEIGHT &&
        enemy.y + enemy.height > player.y
    );

    // Check if enemies reached the bottom
    const enemyReachedBottom = newEnemies.some(
      (enemy) => enemy.y + enemy.height >= player.y
    );

    if (playerHit || enemyReachedBottom) {
      setGameOver(true);
    }

    // Check if all enemies are destroyed
    if (newEnemies.length === 0) {
      initEnemies();
    }

    setBullets(newBullets);
    setEnemies(newEnemies);
    setScore(newScore);
  };

  const shoot = () => {
    setBullets((prevBullets) => [
      ...prevBullets,
      {
        x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: player.y - BULLET_HEIGHT,
      },
    ]);
  };

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
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
        ref={gameRef}
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
            <div className="score">Score: {score}</div>
            <div 
              className="player" 
              style={{ 
                left: player.x, 
                top: player.y,
                width: PLAYER_WIDTH,
                height: PLAYER_HEIGHT
              }}
            />
            
            {bullets.map((bullet, index) => (
              <div
                key={index}
                className="bullet"
                style={{ 
                  left: bullet.x, 
                  top: bullet.y,
                  width: BULLET_WIDTH,
                  height: BULLET_HEIGHT
                }}
              />
            ))}
            
            {enemies.map((enemy, index) => (
              <div
                key={index}
                className={`enemy enemy-type-${enemy.row % 3}`}
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
