/**
 * Game configuration constants
 * Centralizes all game parameters for easy tuning
 */
const CONFIG = {
  game: {
    width: 600,
    height: 800,
    fps: 60, // Target frames per second
    tickRate: 16, // ms between game loop iterations (approx 60 FPS)
    initialLives: 3
  },
  player: {
    width: 40,
    height: 40,
    speed: 8,
    shootInterval: 300, // ms between shots
    invulnerabilityTime: 2000, // ms of invulnerability after hit
    specialWeaponDuration: 10000 // ms that special weapon lasts
  },
  bullets: {
    playerBullet: {
      width: 4,
      height: 15,
      speed: 10,
      color: '#ff0'
    },
    enemyBullet: {
      width: 4,
      height: 10,
      baseSpeed: 5,
      color: '#f00'
    },
    specialBullet: {
      width: 6,
      height: 15,
      speed: 12,
      color: '#f0f',
      penetration: 0.7 // Chance to penetrate enemies
    }
  },
  enemies: {
    baseRows: 4,
    baseCols: 8,
    width: 40,
    height: 40,
    baseSpeed: 2,
    baseHealth: 1,
    diveBomber: {
      speed: 5,
      points: 300
    },
    points: {
      basic: 100,
      bonus: 2 // Multiplier after level 10
    }
  },
  powerUps: {
    width: 30,
    height: 30,
    speed: 2,
    types: {
      life: {
        color: '#ff0',
        probability: 0.3 // 30% chance to be a life powerup
      },
      special: {
        color: '#f0f',
        probability: 0.7 // 70% chance to be a special weapon
      }
    }
  },
  particles: {
    count: {
      small: 8,
      medium: 15,
      large: 25
    },
    duration: {
      short: 20,
      medium: 40,
      long: 60
    }
  }
};

// Difficulty scaling functions
export const DIFFICULTY = {
  // Enemy speed increases with level, capped at max value
  enemySpeed: (level) => Math.min(CONFIG.enemies.baseSpeed + level * 0.3, 7),

  // Enemy health increases every few levels
  enemyHealth: (level) => 1 + Math.floor(level / 5),

  // Number of enemy rows and columns increases with level
  enemyCount: (level) => ({
    rows: Math.min(CONFIG.enemies.baseRows + Math.floor(level / 3), 7),
    cols: Math.min(CONFIG.enemies.baseCols + Math.floor(level / 4), 10)
  }),

  // Enemy fire rate decreases (fires more frequently) with level
  enemyFireRate: (level) => Math.max(200 - level * 10, 50),

  // Chance for enemies to dive bomb increases with level
  diveBomberChance: (level) => Math.min(0.001 * level, 0.02),

  // Chance for power-ups to spawn increases with level
  powerUpChance: (level) => 0.0005 * level
};

export default CONFIG;
