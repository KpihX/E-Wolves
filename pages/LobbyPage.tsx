import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { GameConfiguration } from '../components/GameConfiguration';
import { Player } from '../types';
import { GameConfig, generateRecommendedConfig, validateGameConfig } from '../types/gameConfig';

export const LobbyPage: React.FC = () => {
  const { gameState, startGame, startGameWithConfig } = useGame();
  const { gameCode, players, currentPlayer } = gameState;
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

  const isNarrator = currentPlayer?.isNarrator || false;
  // Ne compter QUE les joueurs réels (pas le narrateur)
  const playerCount = players.filter(p => !p.isNarrator).length;
  const canStart = playerCount >= 4;

  const handleQuickStart = () => {
    // Démarrage rapide avec config recommandée
    const config = generateRecommendedConfig(playerCount);
    startGameWithConfig(config);
  };

  const handleAdvancedStart = () => {
    // Afficher la configuration avancée
    setGameConfig(generateRecommendedConfig(playerCount));
    setShowConfiguration(true);
  };

  const handleConfigConfirmed = (config: GameConfig) => {
    setGameConfig(config);
    setShowConfiguration(false);
    startGameWithConfig(config);
  };

  const handleBackFromConfig = () => {
    setShowConfiguration(false);
    setGameConfig(null);
  };

  if (showConfiguration && gameConfig) {
    return (
      <GameConfiguration 
        playerCount={playerCount}
        onConfigConfirmed={handleConfigConfirmed}
        onBack={handleBackFromConfig}
      />
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '600px', 
      background: 'var(--primary-color)', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      margin: '0 auto'
    }}>
      <h2 style={{ fontSize: '2rem' }}>🎮 Lobby de la Partie</h2>
      {gameCode && (
        <div style={{ margin: '1.5rem 0' }}>
          <p style={{marginBottom: '0.5rem', opacity: 0.8, fontSize: '1.05rem'}}>🔑 Partagez ce code avec les autres joueurs :</p>
          <strong style={{ 
            fontSize: '2rem', 
            letterSpacing: '0.3rem', 
            padding: '0.5rem 1rem', 
            background: 'var(--background-color)', 
            color: 'var(--text-color)', 
            borderRadius: '8px', 
            display: 'inline-block', 
            border: '2px solid var(--accent-color)',
            wordBreak: 'break-all'
          }}>
            {gameCode}
          </strong>
        </div>
      )}
      <h3 style={{ fontSize: '1.5rem' }}>👥 Joueurs Connectés ({players.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 1.5rem 0', minHeight: '80px' }}>
        {players.map((player: Player) => (
          <li key={player.id} style={{ padding: '0.6rem', borderBottom: '1px solid var(--secondary-color)', fontSize: '1rem' }}>
            {player.isNarrator && '🎭 '}{player.name} {player.isNarrator && '(Narrateur)'}
          </li>
        ))}
      </ul>
      {isNarrator && (
        <div>
          {canStart ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--secondary-color)', 
                borderRadius: '8px', 
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Configuration recommandée pour {playerCount} joueurs:</h4>
                {(() => {
                  const config = generateRecommendedConfig(playerCount);
                  const validation = validateGameConfig(config);
                  
                  // Afficher tous les rôles présents dans la configuration
                  const rolesList: string[] = [];
                  if (config.roles.WEREWOLF > 0) rolesList.push(`${config.roles.WEREWOLF} Loup(s)-Garou`);
                  if (config.roles.SEER > 0) rolesList.push(`${config.roles.SEER} Voyante`);
                  if (config.roles.WITCH > 0) rolesList.push(`${config.roles.WITCH} Sorcière`);
                  if (config.roles.CUPID > 0) rolesList.push(`${config.roles.CUPID} Cupidon`);
                  if (config.roles.THIEF > 0) rolesList.push(`${config.roles.THIEF} Voleur`);
                  if (config.roles.HUNTER > 0) rolesList.push(`${config.roles.HUNTER} Chasseur`);
                  if (config.roles.LITTLE_GIRL > 0) rolesList.push(`${config.roles.LITTLE_GIRL} Petite Fille`);
                  if (config.roles.VILLAGER > 0) rolesList.push(`${config.roles.VILLAGER} Villageois`);
                  
                  return (
                    <div>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                        {rolesList.join(', ')}
                      </p>
                      {validation.warnings.length > 0 && (
                        <p style={{ color: 'orange', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
                          ⚠️ {validation.warnings[0]}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
              
              <Button onClick={handleQuickStart} variant="action">
                🚀 Démarrage Rapide
              </Button>
              
              <Button onClick={handleAdvancedStart}>
                ⚙️ Configuration Avancée
              </Button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'orange', margin: '1rem 0', fontSize: '1.1rem' }}>
                ⚠️ Minimum 4 joueurs requis ({playerCount}/4)
              </p>
              <Button disabled>
                🚫 Démarrer la Partie
              </Button>
            </div>
          )}
        </div>
      )}
      {!isNarrator && (
        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginTop: '1rem' }}>
          ⏳ En attente du narrateur pour commencer la partie...
        </p>
      )}
    </div>
  );
};