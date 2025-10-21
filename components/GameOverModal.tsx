// FIX: Removed invalid file markers causing parsing errors.
import React from 'react';
import { useGame } from '../context/GameContext';
import { Winner } from '../types';
import { Button } from './Button';

interface GameOverModalProps {
  winner: Winner;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ winner }) => {
  const { resetGame, gameState } = useGame();

  const getWinnerText = () => {
    if (winner === 'VILLAGERS') {
      return {
        title: '🎉 Victoire des Villageois ! 🎉',
        message: 'Tous les Loups-Garous ont été éliminés. Le village est de nouveau en paix.',
        emoji: '🏞️'
      };
    }
    if (winner === 'WEREWOLVES') {
      return {
        title: '🌙 Victoire des Loups-Garous ! 🌙',
        message: 'Les Loups-Garous ont dévoré tous les villageois. La nuit est à eux.',
        emoji: '🐺'
      };
    }
    if (winner === 'LOVERS') {
        return {
          title: '💖 Victoire des Amoureux ! 💖',
          message: "Seuls contre tous, leur amour a triomphé. Ils peuvent maintenant vivre en paix.",
          emoji: '💕'
        };
    }
    return { title: '🏁 Partie Terminée', message: '', emoji: '🏁' };
  };

  const { title, message, emoji } = getWinnerText();
  const winReason = gameState.winReason || message || "La partie est terminée."; // Utiliser winReason si disponible, sinon message par défaut, sinon fallback générique

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: 'var(--primary-color)',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>{emoji}</h1>
      <h2 style={{ color: 'var(--accent-color)', fontSize: '2rem' }}>{title}</h2>
      <p style={{ margin: '1rem 0 1.5rem 0', opacity: 0.9, fontSize: '1.1rem', lineHeight: '1.6' }}>
        {winReason}
      </p>
      <Button onClick={resetGame}>
        🏠 Retourner à l'accueil
      </Button>
    </div>
  );
};
