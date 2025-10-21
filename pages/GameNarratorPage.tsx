// FIX: Implemented the GameNarratorPage component.
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { GameOverModal } from '../components/GameOverModal';
import { PHASE_NAMES, PHASE_INSTRUCTIONS, AVAILABLE_ROLES } from '../types/gameConfig';

export const GameNarratorPage: React.FC = () => {
    const { gameState, advancePhase, submitNightAction, submitWitchAction, submitCupidSelection, submitThiefChoice, undoLastAction, isLoading } = useGame();
    const { players, phase, narratorMessage, winner, votes, mayorVotes, seerChoice, seerSeenPlayers, werewolfChoice, lovers, hunterWhoDiedId, mayorId, werewolfVictimId, witchPotions, witchActionCompleted, thiefPlayerId, thiefStolenFromId, history } = gameState;
    const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
    const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

    if (winner) {
        return <GameOverModal winner={winner} />;
    }

    const livingPlayers = players.filter(p => p.isAlive && !p.isNarrator);
    const deadPlayers = players.filter(p => !p.isAlive);

    const handleAdvancePhase = () => {
        let payload = {};
        if (phase === 'HUNTER_REVENGE' && selectedTarget) {
            payload = { hunterTargetId: selectedTarget };
        }
        if (phase === 'MAYOR_SUCCESSION' && selectedTarget) {
            payload = { successorId: selectedTarget };
        }
        if (phase === 'MAYOR_TIE_BREAKER' && selectedTarget) {
            payload = { mayorId: selectedTarget };
        }
        advancePhase(payload);
        setSelectedTarget(null);
        setSelectedPlayerIds([]);
    };

    const handleNarratorAction = () => {
        const gameCode = gameState.gameCode;
        if (!gameCode) return;

        switch (phase) {
            case 'THIEF_TURN':
                if (selectedTarget) {
                    submitThiefChoice(selectedTarget);
                    setSelectedTarget(null);
                }
                break;

            case 'SEER_TURN':
                if (selectedTarget) {
                    submitNightAction('NARRATOR_SEER', selectedTarget);
                    setSelectedTarget(null);
                }
                break;
                
            case 'WEREWOLVES_TURN':
                if (selectedTarget) {
                    submitNightAction('NARRATOR_WEREWOLVES', selectedTarget);
                    setSelectedTarget(null);
                }
                break;
                
            case 'WITCH_TURN':
                if (selectedTarget) {
                    if (selectedTarget === 'HEAL') {
                        submitWitchAction({ actionType: 'HEAL' });
                    } else if (selectedTarget === 'NOTHING') {
                        submitWitchAction({ actionType: 'NONE' });
                    } else if (selectedTarget.startsWith('KILL_')) {
                        const targetId = selectedTarget.replace('KILL_', '');
                        submitWitchAction({ actionType: 'KILL', targetId });
                    }
                    setSelectedTarget(null);
                }
                break;
                
            case 'CUPID_TURN':
                if (selectedPlayerIds.length === 2) {
                    submitCupidSelection(selectedPlayerIds[0], selectedPlayerIds[1]);
                    setSelectedPlayerIds([]);
                }
                break;
        }
    };

    const renderPhaseSpecifics = () => {
        switch (phase) {
            case 'MAYOR_TIE_BREAKER':
                const tieCandidates = gameState.mayorTieCandidates || [];
                return (
                    <div>
                        <h4>🤝 Départage pour l'élection du maire</h4>
                        <p>Égalité détectée ! Organisez un <strong>Pierre-Feuille-Ciseaux</strong> entre les candidats à égalité.</p>
                        <p style={{fontSize: '0.9rem', opacity: 0.8}}>Une fois le gagnant déterminé hors plateforme, sélectionnez-le ci-dessous :</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                            {tieCandidates.map(candidateId => {
                                const candidate = players.find(p => p.id === candidateId);
                                return (
                                    <Button
                                        key={candidateId}
                                        onClick={() => setSelectedTarget(candidateId)}
                                        variant={selectedTarget === candidateId ? 'action' : 'default'}
                                    >
                                        {candidate?.name}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'MAYOR_SUCCESSION':
                return (
                    <div>
                        <h4>👑 Succession du maire</h4>
                        <p>Sélectionnez le joueur désigné par le maire décédé.</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                            {livingPlayers.map(p => (
                                <Button
                                    key={p.id}
                                    onClick={() => setSelectedTarget(p.id)}
                                    variant={selectedTarget === p.id ? 'action' : 'default'}
                                >
                                    {p.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                );
            case 'HUNTER_REVENGE':
                 const hunter = players.find(p => p.id === hunterWhoDiedId);
                 return (
                    <div>
                        <h4>🏹 Dernière vengeance du chasseur ({hunter?.name})</h4>
                        <p>Il doit emporter quelqu'un dans la tombe. Sélectionnez sa cible.</p>
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                            {livingPlayers.map(p => (
                                 <Button
                                    key={p.id}
                                    onClick={() => setSelectedTarget(p.id)}
                                    variant={selectedTarget === p.id ? 'action' : 'default'}
                                 >
                                    {p.name}
                                 </Button>
                            ))}
                        </div>
                    </div>
                );
            case 'DAY_VOTE':
            case 'MAYOR_ELECTION':
                const currentVotes = phase === 'DAY_VOTE' ? votes : mayorVotes;
                const voteCounts: Record<string, number> = {};
                Object.values(currentVotes).forEach(targetId => {
                    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
                });
                const totalVotes = Object.keys(currentVotes).length;
                const expectedVotes = livingPlayers.length;

                return (
                    <div>
                        <h4>Votes en cours... ({totalVotes} / {expectedVotes})</h4>
                        <ul style={{listStyle: 'none', padding: 0, textAlign: 'left', maxWidth: '300px', margin: '1rem auto'}}>
                           {players.filter(p => p.isAlive).map(p => {
                                const voterIds = Object.keys(currentVotes).filter(voterId => currentVotes[voterId] === p.id);
                                const voters = players.filter(pl => voterIds.includes(pl.id)).map(pl => pl.name).join(', ');
                                if (!voteCounts[p.id]) return null;
                                return (
                                    <li key={p.id} style={{padding: '0.25rem 0'}}>
                                        <strong>{p.name}:</strong> {voteCounts[p.id] || 0} vote(s) 
                                        {voters && <span style={{opacity: 0.7}}> (par {voters})</span>}
                                    </li>
                                )
                           })}
                        </ul>
                    </div>
                );
            case 'SEER_TURN':
                const seer = livingPlayers.find(p => p.role === 'SEER');
                const seerTarget = players.find(p => p.id === seerChoice);
                
                // Filtrer les joueurs que la voyante n'a pas encore vus (vivants, non voyante, non déjà vus)
                const unseenPlayers = livingPlayers.filter(p => 
                    p.role !== 'SEER' && !seerSeenPlayers.includes(p.id)
                );
                
                // Si tous les joueurs ont été vus, passer automatiquement le tour
                if (unseenPlayers.length === 0 && !seerTarget) {
                    return (
                        <div>
                            <h4>🔮 La Voyante consulte ({seer?.name})</h4>
                            <p style={{fontStyle: 'italic', color: 'var(--accent-color)'}}>
                                ✅ La voyante a déjà vu tous les joueurs vivants !
                            </p>
                            <p style={{fontSize: '0.9rem', opacity: 0.8}}>
                                Son tour est automatiquement passé.
                            </p>
                        </div>
                    );
                }
                
                if (seerTarget) {
                    const targetRoleName = AVAILABLE_ROLES[seerTarget.role!]?.name || seerTarget.role;
                    return (
                        <div>
                            <h4>🔮 Vision révélée</h4>
                            <div style={{ 
                                background: 'var(--secondary-color)', 
                                padding: '2rem', 
                                borderRadius: '12px', 
                                margin: '1.5rem 0',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                border: '4px solid var(--accent-color)',
                                boxShadow: '0 0 20px rgba(233, 69, 96, 0.5)',
                                animation: 'pulse 2s ease-in-out infinite'
                            }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>👁️</div>
                                <div><strong>{seerTarget.name}</strong> est</div>
                                <div style={{ color: 'var(--accent-color)', fontSize: '2rem', marginTop: '0.5rem' }}>
                                    <strong>{targetRoleName}</strong>
                                </div>
                            </div>
                            <p style={{
                                fontStyle: 'italic', 
                                fontSize: '1.1rem', 
                                padding: '1rem', 
                                background: 'rgba(233, 69, 96, 0.2)', 
                                borderRadius: '8px',
                                border: '2px solid var(--accent-color)'
                            }}>
                                ⚠️ <strong>Montrez cet écran à {seer?.name}</strong> puis cliquez sur "Phase Suivante"
                            </p>
                        </div>
                    );
                }
                
                return (
                    <div>
                        <h4>🔮 La Voyante consulte ({seer?.name})</h4>
                        <p>{PHASE_INSTRUCTIONS['SEER_TURN']}</p>
                        {seerSeenPlayers.length > 0 && (
                            <p style={{fontSize: '0.9rem', opacity: 0.8, fontStyle: 'italic'}}>
                                ℹ️ Joueurs déjà vus : {seerSeenPlayers.length}
                            </p>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                            {unseenPlayers.map(p => (
                                <Button
                                    key={p.id}
                                    onClick={() => setSelectedTarget(p.id)}
                                    variant={selectedTarget === p.id ? 'action' : 'default'}
                                >
                                    {p.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                );
                
            case 'WEREWOLVES_TURN':
                const werewolves = livingPlayers.filter(p => p.role === 'WEREWOLF');
                const wolfTarget = players.find(p => p.id === werewolfChoice);
                
                if (wolfTarget) {
                    return (
                        <div>
                            <h4>🐺 La meute a choisi</h4>
                            <p>Les loups-garous ont choisi de dévorer <strong>{wolfTarget.name}</strong>.</p>
                        </div>
                    );
                }
                
                return (
                    <div>
                        <h4>🐺 Les Loups-Garous se réveillent ({werewolves.map(w => w.name).join(', ')})</h4>
                        <p>{PHASE_INSTRUCTIONS['WEREWOLVES_TURN']}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                            {livingPlayers.filter(p => p.role !== 'WEREWOLF').map(p => (
                                <Button
                                    key={p.id}
                                    onClick={() => setSelectedTarget(p.id)}
                                    variant={selectedTarget === p.id ? 'action' : 'default'}
                                >
                                    {p.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                );

            case 'WITCH_TURN':
                const witch = livingPlayers.find(p => p.role === 'WITCH');
                const witchVictim = players.find(p => p.id === werewolfVictimId);
                const canHeal = witchPotions?.heal !== false;
                const canKill = witchPotions?.kill !== false;
                
                return (
                    <div>
                        <h4>🧪 La Sorcière prépare ses potions ({witch?.name})</h4>
                        
                        <div style={{ padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
                            <p style={{margin: 0, fontWeight: 'bold'}}>📋 La sorcière indique son choix par geste :</p>
                            <ul style={{marginTop: '0.5rem', marginBottom: 0}}>
                                <li><strong>👍 Pouce HAUT</strong> : Utiliser la potion de vie {!canHeal && '(❌ déjà utilisée)'}</li>
                                <li><strong>👎 Pouce BAS</strong> : Utiliser la potion de mort {!canKill && '(❌ déjà utilisée)'}</li>
                                <li><strong>👈 Pouce CÔTÉ</strong> : Ne rien faire</li>
                            </ul>
                        </div>
                        
                        {witchVictim ? (
                            <div>
                                <p>📢 Révélez à {witch?.name} que <strong>{witchVictim.name}</strong> va mourir cette nuit.</p>
                                <p style={{fontSize: '0.9rem', opacity: 0.8}}>{PHASE_INSTRUCTIONS['WITCH_TURN']}</p>
                                
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '1rem 0' }}>
                                    <Button 
                                        onClick={() => setSelectedTarget('HEAL')} 
                                        variant={selectedTarget === 'HEAL' ? 'action' : 'default'}
                                        disabled={!canHeal}
                                    >
                                        👍 Potion de Vie {!canHeal && '(Utilisée)'}
                                    </Button>
                                    <Button 
                                        onClick={() => setSelectedTarget('KILL')} 
                                        variant={selectedTarget === 'KILL' ? 'action' : 'default'}
                                        disabled={!canKill}
                                    >
                                        👎 Potion de Mort {!canKill && '(Utilisée)'}
                                    </Button>
                                    <Button 
                                        onClick={() => setSelectedTarget('NOTHING')} 
                                        variant={selectedTarget === 'NOTHING' ? 'action' : 'default'}
                                    >
                                        👈 Ne rien faire
                                    </Button>
                                </div>
                                
                                {selectedTarget === 'KILL' && canKill && (
                                    <div>
                                        <p><strong>👉 {witch?.name} désigne sa cible du doigt :</strong></p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                                            {livingPlayers.filter(p => p.role !== 'WITCH').map(p => (
                                                <Button
                                                    key={p.id}
                                                    onClick={() => setSelectedTarget(`KILL_${p.id}`)}
                                                    variant={selectedTarget === `KILL_${p.id}` ? 'action' : 'default'}
                                                >
                                                    {p.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <p>✅ Aucune victime cette nuit.</p>
                                <p>Demandez à {witch?.name} si elle souhaite utiliser sa potion de mort.</p>
                                
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '1rem 0' }}>
                                    <Button 
                                        onClick={() => setSelectedTarget('KILL')} 
                                        variant={selectedTarget === 'KILL' ? 'action' : 'default'}
                                        disabled={!canKill}
                                    >
                                        👎 Potion de Mort {!canKill && '(Utilisée)'}
                                    </Button>
                                    <Button 
                                        onClick={() => setSelectedTarget('NOTHING')} 
                                        variant={selectedTarget === 'NOTHING' ? 'action' : 'default'}
                                    >
                                        👈 Ne rien faire
                                    </Button>
                                </div>
                                
                                {selectedTarget === 'KILL' && canKill && (
                                    <div>
                                        <p><strong>👉 {witch?.name} désigne sa cible du doigt :</strong></p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                                            {livingPlayers.filter(p => p.role !== 'WITCH').map(p => (
                                                <Button
                                                    key={p.id}
                                                    onClick={() => setSelectedTarget(`KILL_${p.id}`)}
                                                    variant={selectedTarget === `KILL_${p.id}` ? 'action' : 'default'}
                                                >
                                                    {p.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <p style={{marginTop: '1rem', fontSize: '0.85rem', opacity: 0.8}}>
                            ℹ️ Potions restantes : Vie {canHeal ? '✅' : '❌'} | Mort {canKill ? '✅' : '❌'}
                        </p>
                    </div>
                );


            case 'THIEF_TURN': {
                const thief = livingPlayers.find(p => p.role === 'THIEF');
                const nonThiefPlayers = livingPlayers.filter(p => p.role !== 'THIEF');
                
                // Si le vol a déjà été effectué, afficher la confirmation
                if (thiefStolenFromId && thiefPlayerId) {
                    const thiefPlayer = players.find(p => p.id === thiefPlayerId);
                    const victim = players.find(p => p.id === thiefStolenFromId);
                    const stolenRoleName = AVAILABLE_ROLES[thiefPlayer?.role || 'VILLAGER']?.name || thiefPlayer?.role;
                    
                    return (
                        <div>
                            <h4>✅ Vol effectué</h4>
                            <p style={{fontStyle: 'italic', color: 'var(--accent-color)'}}>
                                Le voleur a volé le rôle de <strong>{victim?.name}</strong>
                            </p>
                            <p style={{fontSize: '0.9rem', opacity: 0.8}}>
                                • Le voleur est maintenant : <strong>{stolenRoleName}</strong><br/>
                                • {victim?.name} est devenu(e) : <strong>Villageois</strong>
                            </p>
                            <p style={{marginTop: '1.5rem', fontWeight: 'bold'}}>
                                👉 Cliquez sur "Phase Suivante" pour le RÉVEIL GÉNÉRAL
                            </p>
                        </div>
                    );
                }
                
                return (
                    <div>
                        <h4>🥷 Le Voleur se réveille ({thief?.name})</h4>
                        <p><strong>⚠️ PREMIÈRE NUIT SEULEMENT :</strong> Seul le voleur se réveille.</p>
                        <p style={{fontSize: '0.95rem', marginTop: '1rem'}}>
                            Le voleur doit choisir <strong>UN joueur</strong> dont il volera le rôle.
                        </p>
                        <p style={{fontSize: '0.9rem', opacity: 0.8, fontStyle: 'italic'}}>
                            👉 Le voleur prendra le rôle du joueur choisi<br/>
                            👉 Le joueur volé deviendra simple villageois<br/>
                            👉 Après le vol, RÉVEIL GÉNÉRAL pour que tous vérifient leur téléphone
                        </p>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                            {nonThiefPlayers.map(p => {
                                const roleName = AVAILABLE_ROLES[p.role!]?.name || p.role;
                                return (
                                    <Button
                                        key={p.id}
                                        onClick={() => setSelectedTarget(p.id)}
                                        variant={selectedTarget === p.id ? 'action' : 'default'}
                                    >
                                        {p.name} ({roleName})
                                    </Button>
                                );
                            })}
                        </div>
                        
                        <p style={{fontSize: '0.85rem', opacity: 0.7, marginTop: '1.5rem'}}>
                            <strong>🔔 Après cette phase :</strong> Réveil général puis la vraie Nuit 1 avec Cupidon
                        </p>
                    </div>
                );
            }
            
            case 'CUPID_TURN':
                const cupid = livingPlayers.find(p => p.role === 'CUPID');
                const hasThief = players.some(p => p.role === 'THIEF');
                const cupidCanChooseSelf = gameState.cupidCanChooseSelf !== false; // Par défaut true
                
                if (lovers && lovers.length === 2) {
                    const lover1 = players.find(p => p.id === lovers[0]);
                    const lover2 = players.find(p => p.id === lovers[1]);
                    return (
                        <div>
                            <h4>💕 Cupidon a uni deux âmes</h4>
                            <p><strong>{lover1?.name}</strong> et <strong>{lover2?.name}</strong> sont maintenant amoureux ❤️</p>
                            <p style={{fontStyle: 'italic'}}>Révélez discrètement à chacun l'identité de son partenaire</p>
                            <p style={{fontSize: '0.9rem', opacity: 0.8}}>
                                ℹ️ Cupidon ne jouera plus les nuits suivantes.
                            </p>
                        </div>
                    );
                }
                
                // Filtrer les joueurs sélectionnables selon la configuration
                const selectablePlayers = cupidCanChooseSelf 
                    ? livingPlayers 
                    : livingPlayers.filter(p => p.id !== cupid?.id);
                
                return (
                    <div>
                        <h4>💕 Cupidon choisit les amoureux ({cupid?.name})</h4>
                        {hasThief && (
                            <p><strong>⚠️ SÉPARATION DES NUITS :</strong> Cupidon joue à la 2e nuit pour éviter les conflits avec le voleur.</p>
                        )}
                        <p>💕 {hasThief ? 'DEUXIÈME NUIT' : 'PREMIÈRE NUIT'} : Cupidon désigne deux joueurs qui deviennent amoureux. Si l'un meurt, l'autre meurt de chagrin.</p>
                        {!cupidCanChooseSelf && (
                            <p style={{color: 'orange', fontSize: '0.9rem'}}>⚠️ Cupidon ne peut PAS se choisir lui-même dans cette partie.</p>
                        )}
                        <p>Sélectionnez le couple choisi :</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                            {selectablePlayers.map(p => (
                                <Button
                                    key={p.id}
                                    onClick={() => {
                                        if (!selectedPlayerIds.includes(p.id)) {
                                            if (selectedPlayerIds.length < 2) {
                                                setSelectedPlayerIds([...selectedPlayerIds, p.id]);
                                            }
                                        } else {
                                            setSelectedPlayerIds(selectedPlayerIds.filter(id => id !== p.id));
                                        }
                                    }}
                                    variant={selectedPlayerIds.includes(p.id) ? 'action' : 'default'}
                                >
                                    {p.name}
                                </Button>
                            ))}
                        </div>
                        <p style={{marginTop: '1rem', opacity: 0.8}}>
                            Couple sélectionné : {selectedPlayerIds.length}/2
                        </p>
                        <p style={{fontSize: '0.9rem', opacity: 0.8, marginTop: '1rem'}}>
                            ℹ️ Cupidon ne jouera plus les nuits suivantes.
                        </p>
                    </div>
                );
            


            default:
                return <p style={{ fontStyle: 'italic', opacity: 0.8 }}>{narratorMessage}</p>;
        }
    };

    const isPhaseAdvancable = () => {
         if (phase === 'HUNTER_REVENGE' || phase === 'MAYOR_SUCCESSION' || phase === 'MAYOR_TIE_BREAKER') {
             return !!selectedTarget;
         }
         // Pour les phases nocturnes, il faut que l'action soit validée
         if (phase === 'SEER_TURN') {
             // Si tous les joueurs ont été vus, on peut passer automatiquement
             const unseenPlayers = livingPlayers.filter(p => 
                 p.role !== 'SEER' && !seerSeenPlayers.includes(p.id)
             );
             if (unseenPlayers.length === 0) {
                 return true; // Tous les joueurs ont été vus, on peut passer
             }
             return !!seerChoice;
         }
         if (phase === 'WEREWOLVES_TURN') {
             return !!werewolfChoice;
         }
         if (phase === 'WITCH_TURN') {
             return !!witchActionCompleted; // Vérifier que la sorcière a fait son choix
         }
         if (phase === 'CUPID_TURN') {
             return !!lovers;
         }
         return true;
    };

    const isNarratorActionAvailable = () => {
        switch (phase) {
            case 'THIEF_TURN':
                return !!selectedTarget && !thiefStolenFromId;
            case 'SEER_TURN':
                return !!selectedTarget && !seerChoice;
            case 'WEREWOLVES_TURN':
                return !!selectedTarget && !werewolfChoice;
            case 'WITCH_TURN':
                // Disponible si : HEAL, NOTHING, ou KILL avec cible sélectionnée
                if (selectedTarget === 'HEAL' || selectedTarget === 'NOTHING') {
                    return true;
                }
                if (selectedTarget && selectedTarget.startsWith('KILL_')) {
                    return true;
                }
                return false;
            case 'CUPID_TURN':
                return selectedPlayerIds.length === 2 && !lovers;
            default:
                return false;
        }
    };
    
    return (
        <div style={{ 
            width: '100%', 
            maxWidth: '900px', 
            background: 'var(--primary-color)', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            margin: '2rem auto'
        }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>🎭 Tableau de Bord du Narrateur</h2>
            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--background-color)', borderRadius: '8px' }}>
                <h3 style={{marginTop: 0, fontSize: '1.5rem' }}>📍 Phase Actuelle : {PHASE_NAMES[phase] || phase}</h3>
                <div>{renderPhaseSpecifics()}</div>
            </div>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1.5rem', 
                textAlign: 'left',
                marginBottom: '2rem'
            }}>
                <div>
                    <h3 style={{ fontSize: '1.3rem' }}>✅ Joueurs Vivants ({livingPlayers.length})</h3>
                    <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                        {livingPlayers.map(p => {
                            const roleName = AVAILABLE_ROLES[p.role!]?.name || p.role;
                            return (
                                <li key={p.id} style={{padding: '0.5rem', borderBottom: '1px solid var(--secondary-color)', fontSize: '0.95rem'}}>
                                    {p.name} - <strong>{roleName}</strong> {p.id === mayorId && '👑'}
                                    {lovers?.includes(p.id) && '❤️'}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div>
                     <h3 style={{ fontSize: '1.3rem' }}>💀 Joueurs Éliminés ({deadPlayers.length})</h3>
                     <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                        {deadPlayers.map(p => {
                            const roleName = AVAILABLE_ROLES[p.role!]?.name || p.role;
                            return (
                                <li key={p.id} style={{opacity: 0.6, padding: '0.5rem', borderBottom: '1px solid var(--secondary-color)', fontSize: '0.95rem'}}>
                                    ⚰️ {p.name} - {roleName}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                {isNarratorActionAvailable() && (
                    <Button onClick={handleNarratorAction} disabled={isLoading} variant="action">
                        {isLoading ? '⏳ Chargement...' : '✅ Confirmer l\'action'}
                    </Button>
                )}
                {!isNarratorActionAvailable() && (
                    <Button onClick={handleAdvancePhase} disabled={isLoading || !isPhaseAdvancable()}>
                        {isLoading ? '⏳ Chargement...' : '➡️ Phase Suivante'}
                    </Button>
                )}
                
                {/* Bouton de retour en arrière - toujours disponible pour le narrateur */}
                {history && history.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                        <Button 
                            onClick={undoLastAction} 
                            disabled={isLoading}
                        >
                            ⬅️ Retour en arrière ({history.length} état{history.length > 1 ? 's' : ''} disponible{history.length > 1 ? 's' : ''})
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
