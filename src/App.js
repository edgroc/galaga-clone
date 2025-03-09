import React from 'react';
import Game from './components/Game';
import ErrorBoundary from './components/ErrorBoundary';
import { GameProvider } from './hooks/useGameState';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <div className="app-container">
          <Game />
        </div>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;