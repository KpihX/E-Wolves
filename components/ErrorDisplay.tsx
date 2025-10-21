import React from 'react';
import { ErrorState } from '../hooks/useErrorHandler';
import { Button } from './Button';

interface ErrorDisplayProps {
  errors: ErrorState[];
  onRemoveError: (timestamp: number) => void;
  onClearAll: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  errors, 
  onRemoveError, 
  onClearAll 
}) => {
  if (errors.length === 0) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: '1rem', 
      right: '1rem', 
      zIndex: 1000,
      maxWidth: '400px'
    }}>
      {errors.map((error) => (
        <div
          key={error.timestamp}
          style={{
            backgroundColor: error.type === 'error' ? '#ff6b6b' : 
                           error.type === 'warning' ? '#ffd93d' : '#74c0fc',
            color: error.type === 'warning' ? '#333' : 'white',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
              {error.type === 'error' ? '❌ Erreur' : 
               error.type === 'warning' ? '⚠️ Avertissement' : 'ℹ️ Information'}
            </div>
            <div style={{ fontSize: '0.9rem' }}>{error.message}</div>
          </div>
          <button
            onClick={() => onRemoveError(error.timestamp)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
      ))}
      
      {errors.length > 1 && (
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <Button onClick={onClearAll} variant="secondary">
            Effacer Tout
          </Button>
        </div>
      )}
    </div>
  );
};