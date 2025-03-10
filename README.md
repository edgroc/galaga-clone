# Galactic Invaders
A modern, fast-paced arcade space shooter inspired by the classic Galaga game. Built with React and Vite for optimal performance.

## Play the Game
You can play the game online at: https://edgroc.github.io/galaga-clone/
## Features

* Fast-paced arcade-style gameplay
* Multiple enemy types with unique behaviors
* Power-ups and special weapons
* Progressive difficulty levels
* Boss battles every 5 levels
* High score system
* Responsive controls optimized for keyboard input

## Controls

**LEFT/RIGHT ARROW KEYS**: Move your spaceship  
**SPACE**: Fire weapons  
**Z**: Activate special weapon (when available)  
**ESC**: Exit current game  
**ENTER**: Start game / Restart after game over  
**P**: Pause/unpause game  

## Development
This project was built with:

* React 18+
* Vite
* JavaScript (ES6+)
* CSS3

## Prerequisites

* Node.js 14+ and npm

## Installation

1. Clone the repository:
'git clone https://github.com/yourusername/galaga-clone.git
cd galaga-clone'

2. Install dependencies:
'npm install'

3. Start the development server:
'npm run dev'

4. Open http://localhost:5173 to view the game in your browser.

## Building for Production
To create a production build:
'npm run build'

The build artifacts will be stored in the dist/ directory.

## Deployment
This project can be deployed to GitHub Pages:
'npm run deploy'

## Project Structure
├── public/           # Static assets  
├── src/              # Source files  
│   ├── assets/       # Images and other assets  
│   ├── components/   # React components  
│   ├── hooks/        # Custom React hooks  
│   ├── config/       # Game configuration files  
│   ├── utils/        # Utility functions  
│   ├── App.jsx       # Main App component  
│   └── main.jsx      # Entry point  
├── index.html        # HTML template  
├── vite.config.js    # Vite configuration  
└── package.json      # Dependencies and scripts  

## Game Mechanics

Players control a spaceship at the bottom of the screen
Enemies move in formation and periodically dive-bomb toward the player
Destroying enemies earns points and occasionally drops power-ups
Each level increases in difficulty with faster enemies and new attack patterns
Boss battles feature larger enemies with more complex attack patterns and higher health

## License
This project is open source and available under the MIT License. Refer to the LICENSE file for details.

## Acknowledgments

Original Galaga game by Namco
Built with React and Vite
Created as a learning project for modern web development techniques and experimental use of Claude for source generation
