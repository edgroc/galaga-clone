# Refactored Galaga Game Project Structure

```
src/
├── App.js                # Main application entry point
├── index.js              # React entry point
├── index.css             # Global styles
├── components/           # UI Components
│   ├── Game.js           # Main game container
│   ├── GameBoard.js      # Game canvas container
│   ├── StartScreen.js    # Start screen UI
│   ├── GameOverScreen.js # Game over UI
│   ├── StatusBar.js      # Game status UI (score, lives)
│   ├── Player.js         # Player ship component
│   ├── Enemy.js          # Enemy component
│   ├── Bullet.js         # Bullet component
│   ├── PowerUp.js        # Power-up component
│   └── Explosion.js      # Explosion effect component
├── hooks/                # Custom React hooks
│   ├── useGameLoop.js    # Main game loop logic
│   ├── useGameState.js   # Game state management
│   ├── useEntityState.js # Entity management
│   ├── useInputSystem.js # Input handling
│   ├── useCollision.js   # Collision detection
│   └── useGameStorage.js # Local storage for high scores
├── systems/              # Game systems
│   ├── movementSystem.js # Entity movement logic
│   ├── collisionSystem.js# Collision detection and handling
│   ├── enemySystem.js    # Enemy behavior and spawning
│   └── effectsSystem.js  # Visual and audio effects
├── config/               # Game configuration
│   ├── gameConfig.js     # Game constants and settings
│   ├── entityConfig.js   # Entity properties
│   └── difficultyConfig.js # Level-based difficulty settings
└── utils/                # Utility functions
    ├── collision.js      # Collision detection algorithms
    ├── math.js           # Math helper functions
    └── random.js         # Random generation helpers
```

This structure separates concerns and makes the codebase more maintainable. Each component, hook, or system has a single responsibility, making it easier to debug, test, and extend.
