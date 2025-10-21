import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Role } from '../types';
import { 
  GameConfig, 
  AVAILABLE_ROLES, 
  generateRecommendedConfig, 
  validateGameConfig,
  ValidationResult 
} from '../types/gameConfig';

interface GameConfigurationProps {
  playerCount: number;
  onConfigConfirmed: (config: GameConfig) => void;
  onBack: () => void;
}

export const GameConfiguration: React.FC<GameConfigurationProps> = ({ 
  playerCount, 
  onConfigConfirmed, 
  onBack 
}) => {
  const [config, setConfig] = useState<GameConfig>(() => generateRecommendedConfig(playerCount));
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [], warnings: [] });

  useEffect(() => {
    const newValidation = validateGameConfig(config);
    setValidation(newValidation);
  }, [config]);

  const updateRoleCount = (role: Role, count: number) => {
    const newConfig = {
      ...config,
      roles: {
        ...config.roles,
        [role]: Math.max(0, Math.min(count, AVAILABLE_ROLES[role].maxCount))
      }
    };

    // Recalculer les rôles activés
    newConfig.enabledRoles = Object.entries(newConfig.roles)
      .filter(([_, roleCount]) => roleCount > 0)
      .map(([roleId, _]) => roleId as Role);

    setConfig(newConfig);
  };

  const updateWerewolfCount = (count: number) => {
    const newCount = Math.max(1, Math.min(count, Math.floor(playerCount / 2)));
    setConfig(prev => ({
      ...prev,
      werewolfCount: newCount,
      roles: {
        ...prev.roles,
        WEREWOLF: newCount
      }
    }));
  };

  const resetToRecommended = () => {
    setConfig(generateRecommendedConfig(playerCount));
  };

  const availableRoles = Object.values(AVAILABLE_ROLES)
    .filter(role => playerCount >= role.minPlayers)
    .sort((a, b) => {
      // Trier par équipe puis par priorité
      if (a.team !== b.team) {
        const teamOrder = { 'WEREWOLVES': 0, 'VILLAGERS': 1, 'NEUTRAL': 2 };
        return teamOrder[a.team] - teamOrder[b.team];
      }
      return b.priority - a.priority;
    });

  const totalAssignedRoles = Object.values(config.roles).reduce((sum, count) => sum + count, 0);
  const remainingSlots = playerCount - totalAssignedRoles;

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '900px', 
      padding: '1.5rem',
      maxHeight: '85vh',
      overflowY: 'auto',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Configuration de la Partie</h2>
        <p>{playerCount} joueurs connectés</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: 'var(--secondary-color)', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span><strong>Loups-Garous:</strong></span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Button onClick={() => updateWerewolfCount(config.werewolfCount - 1)} disabled={config.werewolfCount <= 1}>
                -
              </Button>
              <span style={{ minWidth: '2rem', textAlign: 'center' }}>{config.werewolfCount}</span>
              <Button onClick={() => updateWerewolfCount(config.werewolfCount + 1)} disabled={config.werewolfCount >= Math.floor(playerCount / 2)}>
                +
              </Button>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: 0 }}>
            Recommandé : {Math.max(1, Math.floor(playerCount / 3))} pour {playerCount} joueurs
          </p>
        </div>

        {/* Option pour le Cupidon */}
        {config.roles.CUPID > 0 && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--secondary-color)', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="checkbox" 
                id="cupidCanChooseSelf"
                checked={config.cupidCanChooseSelf !== false}
                onChange={(e) => setConfig({ ...config, cupidCanChooseSelf: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <label htmlFor="cupidCanChooseSelf" style={{ cursor: 'pointer', flex: 1 }}>
                <strong>Le Cupidon peut se choisir lui-même</strong>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>
                  Si activé, le Cupidon pourra former un couple avec lui-même et un autre joueur
                </p>
              </label>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Rôles disponibles</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {availableRoles.map(roleConfig => {
            const currentCount = config.roles[roleConfig.id];
            const isEssential = roleConfig.isEssential;
            
            return (
              <div 
                key={roleConfig.id}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: isEssential ? 'var(--accent-color)' : 'var(--primary-color-light)',
                  borderRadius: '6px',
                  opacity: currentCount > 0 ? 1 : 0.6
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>{roleConfig.name}</strong>
                    {isEssential && <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>(Essentiel)</span>}
                    {roleConfig.team === 'WEREWOLVES' && <span>🐺</span>}
                    {roleConfig.team === 'VILLAGERS' && <span>🏘️</span>}
                    {roleConfig.team === 'NEUTRAL' && <span>⚖️</span>}
                  </div>
                  <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0', opacity: 0.8 }}>
                    {roleConfig.description}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Button 
                    onClick={() => updateRoleCount(roleConfig.id, currentCount - 1)} 
                    disabled={currentCount <= 0 || (isEssential && currentCount <= 1)}
                  >
                    -
                  </Button>
                  <span style={{ minWidth: '2rem', textAlign: 'center' }}>{currentCount}</span>
                  <Button 
                    onClick={() => updateRoleCount(roleConfig.id, currentCount + 1)} 
                    disabled={currentCount >= roleConfig.maxCount || remainingSlots <= 0}
                  >
                    +
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: remainingSlots === 0 ? 'var(--accent-color)' : 'var(--secondary-color)', 
          borderRadius: '8px' 
        }}>
          <p><strong>Places assignées:</strong> {totalAssignedRoles} / {playerCount}</p>
          {remainingSlots > 0 && (
            <p style={{ color: 'orange' }}>⚠️ {remainingSlots} place(s) restante(s) à assigner</p>
          )}
          {remainingSlots < 0 && (
            <p style={{ color: 'red' }}>❌ Trop de rôles assignés ({-remainingSlots} en trop)</p>
          )}
        </div>
      </div>

      {validation.errors.length > 0 && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#ff6b6b', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          color: 'white'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>❌ Erreurs de configuration:</h4>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#ffd93d', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          color: '#333'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>⚠️ Avertissements:</h4>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {validation.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <Button onClick={onBack}>
          Retour
        </Button>
        <Button onClick={resetToRecommended}>
          Configuration Recommandée
        </Button>
        <Button 
          onClick={() => onConfigConfirmed(config)} 
          disabled={!validation.isValid}
          variant="action"
        >
          Commencer la Partie
        </Button>
      </div>
    </div>
  );
};