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
    switch (gameState.screen) {
      case 'CREATE_GAME':
        return <CreateGamePage />;
      case 'JOIN_GAME':
        return <JoinGamePage />;
      case 'LOBBY':
        return <LobbyPage />;
      case 'GAME_NARRATOR':
        return <GameNarratorPage />;
      case 'GAME_PLAYER':
        return <GamePlayerPage />;
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
      justifyContent: 'space-between', 
      alignItems: 'center', 
      minHeight: '100vh',
      width: '100%'
    }}>
      <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        {renderScreen()}
      </div>
      <footer style={{ 
        padding: '1rem', 
        fontSize: '0.85rem', 
        color: '#666',
        opacity: 0.7,
        flexShrink: 0
      }}>
        By K<span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>π</span>X
      </footer>
    </main>
  );
};
