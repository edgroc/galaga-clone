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
const BASE_ENEMY_ROWS = 4;
const BASE_ENEMY_COLS = 8;

function App() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);

  // Player state
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [playerY] = useState(GAME_HEIGHT - PLAYER_HEIGHT - 20);
  const [isPlayerInvulnerable, setIsPlayerInvulnerable] = useState(false);
  const [specialWeapon, setSpecialWeapon] = useState(false);

  // Enemy state
  const [enemies, setEnemies] = useState([]);
  const [enemyDirection, setEnemyDirection] = useState(1); // 1 = right, -1 = left
  const [enemySpeed, setEnemySpeed] = useState(2);
  const [moveDown, setMoveDown] = useState(false);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [diveBombers, setDiveBombers] = useState([]);

  // Power-ups
  const [powerUps, setPowerUps] = useState([]);

  // Bullet state
  const [bullets, setBullets] = useState([]);
  const [bulletSpeed, setBulletSpeed] = useState(10);

  // Particle effects
  const [explosions, setExplosions] = useState([]);

  // Key tracking
  const [keys, setKeys] = useState({
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    KeyZ: false // Special weapon
  });

  // Calculate difficulty based on level
  const calculateDifficulty = (level) => {
    return {
      enemyRows: Math.min(BASE_ENEMY_ROWS + Math.floor(level / 3), 7),
      enemyCols: Math.min(BASE_ENEMY_COLS + Math.floor(level / 4), 10),
      enemySpeed: Math.min(2 + level * 0.3, 7),
      enemyFireRate: Math.max(200 - level * 10, 50), // ms between shots
      diveBomberChance: Math.min(0.001 * level, 0.02), // Chance per enemy per frame
      powerUpChance: 0.0005 * level
    };
  };

  // Initialize the game
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Get difficulty settings
      const { enemyRows, enemyCols, enemySpeed: newSpeed } = calculateDifficulty(level);
      setEnemySpeed(newSpeed);
      
      // Create enemies
      const newEnemies = [];
      for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
          newEnemies.push({
            id: `enemy-${row}-${col}`,
            x: col * (ENEMY_WIDTH + 20) + 60,
            y: row * (ENEMY_HEIGHT + 20) + 60,
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT,
            type: row % 3,
            health: 1 + Math.floor(level / 5) // Enemies get tougher at higher levels
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
          setLives(3);
          setPlayerX(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
          setBullets([]);
          setEnemyBullets([]);
          setDiveBombers([]);
          setPowerUps([]);
          setExplosions([]);
          setSpecialWeapon(false);
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
      } else if (e.key === 'z' || e.key === 'Z') {
        setKeys(prev => ({ ...prev, KeyZ: true }));
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === ' ' || e.key === 'Space') {
        setKeys(prev => ({ ...prev, Space: false }));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setKeys(prev => ({ ...prev, [e.key]: false }));
      } else if (e.key === 'z' || e.key === 'Z') {
        setKeys(prev => ({ ...prev, KeyZ: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver]);

  // Create explosion effect
  const createExplosion = (x, y, size = 1, color = '#ff4500') => {
    const particles = [];
    const particleCount = 8 + Math.floor(Math.random() * 8);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed * size,
        vy: Math.sin(angle) * speed * size,
        color,
        size: 2 + Math.random() * 3 * size,
        life: 30 + Math.random() * 20
      });
    }
    
    setExplosions(prev => [...prev, ...particles]);
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let lastShootTime = 0;
    let lastEnemyShootTime = 0;
    let specialWeaponTimer = 0;
    
    const gameLoop = setInterval(() => {
      const { enemyFireRate, diveBomberChance, powerUpChance } = calculateDifficulty(level);
      const now = Date.now();

      // Handle player movement
      if (keys.ArrowLeft) {
        setPlayerX(prev => Math.max(0, prev - 8));
      }
      if (keys.ArrowRight) {
        setPlayerX(prev => Math.min(GAME_WIDTH - PLAYER_WIDTH, prev + 8));
      }

      // Handle shooting
      if (keys.Space && now - lastShootTime > (specialWeapon ? 150 : 300)) { // Faster firing with special weapon
        if (specialWeapon) {
          // Triple shot
          setBullets(prev => [
            ...prev,
            {
              id: `bullet-${now}-1`,
              x: playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
              y: playerY - BULLET_HEIGHT,
              special: true
            },
            {
              id: `bullet-${now}-2`,
              x: playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2 - 10,
              y: playerY - BULLET_HEIGHT,
              special: true
            },
            {
              id: `bullet-${now}-3`,
              x: playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2 + 10,
              y: playerY - BULLET_HEIGHT,
              special: true
            }
          ]);
        } else {
          // Normal shot
          setBullets(prev => [
            ...prev,
            {
              id: `bullet-${now}`,
              x: playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
              y: playerY - BULLET_HEIGHT,
              special: false
            }
          ]);
        }
        lastShootTime = now;
      }

      // Special weapon key
      if (keys.KeyZ && specialWeapon) {
        // Smart bomb - clear screen
        setEnemies(prev => {
          prev.forEach(enemy => {
            createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 1.5, '#00ffff');
            setScore(score => score + 50);
          });
          return [];
        });
        setEnemyBullets([]);
        setDiveBombers([]);
        setSpecialWeapon(false);
      }

      // Enemy shooting
      if (now - lastEnemyShootTime > enemyFireRate && enemies.length > 0) {
        const shootingEnemies = enemies.filter(enemy => enemy.y > 0);
        if (shootingEnemies.length > 0) {
          const randomEnemy = shootingEnemies[Math.floor(Math.random() * shootingEnemies.length)];
          
          setEnemyBullets(prev => [
            ...prev,
            {
              id: `enemy-bullet-${now}`,
              x: randomEnemy.x + randomEnemy.width / 2 - 2,
              y: randomEnemy.y + randomEnemy.height,
              speed: 5 + level * 0.5
            }
          ]);
          
          lastEnemyShootTime = now;
        }
      }

      // Move bullets
      setBullets(prev => 
        prev
          .map(bullet => ({ ...bullet, y: bullet.y - bulletSpeed }))
          .filter(bullet => bullet.y > 0)
      );

      // Move enemy bullets
      setEnemyBullets(prev => 
        prev
          .map(bullet => ({ ...bullet, y: bullet.y + bullet.speed }))
          .filter(bullet => bullet.y < GAME_HEIGHT)
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

      // Random dive bombers
      setEnemies(prev => {
        const newEnemies = [...prev];
        
        // Check for creating dive bombers
        if (level >= 3 && newEnemies.length > 0) {
          newEnemies.forEach(enemy => {
            if (Math.random() < diveBomberChance && enemy.y < GAME_HEIGHT / 3) {
              setDiveBombers(bombs => [
                ...bombs,
                {
                  id: `bomber-${Date.now()}-${enemy.id}`,
                  x: enemy.x,
                  y: enemy.y,
                  width: enemy.width,
                  height: enemy.height,
                  type: enemy.type,
                  targetX: playerX + PLAYER_WIDTH/2,
                  speed: 5 + level * 0.5
                }
              ]);
            }
          });
        }
        
        return newEnemies;
      });

      // Move dive bombers
      setDiveBombers(prev => {
        return prev
          .map(bomber => {
            // Calculate direction vector to target
            const dx = bomber.targetX - bomber.x;
            const dy = GAME_HEIGHT - bomber.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            return {
              ...bomber,
              x: bomber.x + (dx / dist) * bomber.speed,
              y: bomber.y + (dy / dist) * bomber.speed * 0.7
            };
          })
          .filter(bomber => bomber.y < GAME_HEIGHT);
      });

      // Generate power-ups
      if (Math.random() < powerUpChance) {
        setPowerUps(prev => [
          ...prev,
          {
            id: `powerup-${Date.now()}`,
            x: Math.random() * (GAME_WIDTH - 30),
            y: -30,
            type: Math.random() < 0.3 ? 'special' : 'life',
            width: 30,
            height: 30
          }
        ]);
      }

      // Move power-ups
      setPowerUps(prev => 
        prev
          .map(powerUp => ({ ...powerUp, y: powerUp.y + 2 }))
          .filter(powerUp => powerUp.y < GAME_HEIGHT)
      );

      // Update special weapon timer
      if (specialWeapon) {
        specialWeaponTimer++;
        if (specialWeaponTimer > 400) { // ~10 seconds
          setSpecialWeapon(false);
          specialWeaponTimer = 0;
        }
      } else {
        specialWeaponTimer = 0;
      }

      // Clear moveDown flag after one frame
      if (moveDown) {
        setMoveDown(false);
      }

      // Update explosions
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

      // Check for bullet-enemy collisions
      setBullets(prevBullets => {
        let updatedBullets = [...prevBullets];
        
        for (let i = updatedBullets.length - 1; i >= 0; i--) {
          const bullet = updatedBullets[i];
          let bulletRemoved = false;
          
          // Check against regular enemies
          for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];
            
            if (
              bullet.x < enemy.x + enemy.width &&
              bullet.x + BULLET_WIDTH > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + BULLET_HEIGHT > enemy.y
            ) {
              // Reduce enemy health or remove
              const updatedEnemies = [...enemies];
              
              if (enemy.health > 1 && !bullet.special) {
                updatedEnemies[j] = { ...enemy, health: enemy.health - 1 };
                setEnemies(updatedEnemies);
                createExplosion(bullet.x, bullet.y, 0.5);
              } else {
                // Remove enemy
                updatedEnemies.splice(j, 1);
                setEnemies(updatedEnemies);
                createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                setScore(prev => prev + 100 * (level > 10 ? 2 : 1));
              }
              
              // Remove bullet unless it's special and still has penetrations left
              if (!bullet.special || Math.random() > 0.7) {
                updatedBullets.splice(i, 1);
                bulletRemoved = true;
              }
              
              break;
            }
          }
          
          // Check against dive bombers if bullet still exists
          if (!bulletRemoved) {
            for (let j = 0; j < diveBombers.length; j++) {
              const bomber = diveBombers[j];
              
              if (
                bullet.x < bomber.x + bomber.width &&
                bullet.x + BULLET_WIDTH > bomber.x &&
                bullet.y < bomber.y + bomber.height &&
                bullet.y + BULLET_HEIGHT > bomber.y
              ) {
                // Remove dive bomber
                const updatedBombers = [...diveBombers];
                updatedBombers.splice(j, 1);
                setDiveBombers(updatedBombers);
                
                createExplosion(bomber.x + bomber.width/2, bomber.y + bomber.height/2, 1.5, '#ffff00');
                setScore(prev => prev + 300);
                
                // Remove bullet
                updatedBullets.splice(i, 1);
                break;
              }
            }
          }
        }
        
        return updatedBullets;
      });

      // Check for player-enemy bullet collisions
      if (!isPlayerInvulnerable) {
        for (const bullet of enemyBullets) {
          if (
            bullet.x < playerX + PLAYER_WIDTH &&
            bullet.x + 4 > playerX &&
            bullet.y < playerY + PLAYER_HEIGHT &&
            bullet.y + 10 > playerY
          ) {
            // Player hit
            setLives(prev => prev - 1);
            setEnemyBullets(prev => prev.filter(b => b.id !== bullet.id));
            createExplosion(playerX + PLAYER_WIDTH/2, playerY + PLAYER_HEIGHT/2, 2, '#ff00ff');
            
            // Make player invulnerable briefly
            setIsPlayerInvulnerable(true);
            setTimeout(() => setIsPlayerInvulnerable(false), 2000);
            
            if (lives <= 1) {
              setGameOver(true);
              setHighScore(prev => Math.max(prev, score));
            }
            break;
          }
        }
      }

      // Check for player-dive bomber collisions
      if (!isPlayerInvulnerable) {
        for (const bomber of diveBombers) {
          if (
            bomber.x < playerX + PLAYER_WIDTH &&
            bomber.x + bomber.width > playerX &&
            bomber.y < playerY + PLAYER_HEIGHT &&
            bomber.y + bomber.height > playerY
          ) {
            // Player hit
            setLives(prev => prev - 1);
            setDiveBombers(prev => prev.filter(b => b.id !== bomber.id));
            createExplosion(playerX + PLAYER_WIDTH/2, playerY + PLAYER_HEIGHT/2, 2, '#ff00ff');
            
            // Make player invulnerable briefly
            setIsPlayerInvulnerable(true);
            setTimeout(() => setIsPlayerInvulnerable(false), 2000);
            
            if (lives <= 1) {
              setGameOver(true);
              setHighScore(prev => Math.max(prev, score));
            }
            break;
          }
        }
      }

      // Check for player-powerup collisions
      for (const powerUp of powerUps) {
        if (
          powerUp.x < playerX + PLAYER_WIDTH &&
          powerUp.x + powerUp.width > playerX &&
          powerUp.y < playerY + PLAYER_HEIGHT &&
          powerUp.y + powerUp.height > playerY
        ) {
          // Player collected powerup
          setPowerUps(prev => prev.filter(p => p.id !== powerUp.id));
          
          if (powerUp.type === 'life') {
            setLives(prev => prev + 1);
          } else if (powerUp.type === 'special') {
            setSpecialWeapon(true);
            specialWeaponTimer = 0;
          }
          
          createExplosion(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2, 1, '#00ff00');
          break;
        }
      }

      // Check if all enemies are destroyed
      if (enemies.length === 0 && diveBombers.length === 0) {
        setLevel(prev => prev + 1);
      }

      // Check if enemies reach the bottom
      const enemyReachedBottom = enemies.some(
        enemy => enemy.y + enemy.height >= playerY
      );

      if (enemyReachedBottom) {
        setGameOver(true);
        setHighScore(prev => Math.max(prev, score));
      }
    }, 33); // ~30 FPS

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, keys, playerX, playerY, bullets, enemies, enemyDirection, enemySpeed, moveDown, 
      enemyBullets, diveBombers, level, score, lives, isPlayerInvulnerable, specialWeapon, powerUps]);

  return (
    <div className="game-container">
      <div 
        className="game" 
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {!gameStarted ? (
          <div className="start-screen">
            <h1>GALACTIC INVADERS</h1>
            <p className="blinking">Press ENTER to start</p>
            <p>Use LEFT/RIGHT arrows to move, SPACE to shoot</p>
            <p>Press Z to use special weapon when available</p>
            <p>Press ESC to exit game</p>
            <div className="high-score">High Score: {highScore}</div>
          </div>
        ) : (
          <>
            <div className="top-ui">
              <div className="score-display">Score: {score}</div>
              <div className="level-display">Level: {level}</div>
              <div className="lives-display">
                {[...Array(lives)].map((_, i) => (
                  <div key={i} className="life-icon"></div>
                ))}
              </div>
              {specialWeapon && <div className="special-indicator">SPECIAL WEAPON</div>}
            </div>
            
            {/* Player Ship */}
            <div 
              className={`player ${isPlayerInvulnerable ? 'invulnerable' : ''}`}
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
                className={`bullet ${bullet.special ? 'special-bullet' : ''}`}
                style={{ 
                  left: bullet.x, 
                  top: bullet.y,
                  width: BULLET_WIDTH,
                  height: BULLET_HEIGHT
                }}
              />
            ))}
            
            {/* Enemy Bullets */}
            {enemyBullets.map((bullet) => (
              <div
                key={bullet.id}
                className="enemy-bullet"
                style={{ 
                  left: bullet.x, 
                  top: bullet.y,
                  width: 4,
                  height: 10
                }}
              />
            ))}
            
            {/* Enemies */}
            {enemies.map((enemy) => (
              <div
                key={enemy.id}
                className={`enemy enemy-type-${enemy.type} ${enemy.health > 1 ? 'tough-enemy' : ''}`}
                style={{ 
                  left: enemy.x, 
                  top: enemy.y,
                  width: enemy.width,
                  height: enemy.height
                }}
              />
            ))}
            
            {/* Dive Bombers */}
            {diveBombers.map((bomber) => (
              <div
                key={bomber.id}
                className={`enemy dive-bomber enemy-type-${bomber.type}`}
                style={{ 
                  left: bomber.x, 
                  top: bomber.y,
                  width: bomber.width,
                  height: bomber.height,
                  transform: 'rotate(45deg)'
                }}
              />
            ))}
            
            {/* Power-ups */}
            {powerUps.map((powerUp) => (
              <div
                key={powerUp.id}
                className={`power-up ${powerUp.type}-power`}
                style={{ 
                  left: powerUp.x, 
                  top: powerUp.y,
                  width: powerUp.width,
                  height: powerUp.height
                }}
              />
            ))}
            
            {/* Explosion Particles */}
            {explosions.map((particle, index) => (
              <div
                key={`particle-${index}`}
                className="particle"
                style={{ 
                  left: particle.x, 
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color
                }}
              />
            ))}
            
            {gameOver && (
              <div className="game-over">
                <h1>GAME OVER</h1>
                <p>Final Score: {score}</p>
                <p>Final Level: {level}</p>
                <p className="blinking">Press ENTER to restart</p>
                {score > highScore && <div className="new-highscore">NEW HIGH SCORE!</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
