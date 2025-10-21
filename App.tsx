import React from 'react';
import { useGame } from './context/GameContext';
import { HomePage } from './pages/HomePage';
import { CreateGamePage } from './pages/CreateGamePage';
import { JoinGamePage } from './pages/JoinGamePage';
import { LobbyPage } from './pages/LobbyPage';
import { GameNarratorPage } from './pages/GameNarratorPage';
import { GamePlayerPage } from './pages/GamePlayerPage';

export const App: React.FC = () => {
  const { gameState } = useGame();

  const renderScreen = () => {
    // La logique de rendu s'adapte à l'état synchronisé
    if (gameState.screen === 'GAME_PLAYER') {
        if(gameState.currentPlayer?.isNarrator) {
            return <GameNarratorPage />;
        }
        return <GamePlayerPage />;
    }
      
    switch (gameState.screen) {
      case 'CREATE_GAME':
        return <CreateGamePage />;
      case 'JOIN_GAME':
        return <JoinGamePage />;
      case 'LOBBY':
        return <LobbyPage />;
      case 'HOME':
      default:
        return <HomePage />;
    }
  };

  return (
    <main style={{ 
      textAlign: 'center', 
      padding: '1rem', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      width: '100%'
    }}>
      <div style={{ width: '100%', maxWidth: '1200px', flex: 1, display: 'flex', alignItems: 'center' }}>
        {renderScreen()}
      </div>
      <footer style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        fontSize: '0.85rem', 
        color: '#666',
        opacity: 0.7
      }}>
        By K<span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>π</span>X
      </footer>
    </main>
  );
};
