// FIX: Implemented the GamePlayerPage component to display player-specific UI and handle actions.
import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { RoleCard } from '../components/RoleCard';
import { GameOverModal } from '../components/GameOverModal';
import { Player, Role } from '../types';
import { AVAILABLE_ROLES, PHASE_NAMES } from '../types/gameConfig';

export const GamePlayerPage: React.FC = () => {
    const { 
        gameState, 
        submitNightAction, 
        submitVote,
        submitMayorVote,
        submitWitchAction,
        submitCupidSelection,
        submitThiefChoice,
        isLoading 
    } = useGame();
    
    const { 
        players, 
        currentPlayer, 
        phase, 
        narratorMessage, 
        winner, 
        votes,
        mayorVotes,
        werewolfVictimId,
        witchPotions,
        lovers,
        mayorId
    } = gameState;

    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [witchKillMode, setWitchKillMode] = useState(false);

    // Reset local UI state when phase changes
    useEffect(() => {
        setSelectedPlayerId(null);
        setSelectedPlayerIds([]);
        setSelectedRole(null);
        setWitchKillMode(false);
    }, [phase]);

    // Memoized lists for performance
    const livingPlayers = useMemo(() => players.filter(p => p.isAlive && !p.isNarrator), [players]);
    const otherLivingPlayers = useMemo(() => livingPlayers.filter(p => p.id !== currentPlayer?.id), [livingPlayers, currentPlayer]);

    const partner = useMemo(() => {
        if (!lovers || !currentPlayer) return null;
        const partnerId = lovers[0] === currentPlayer.id ? lovers[1] : (lovers[1] === currentPlayer.id ? lovers[0] : null);
        if (!partnerId) return null;
        return players.find(p => p.id === partnerId);
    }, [lovers, currentPlayer, players]);

    if (winner) {
        return <GameOverModal winner={winner} />;
    }

    if (!currentPlayer || !currentPlayer.role) {
        return (
            <div>
                <h2>En attente...</h2>
                <p>{narratorMessage}</p>
                {currentPlayer && !currentPlayer.role && <p>Distribution des rôles en cours...</p>}
            </div>
        );
    }

    // Si le joueur est mort, afficher un écran spécial
    if (!currentPlayer.isAlive) {
        const roleName = AVAILABLE_ROLES[currentPlayer.role]?.name || currentPlayer.role;
        const isInCouple = lovers?.includes(currentPlayer.id);
        
        return (
            <div style={{ width: '100%', maxWidth: '500px', background: 'var(--primary-color)', padding: '2rem', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', textAlign: 'center', margin: '0 auto' }}>
                <h2 style={{ color: '#ff4444' }}>💀 Vous êtes mort 💀</h2>
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                        <strong>{currentPlayer.name}</strong>
                    </p>
                    <p style={{ fontSize: '1rem', opacity: 0.9 }}>
                        Vous étiez <strong>{roleName}</strong>
                        {currentPlayer.id === mayorId && ' 👑 (Maire)'}
                        {isInCouple && ' ❤️ (En couple)'}
                    </p>
                </div>
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.95rem', opacity: 0.8, margin: 0 }}>
                        👻 Vous ne pouvez plus participer à la partie.
                    </p>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem', marginBottom: 0 }}>
                        Observez la suite en silence et ne révélez rien aux joueurs vivants !
                    </p>
                </div>
                <div style={{ marginTop: '2rem', fontSize: '0.85rem', opacity: 0.6 }}>
                    Phase actuelle : {PHASE_NAMES[phase] || phase}
                </div>
            </div>
        );
    }
    
    const handleSingleSelection = (playerId: string) => {
        setSelectedPlayerId(prev => prev === playerId ? null : playerId);
    };

    const handleMultiSelection = (playerId: string) => {
        setSelectedPlayerIds(prev => {
            if (prev.includes(playerId)) {
                return prev.filter(id => id !== playerId);
            }
            if (prev.length < 2) {
                return [...prev, playerId];
            }
            return prev;
        });
    };
    
    const renderPlayerListForSelection = (
        playersToList: Player[], 
        onSelect: (id: string) => void,
        selection: string | string[] | null,
        disabledCondition: (player: Player) => boolean = () => false
    ) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            {playersToList.map(p => (
                <Button 
                    key={p.id}
                    onClick={() => onSelect(p.id)}
                    variant={(Array.isArray(selection) ? selection.includes(p.id) : selection === p.id) ? 'action' : 'default'}
                    disabled={isLoading || disabledCondition(p)}
                >
                    {p.name}
                </Button>
            ))}
        </div>
    );
    
    const renderPhaseContent = () => {
        switch (phase) {
            case 'THIEF_TURN':
                // Le voleur n'a pas d'interface - c'est le narrateur qui gère
                if (currentPlayer.role === 'THIEF') {
                    return (
                        <div>
                            <h4>🌙 Tour du Voleur</h4>
                            <p style={{fontStyle: 'italic', opacity: 0.8}}>
                                Levez-vous discrètement et désignez physiquement au narrateur le joueur dont vous souhaitez voler le rôle.
                            </p>
                            <p style={{fontSize: '0.9rem', marginTop: '1rem'}}>
                                Le narrateur enregistrera votre choix. La victime deviendra un simple villageois.
                            </p>
                        </div>
                    );
                }
                break;
            
            case 'CUPID_TURN':
                if (currentPlayer.role === 'CUPID') {
                    // Si les amoureux ont déjà été choisis, Cupidon se rendort
                    if (lovers && lovers.length === 2) {
                        return (
                            <div style={{ background: 'var(--primary-color-light)', padding: '1rem', borderRadius: '8px' }}>
                                <h4 style={{marginTop: 0}}>💘 Cupidon</h4>
                                <p style={{fontStyle: 'italic', opacity: 0.8}}>
                                    Votre travail est fait. Les amoureux ont été unis. Rendormez-vous et attendez le réveil du village.
                                </p>
                            </div>
                        );
                    }
                    
                    return (
                        <div>
                            <h4>💘 C'est votre tour !</h4>
                            <p>Levez-vous discrètement et désignez physiquement au narrateur deux joueurs à rendre amoureux.</p>
                            <p style={{fontStyle: 'italic', marginTop: '1rem'}}>Le narrateur enregistrera votre choix et révélera discrètement leur lien aux amoureux.</p>
                        </div>
                    );
                }
                break;

            case 'SEER_TURN':
                if (currentPlayer.role === 'SEER') {
                    return (
                        <div>
                            <h4>C'est votre tour !</h4>
                            <p>Levez-vous discrètement et désignez physiquement au narrateur le joueur dont vous souhaitez connaître le rôle.</p>
                            <p style={{fontStyle: 'italic', marginTop: '1rem'}}>Le narrateur vous montrera ensuite le résultat sur son téléphone.</p>
                        </div>
                    );
                }
                break;

            case 'WEREWOLVES_TURN':
                if (currentPlayer.role === 'WEREWOLF') {
                    return (
                        <div>
                            <h4>C'est votre tour !</h4>
                            <p>Concertez-vous avec les autres loups-garous et désignez physiquement au narrateur votre victime.</p>
                            <p style={{fontStyle: 'italic', marginTop: '1rem'}}>Faites un choix commun et désignez-le au narrateur.</p>
                        </div>
                    );
                }
                break;

            case 'WITCH_TURN':
                if (currentPlayer.role === 'WITCH') {
                    return (
                        <div>
                            <h4>🧪 C'est votre tour !</h4>
                            <p>Levez-vous discrètement. Le narrateur va vous révéler secrètement ce qui s'est passé cette nuit.</p>
                            <div style={{marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px'}}>
                                <p style={{margin: 0, fontWeight: 'bold'}}>📋 Indiquez vos choix par gestes :</p>
                                <ul style={{marginTop: '0.5rem', marginBottom: 0}}>
                                    <li><strong>👍 Pouce vers le HAUT</strong> : Utiliser la potion de vie (ressusciter)</li>
                                    <li><strong>👎 Pouce vers le BAS</strong> : Utiliser la potion de mort (puis désigner la cible du doigt)</li>
                                    <li><strong>👈 Pouce sur le CÔTÉ</strong> : Ne rien faire cette nuit</li>
                                </ul>
                                <p style={{marginTop: '0.75rem', fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.8, marginBottom: 0}}>
                                    ⚠️ Tout se fait en silence. Utilisez uniquement les gestes.
                                </p>
                            </div>
                            <p style={{marginTop: '1rem', fontSize: '0.85rem', opacity: 0.8}}>
                                ℹ️ Chaque potion ne peut être utilisée qu'une seule fois par partie.
                            </p>
                        </div>
                    );
                }
                break;

            case 'MAYOR_ELECTION':
            case 'DAY_VOTE':
                const isMayorVote = phase === 'MAYOR_ELECTION';
                const currentVotes = isMayorVote ? mayorVotes : votes;
                const hasVoted = currentVotes[currentPlayer.id];
                const votedForPlayer = players.find(p => p.id === hasVoted);

                if (hasVoted) {
                    return <p>Vous avez voté pour <strong>{votedForPlayer?.name || 'quelqu\'un'}</strong>.</p>
                }

                return (
                    <div>
                        <h4>{isMayorVote ? 'Élection du Maire' : 'Vote du Village'}</h4>
                        <p>{isMayorVote ? 'Votez pour le premier maire du village.' : 'Qui souhaitez-vous éliminer ?'}</p>
                        {renderPlayerListForSelection(livingPlayers, handleSingleSelection, selectedPlayerId, p => (!isMayorVote && p.id === currentPlayer.id))}
                        <Button 
                            onClick={() => isMayorVote ? submitMayorVote(currentPlayer.id, selectedPlayerId!) : submitVote(currentPlayer.id, selectedPlayerId!)} 
                            disabled={isLoading || !selectedPlayerId}
                            style={{marginTop: '1.5rem'}}
                        >
                            Confirmer le Vote
                        </Button>
                    </div>
                );
            default:
                // Messages spécialisés pour les phases nocturnes
                if (phase === 'SEER_TURN' && currentPlayer.role !== 'SEER') {
                    return (
                        <div style={{ background: 'var(--primary-color-light)', padding: '1rem', borderRadius: '8px' }}>
                            <h4 style={{marginTop: 0}}>Tour de la Voyante</h4>
                            <p style={{fontStyle: 'italic', opacity: 0.8, margin: 0}}>
                                Fermez les yeux et attendez. La voyante effectue son action.
                            </p>
                        </div>
                    );
                }
                
                if (phase === 'WEREWOLVES_TURN' && currentPlayer.role !== 'WEREWOLF') {
                    return (
                        <div style={{ background: 'var(--primary-color-light)', padding: '1rem', borderRadius: '8px' }}>
                            <h4 style={{marginTop: 0}}>Tour des Loups-Garous</h4>
                            <p style={{fontStyle: 'italic', opacity: 0.8, margin: 0}}>
                                Fermez les yeux et attendez. Les loups-garous choisissent leur victime.
                            </p>
                        </div>
                    );
                }
                
                if (phase === 'WITCH_TURN' && currentPlayer.role !== 'WITCH') {
                    return (
                        <div style={{ background: 'var(--primary-color-light)', padding: '1rem', borderRadius: '8px' }}>
                            <h4 style={{marginTop: 0}}>Tour de la Sorcière</h4>
                            <p style={{fontStyle: 'italic', opacity: 0.8, margin: 0}}>
                                Fermez les yeux et attendez. La sorcière décide d'utiliser ses potions.
                            </p>
                        </div>
                    );
                }
                
                if (phase === 'CUPID_TURN' && currentPlayer.role !== 'CUPID') {
                    return (
                        <div style={{ background: 'var(--primary-color-light)', padding: '1rem', borderRadius: '8px' }}>
                            <h4 style={{marginTop: 0}}>Tour de Cupidon</h4>
                            <p style={{fontStyle: 'italic', opacity: 0.8, margin: 0}}>
                                Fermez les yeux et attendez. Cupidon désigne les amoureux.
                            </p>
                        </div>
                    );
                }
                
                // Pour les autres phases, afficher un message générique adapté au joueur
                if (phase === 'NIGHT') {
                    return (
                        <div style={{ background: 'var(--primary-color-light)', padding: '1rem', borderRadius: '8px' }}>
                            <h4 style={{marginTop: 0}}>🌙 Nuit</h4>
                            <p style={{fontStyle: 'italic', opacity: 0.8, margin: 0}}>Le village dort. Attendez les instructions du narrateur.</p>
                        </div>
                    );
                }
                
                return (
                    <div style={{ background: 'var(--primary-color-light)', padding: '1rem', borderRadius: '8px' }}>
                        <h4 style={{marginTop: 0}}>{PHASE_NAMES[phase] || phase}</h4>
                        <p style={{fontStyle: 'italic', opacity: 0.8, margin: 0}}>Attendez les instructions du narrateur.</p>
                    </div>
                );
        }
        // Message par défaut pour les rôles non actifs
        return <p style={{fontStyle: 'italic', opacity: 0.8}}>Attendez les instructions du narrateur.</p>;
    };

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <RoleCard 
                    role={currentPlayer.role} 
                    isMayor={currentPlayer.id === mayorId}
                    partnerName={partner?.name}
                    isStolen={currentPlayer.isStolen}
                />
            </div>
            
            <div style={{ minHeight: '150px' }}>
                {renderPhaseContent()}
            </div>
        </div>
    );
};
