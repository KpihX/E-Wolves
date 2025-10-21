import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useGame } from '../context/GameContext';

export const CreateGamePage: React.FC = () => {
    const [name, setName] = useState('');
    const { createGame, setScreen, isLoading } = useGame();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            createGame(name);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '400px', padding: '1rem', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem' }}>🎭 Créer une Partie</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                <Input 
                    type="text" 
                    placeholder="👤 Votre Nom (Narrateur)" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={15}
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? '⏳ Création...' : '✨ Créer le Lobby'}
                </Button>
                <Button type="button" onClick={() => setScreen('HOME')} disabled={isLoading}>
                    ⬅️ Retour
                </Button>
            </form>
        </div>
    );
};
