import React from 'react';
import { Button } from '../components/Button';
import { useGame } from '../context/GameContext';

export const HomePage: React.FC = () => {
  const { setScreen } = useGame();

  return (
    <div>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
        🐺 Loup-Garou 🌙
      </h1>
      <p style={{ 
        marginBottom: '2rem', 
        maxWidth: '400px', 
        margin: '0 auto 2rem auto', 
        opacity: 0.9,
        fontSize: '1.1rem',
        fontStyle: 'italic'
      }}>
        Vivez l'expérience digitale du célèbre jeu, en présentiel.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
        <Button onClick={() => setScreen('CREATE_GAME')}>
          🎭 Créer une partie
        </Button>
        <Button onClick={() => setScreen('JOIN_GAME')}>
          🚪 Rejoindre une partie
        </Button>
      </div>
    </div>
  );
};