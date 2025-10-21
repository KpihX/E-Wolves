import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useGame } from '../context/GameContext';

export const JoinGamePage: React.FC = () => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const { joinGame, setScreen, isLoading } = useGame();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && code.trim()) {
            joinGame(name, code);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '400px', padding: '1rem', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem' }}>🚪 Rejoindre une Partie</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                <Input 
                    type="text" 
                    placeholder="👤 Votre Nom" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={15}
                    disabled={isLoading}
                />
                <Input 
                    type="text" 
                    placeholder="🔑 Code de la Partie" 
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                    maxLength={5}
                    style={{textTransform: 'uppercase'}}
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? '⏳ Connexion...' : '🎮 Rejoindre'}
                </Button>
                <Button type="button" onClick={() => setScreen('HOME')} disabled={isLoading}>
                    ⬅️ Retour
                </Button>
            </form>
        </div>
    );
};
