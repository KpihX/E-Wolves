import { GameState, Role, WitchAction } from '../types';
import { generateNightSequence, AVAILABLE_ROLES, SECOND_NIGHT_PHASES, generateRecommendedConfig } from '../types/gameConfig';

// --- CONFIGURATION ---
export const STORAGE_KEY = 'werewolf-games';

// --- MOTEUR DE JEU LOCAL ---
let currentClientId: string | null = null;
let stateUpdateCallback: ((gameCode: string | null) => void) | null = null;


// --- Fonctions de gestion de l'état ---
const getGames = (): Record<string, GameState> => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
};

const saveGames = (games: Record<string, GameState>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
};

export const getGame = (gameCode: string): GameState | null => {
    return getGames()[gameCode] || null;
}

// Fonction pour sauvegarder l'état actuel dans l'historique (pour le retour en arrière)
const saveToHistory = (game: GameState) => {
    if (!game.history) {
        game.history = [];
    }
    
    // Créer une copie profonde de l'état actuel (sans l'historique pour éviter la récursion)
    const stateCopy: GameState = JSON.parse(JSON.stringify({ ...game, history: undefined }));
    
    // Limiter l'historique à 20 états maximum pour éviter une surcharge mémoire
    if (game.history.length >= 20) {
        game.history.shift(); // Retirer le plus ancien
    }
    
    game.history.push(stateCopy);
};

const updateAndNotify = (gameCode: string, game: GameState) => {
    const games = getGames();
    games[gameCode] = game;
    saveGames(games);
    if(stateUpdateCallback) stateUpdateCallback(gameCode);
}

// --- Moteur de jeu principal (exécuté par le "maître") ---
export const initialize = (clientId: string, onStateUpdate: (gameCode: string | null) => void) => {
    currentClientId = clientId;
    stateUpdateCallback = onStateUpdate;
};


// --- Logique de jeu (précédemment sur le serveur) ---

const generateGameCode = () => {
    let code = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const createInitialGameState = (gameCode: string, narrator: any): GameState => ({
    screen: 'LOBBY',
    gameCode,
    players: [narrator],
    // FIX: Property 'currentPlayer' is missing in type 'GameState' but required.
    currentPlayer: null,
    phase: 'ROLE_ASSIGNMENT',
    narratorMessage: 'Le narrateur prépare la partie...',
    turn: 0,
    mayorId: null,
    mayorVotes: {},
    mayorTieCandidates: null,
    votes: {},
    seerChoice: null,
    seerSeenPlayers: [],
    werewolfChoice: null,
    werewolfVictimId: null,
    witchPotions: { heal: true, kill: true },
    witchHealChoice: false,
    witchKillChoice: null,
    witchActionCompleted: false,
    lovers: null,
    winner: null,
    thiefPlayerId: null,
    thiefStolenFromId: null,
    hunterWhoDiedId: null,
    history: [], // Historique pour le retour en arrière
});

// --- GÉNÉRATEUR DE NARRATIF SIMPLIFIÉ ---
const generateNarration = async (message: string): Promise<string> => {
    return message; // Retourne directement le message sans IA
};

const assignRolesFromConfig = (players: any[], config: any): { updatedPlayers: any[] } => {
    const gamePlayers = players.filter(p => !p.isNarrator);
    
    // Créer la liste des rôles à assigner selon la configuration
    let rolesToAssign: Role[] = [];
    Object.entries(config.roles).forEach(([role, count]) => {
        const roleCount = count as number;
        for (let i = 0; i < roleCount; i++) {
            rolesToAssign.push(role as Role);
        }
    });
    
    // Vérifier que nous avons le bon nombre de rôles
    if (rolesToAssign.length !== gamePlayers.length) {
        throw new Error(`Configuration invalide: ${rolesToAssign.length} rôles pour ${gamePlayers.length} joueurs`);
    }

    // Shuffle
    for (let i = rolesToAssign.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rolesToAssign[i], rolesToAssign[j]] = [rolesToAssign[j], rolesToAssign[i]];
    }

    const updatedPlayers = JSON.parse(JSON.stringify(players));
    let roleIndex = 0;
    
    updatedPlayers.forEach((player: any) => {
        if (!player.isNarrator) {
            if(roleIndex < rolesToAssign.length) {
                player.role = rolesToAssign[roleIndex];
                roleIndex++;
            } else {
                 player.role = 'VILLAGER'; // Default if not enough roles defined
            }
        }
    });
    
    return { updatedPlayers };
};

const checkWinConditions = (game: GameState) => {
    const livingPlayers = game.players.filter(p => p.isAlive && !p.isNarrator);
    const livingWerewolves = livingPlayers.filter(p => p.role === 'WEREWOLF');
    const livingVillagers = livingPlayers.filter(p => p.role !== 'WEREWOLF');
    
    const werewolfCount = livingWerewolves.length;
    const villagerCount = livingVillagers.length;
    const totalLiving = livingPlayers.length;
    
    // CAS 1 : Plus personne n'est vivant → Égalité (cas rare mais possible)
    if (totalLiving === 0) {
        game.winner = 'VILLAGERS'; // Par défaut, on donne la victoire aux villageois
        game.phase = 'GAME_OVER';
        game.winReason = "Tous les joueurs sont morts. Le village est dévasté, mais les loups-garous ont également péri.";
        return;
    }
    
    // CAS 2 : Le couple survit seul → Victoire du couple
    if (game.lovers && totalLiving === 2 && 
        livingPlayers.every(p => game.lovers!.includes(p.id))) {
        game.winner = 'LOVERS';
        game.phase = 'GAME_OVER';
        const lover1 = livingPlayers[0];
        const lover2 = livingPlayers[1];
        game.winReason = `${lover1.name} et ${lover2.name} sont les deux seuls survivants. Leur amour a triomphé contre tous.`;
        return;
    }
    
    // CAS 3 : Plus de loups-garous vivants → Victoire des villageois
    if (werewolfCount === 0) {
        game.winner = 'VILLAGERS';
        game.phase = 'GAME_OVER';
        game.winReason = `Tous les loups-garous ont été éliminés. Les ${villagerCount} villageois survivants peuvent enfin vivre en paix.`;
        return;
    }
    
    // CAS 4 : Plus de villageois vivants → Victoire des loups-garous
    if (villagerCount === 0) {
        game.winner = 'WEREWOLVES';
        game.phase = 'GAME_OVER';
        game.winReason = `Tous les villageois ont été dévorés ou éliminés. Les ${werewolfCount} loup(s)-garou(s) règnent désormais sur le village.`;
        return;
    }
    
    // CAS 5 : Les loups sont en majorité ou égalité → Victoire des loups
    // (car la nuit, ils tueront un villageois et auront la majorité)
    if (werewolfCount >= villagerCount) {
        game.winner = 'WEREWOLVES';
        game.phase = 'GAME_OVER';
        game.winReason = `Les loups-garous sont en nombre égal ou supérieur aux villageois (${werewolfCount} loups vs ${villagerCount} villageois). La prochaine nuit, ils tueront un villageois et auront la victoire assurée. La partie s'arrête donc ici.`;
        return;
    }
    
    // CAS 6 : 1 loup + 1 villageois, et le villageois est dans un couple avec un loup → Victoire du couple
    if (totalLiving === 2 && werewolfCount === 1 && game.lovers) {
        const hasWerewolfInCouple = game.lovers.some(loverId => {
            const lover = livingPlayers.find(p => p.id === loverId);
            return lover?.role === 'WEREWOLF';
        });
        const allLoversAlive = game.lovers.every(loverId => 
            livingPlayers.some(p => p.id === loverId)
        );
        if (hasWerewolfInCouple && allLoversAlive) {
            game.winner = 'LOVERS';
            game.phase = 'GAME_OVER';
            const lover1 = livingPlayers[0];
            const lover2 = livingPlayers[1];
            game.winReason = `${lover1.name} (${lover1.role === 'WEREWOLF' ? 'Loup-Garou' : 'Villageois'}) et ${lover2.name} (${lover2.role === 'WEREWOLF' ? 'Loup-Garou' : 'Villageois'}) sont les deux seuls survivants et forment un couple. Leur amour transcende leur nature, ils gagnent ensemble.`;
            return;
        }
    }
    
    // Aucune condition de victoire immédiate atteinte, la partie continue
};

// Génère la séquence nocturne selon le tour et les rôles présents
const generateNightSequenceForGame = (game: GameState): string[] => {
    // IMPORTANT : Ne prendre que les joueurs VIVANTS avec un rôle
    const enabledRoles = [...new Set(game.players.filter(p => p.role && p.isAlive && !p.isNarrator).map(p => p.role!))];
    return generateNightSequence(game.turn, enabledRoles);
};

const startNight = async (game: GameState, gameCode: string) => {
    // VÉRIFICATION CRITIQUE : Avant de passer à la nuit, vérifier si la partie est déjà gagnée
    checkWinConditions(game);
    if (game.winner) {
        game.narratorMessage = await generateNarration(`La partie est terminée avant même la nuit !`);
        updateAndNotify(gameCode, game);
        return;
    }
    
    // Seulement incrémenter le tour si on n'est pas déjà en phase de nuit ou si on vient du réveil général
    if (game.phase !== 'NIGHT') {
        game.turn += 1;
    }
    game.phase = 'NIGHT';
    
    const hasThief = game.players.some(p => p.role === 'THIEF');
    let nightMessage;
    
    if (game.turn === 1) {
        if (hasThief) {
            nightMessage = `Nuit ${game.turn}. Vraie première nuit après le voleur : Cupidon puis les autres rôles entrent en action. Cliquez sur "Phase Suivante" pour commencer.`;
        } else {
            nightMessage = `Nuit ${game.turn}. Première nuit : Cupidon puis les autres rôles entrent en action. Cliquez sur "Phase Suivante" pour commencer.`;
        }
    } else {
        nightMessage = `Nuit ${game.turn}. Le village s'endort. Cliquez sur "Phase Suivante" pour commencer la première phase nocturne.`;
    }
    
    game.narratorMessage = await generateNarration(nightMessage);
    game.seerChoice = null;
    game.werewolfChoice = null;
    game.werewolfVictimId = null;
    game.witchHealChoice = false;
    game.witchKillChoice = null;
    game.witchActionCompleted = false;
    
    // NE PAS démarrer automatiquement - le narrateur doit cliquer manuellement
    updateAndNotify(gameCode, game);
};

const advanceNightTurn = async (game: GameState, gameCode: string) => {
    // Only the narrator's client should run this logic.
    const isNarrator = game.players[0]?.id === currentClientId;
    if (!isNarrator) return;

    const nightSequence = generateNightSequenceForGame(game);
    const currentPhaseIndex = nightSequence.indexOf(game.phase);
    let nextPhaseIndex = (currentPhaseIndex === -1) ? 0 : currentPhaseIndex + 1;

    if (nextPhaseIndex < nightSequence.length) {
        const nextPhase = nightSequence[nextPhaseIndex] as any; // Cast temporaire pour éviter l'erreur de type
        
        // Convertir la phase en rôle (cas spécial pour WEREWOLVES_TURN -> WEREWOLF)
        const phaseName = nextPhase.replace('_TURN', '');
        const roleForPhase: Role = phaseName === 'WEREWOLVES' ? 'WEREWOLF' : phaseName as Role;
        
        const roleConfig = AVAILABLE_ROLES[roleForPhase];
        
        game.phase = nextPhase;
        game.narratorMessage = await generateNarration(`${roleConfig.name} se réveille dans la nuit. Demandez-lui d'effectuer son action discrètement.`);
        updateAndNotify(gameCode, game);
    } else {
        await endNight(game, gameCode);
    }
};


const endNight = async (game: GameState, gameCode: string) => {
    // Only the narrator's client should run this logic.
    const isNarrator = game.players[0]?.id === currentClientId;
    if (!isNarrator) return;

    let deaths: { id: string, reason: string }[] = [];
    if (game.werewolfVictimId && !game.witchHealChoice) {
        deaths.push({ id: game.werewolfVictimId, reason: "dévoré" });
    }
    if (game.witchKillChoice) {
        deaths.push({ id: game.witchKillChoice, reason: "empoisonné" });
    }
    
    let deathMessages = [];
    let playersWhoDied = new Set<string>();

    for (const death of deaths) {
        const player = game.players.find(p => p.id === death.id);
        if (player && player.isAlive) {
            player.isAlive = false;
            playersWhoDied.add(player.id);
            const roleName = player.role ? (AVAILABLE_ROLES[player.role]?.name || player.role) : 'Joueur';
            deathMessages.push(`${player.name} (${roleName}) est mort, ${death.reason}.`);
            
            if (game.lovers?.includes(player.id)) {
                const otherLoverId = game.lovers[0] === player.id ? game.lovers[1] : game.lovers[0];
                const otherLover = game.players.find(p => p.id === otherLoverId);
                if (otherLover && otherLover.isAlive) {
                    otherLover.isAlive = false;
                    playersWhoDied.add(otherLover.id);
                    deathMessages.push(`${otherLover.name}, fou de chagrin, s'est donné la mort.`);
                }
            }
        }
    }

    checkWinConditions(game);
    if (game.winner) {
        game.narratorMessage = await generateNarration(`La partie est terminée ! ${deathMessages.join(' ')}`);
        updateAndNotify(gameCode, game);
        return;
    }
    
    for (const playerId of playersWhoDied) {
        const player = game.players.find(p => p.id === playerId)!;
        if(player.role === 'HUNTER' && !game.hunterWhoDiedId) {
            game.phase = 'HUNTER_REVENGE';
            game.hunterWhoDiedId = player.id;
            game.narratorMessage = await generateNarration(`Le chasseur ${player.name} est mort! Il doit choisir une dernière cible.`);
            updateAndNotify(gameCode, game);
            return;
        }
        if(player.id === game.mayorId) {
            game.phase = 'MAYOR_SUCCESSION';
            game.narratorMessage = await generateNarration(`Le maire ${player.name} est mort! Il doit désigner son successeur.`);
            updateAndNotify(gameCode, game);
            return;
        }
    }
    
    // Logique des nuits spéciales selon la présence du voleur
    const hasThief = game.players.some(p => p.role === 'THIEF');
    
    // Logique d'élection du maire : toujours après la vraie première nuit (turn === 1)
    // Que ce soit avec ou sans voleur, l'élection se fait après la nuit où Cupidon joue
    if (game.turn === 1) {
        // Après la vraie première nuit (Cupidon + rôles) → élection du maire
        game.phase = 'MAYOR_ELECTION';
        game.votes = {};
        if (deathMessages.length === 0) {
            game.narratorMessage = await generateNarration("Le jour se lève après la première nuit. Miracle, personne n'est mort ! Le village doit maintenant élire son maire.");
        } else {
            game.narratorMessage = await generateNarration(`Le jour se lève après la première nuit. ${deathMessages.join(" ")} Le village doit maintenant élire son maire.`);
        }
    } else {
        // À partir de la nuit 3, cycle normal jour/nuit avec discussions
        game.phase = 'DAY_DISCUSSION';
        game.votes = {};
        if (deathMessages.length === 0) {
            game.narratorMessage = await generateNarration("Le jour se lève et miracle, personne n'est mort cette nuit !");
        } else {
            game.narratorMessage = await generateNarration(`Le jour se lève. ${deathMessages.join(" ")} Le village doit maintenant débattre.`);
        }
    }
    updateAndNotify(gameCode, game);
};


// --- API du Service (fonctions appelées par le contexte) ---

export const createGame = async (clientId: string, narratorName: string) => {
    // Valider que le nom n'est pas vide
    const trimmedName = narratorName.trim();
    if (!trimmedName) {
        throw new Error("Le nom ne peut pas être vide.");
    }
    
    const gameCode = generateGameCode();
    const narrator = { id: clientId, name: trimmedName, role: null, isAlive: true, isNarrator: true };
    const newGame = createInitialGameState(gameCode, narrator);
    updateAndNotify(gameCode, newGame);
};

export const joinGame = async (clientId: string, playerName: string, gameCode: string) => {
    const game = getGame(gameCode);
    if (!game) throw new Error("Cette partie n'existe pas.");
    if (game.phase !== 'ROLE_ASSIGNMENT') throw new Error("La partie a déjà commencé.");
    if (game.players.some(p => p.id === clientId)) { // Already in game, maybe reconnecting
        updateAndNotify(gameCode, game);
        return;
    };
    
    // Valider que le nom n'est pas vide
    const trimmedName = playerName.trim();
    if (!trimmedName) {
        throw new Error("Le nom ne peut pas être vide.");
    }
    
    // Vérifier si le nom est déjà utilisé (insensible à la casse et aux espaces)
    const normalizedName = trimmedName.toLowerCase();
    const nameExists = game.players.some(p => p.name.trim().toLowerCase() === normalizedName);
    if (nameExists) {
        throw new Error(`Le nom "${trimmedName}" est déjà utilisé. Veuillez choisir un autre nom.`);
    }
    
    game.players.push({ id: clientId, name: trimmedName, role: null, isAlive: true, isNarrator: false });
    updateAndNotify(gameCode, game);
};

export const reconnectPlayer = (clientId: string, gameCode: string) => {
    const game = getGame(gameCode);
    if (game && game.players.some(p => p.id === clientId)) {
        if(stateUpdateCallback) stateUpdateCallback(gameCode);
    }
};

export const leaveGame = (clientId: string, gameCode: string) => {
    const game = getGame(gameCode);
    if (!game) return;
    game.players = game.players.filter(p => p.id !== clientId);
    if (game.players.length === 0 || game.players.every(p => !p.isNarrator)) {
        const games = getGames();
        delete games[gameCode];
        saveGames(games);
        if(stateUpdateCallback) stateUpdateCallback(null);
    } else {
        updateAndNotify(gameCode, game);
    }
};

// Ancienne fonction pour compatibilité (génère une configuration par défaut)
const assignRoles = (players: any[], gameCode: string) => {
    // Utilise la nouvelle fonction generateRecommendedConfig pour générer la configuration
    const playerCount = players.filter(p => !p.isNarrator).length;
    const defaultConfig = generateRecommendedConfig(playerCount);
    
    console.log('[assignRoles] Configuration générée pour', playerCount, 'joueurs:', defaultConfig.roles);
    
    return assignRolesFromConfig(players, defaultConfig);
};

// Cette fonction n'est plus utilisée - on utilise startGameWithConfig
export const startGame = async (clientId: string, gameCode: string | null) => {
    console.warn('startGame is deprecated, use startGameWithConfig instead');
};

export const startGameWithConfig = async (clientId: string, gameCode: string | null, config: any) => {
    if (!gameCode) return;
    const game = getGame(gameCode);
    // Only the narrator can start the game.
    if (!game || game.players[0].id !== clientId) return;

    try {
        const { updatedPlayers } = assignRolesFromConfig(game.players, config);
        game.players = updatedPlayers;
        game.cupidCanChooseSelf = config.cupidCanChooseSelf; // Transmettre la configuration du Cupidon
        game.screen = 'GAME_PLAYER';
        game.phase = game.players.some(p => p.role === 'THIEF') ? 'THIEF_TURN' : 'NIGHT';
        
        if (game.phase === 'THIEF_TURN') {
            game.narratorMessage = await generateNarration("La nuit tombe. Le voleur se réveille pour voler le rôle d'un autre joueur.");
            updateAndNotify(gameCode, game);
        } else {
            // S'il n'y a pas de voleur, démarrer directement la nuit 1
            game.turn = 1;
            game.phase = 'NIGHT';
            game.narratorMessage = await generateNarration(`Nuit ${game.turn}. Le village s'endort. Cliquez sur "Phase Suivante" pour commencer.`);
            updateAndNotify(gameCode, game);
        }
    } catch (error: any) {
        console.error('Erreur lors du démarrage avec configuration:', error);
        // Notify the narrator of the error
        game.narratorMessage = `Erreur: ${error.message}`;
        updateAndNotify(gameCode, game);
    }
};

export const advancePhase = async (clientId: string, gameCode: string | null, payload?: any) => {
    if (!gameCode) return;
    const game = getGame(gameCode);
    if (!game) return;
    
    // Only the narrator can advance the phase.
    if (!game.players.length || game.players[0].id !== clientId) return;

    // Sauvegarder l'état actuel dans l'historique avant toute modification
    saveToHistory(game);

    switch(game.phase) {
        case 'THIEF_TURN':
            // Après que le voleur ait joué, réveil général puis nuit 1
            game.turn = 0; // Phase intermédiaire avant la nuit 1
            game.phase = 'ROLE_ASSIGNMENT'; // Phase de réveil général
            game.narratorMessage = await generateNarration(`Le voleur a terminé. RÉVEIL GÉNÉRAL : Tout le monde consulte maintenant son téléphone pour voir si son rôle a été échangé ! Cliquez sur "Phase Suivante" quand tous ont vérifié.`);
            updateAndNotify(gameCode, game);
            break;
        case 'ROLE_ASSIGNMENT':
            // Après le réveil général, commencer la vraie nuit 1 (deuxième nuit spéciale)
            await startNight(game, gameCode);
            break;
        case 'NIGHT':
            // Passer de la phase NIGHT générale à la première phase nocturne spécifique
            await advanceNightTurn(game, gameCode);
            break;
        case 'CUPID_TURN':
        case 'SEER_TURN':
        case 'WEREWOLVES_TURN':
        case 'WITCH_TURN':
            await advanceNightTurn(game, gameCode);
            break;
        case 'MAYOR_ELECTION': {
            const votes = Object.values(game.mayorVotes);
            const voteCounts = votes.reduce((acc: Record<string, number>, id) => {
                acc[id] = (acc[id] || 0) + 1;
                return acc;
            }, {});
            const maxVotes = Math.max(0, ...Object.values(voteCounts));
            const elected = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes);
            
            if (elected.length === 1) {
                // Un seul candidat avec le plus de voix → Il est élu
                game.mayorId = elected[0];
                game.mayorTieCandidates = null;
                game.phase = 'DAY_DISCUSSION';
                const mayorName = game.players.find(p => p.id === game.mayorId)?.name;
                game.narratorMessage = await generateNarration(`Le village a élu ${mayorName} comme maire ! Maintenant, débattez.`);
            } else if (elected.length > 1) {
                // Égalité → Départage par Pierre-Feuille-Ciseaux hors plateforme
                game.mayorTieCandidates = elected;
                game.phase = 'MAYOR_TIE_BREAKER';
                const candidateNames = elected.map(id => game.players.find(p => p.id === id)?.name).join(', ');
                game.narratorMessage = await generateNarration(`Égalité entre ${candidateNames} ! Organisez un Pierre-Feuille-Ciseaux puis sélectionnez le gagnant.`);
            } else {
                // Aucun vote → Pas de maire
                game.mayorId = null;
                game.mayorTieCandidates = null;
                game.phase = 'DAY_DISCUSSION';
                game.narratorMessage = await generateNarration("Aucun vote. Pas de maire élu. Débattez.");
            }
            break;
        }
        case 'MAYOR_TIE_BREAKER': {
            // Le narrateur choisit le gagnant du Pierre-Feuille-Ciseaux
            if (payload.mayorId) {
                game.mayorId = payload.mayorId;
                game.mayorTieCandidates = null;
                game.phase = 'DAY_DISCUSSION';
                const mayorName = game.players.find(p => p.id === game.mayorId)?.name;
                game.narratorMessage = await generateNarration(`${mayorName} remporte le Pierre-Feuille-Ciseaux et devient maire ! Maintenant, débattez.`);
            }
            break;
        }
        case 'DAY_DISCUSSION':
            // VÉRIFICATION CRITIQUE : Avant de passer au vote, vérifier si la partie est déjà gagnée
            checkWinConditions(game);
            if (game.winner) {
                game.narratorMessage = await generateNarration("La partie est terminée ! Inutile de voter.");
                updateAndNotify(gameCode, game);
                break;
            }
            game.phase = 'DAY_VOTE';
            game.narratorMessage = await generateNarration("Fin de la discussion. Votez pour éliminer un suspect.");
            break;
        case 'DAY_VOTE': {
            // Première phase : Comptage normal (1 vote = 1 voix, même pour le maire)
            const voteCounts: Record<string, number> = {};
            Object.entries(game.votes).forEach(([voterId, targetId]) => {
                voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
            });
            
            const maxVotes = Math.max(0, ...Object.values(voteCounts));
            let eliminated = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes);
            
            // Si égalité ET que le maire a voté pour l'un des candidats à égalité
            // Le vote du maire départage (celui qu'il a choisi est éliminé)
            if (eliminated.length > 1 && game.mayorId && game.votes[game.mayorId]) {
                const mayorChoice = game.votes[game.mayorId];
                if (eliminated.includes(mayorChoice)) {
                    eliminated = [mayorChoice]; // Le maire départage : son choix est éliminé
                    game.narratorMessage = await generateNarration(`Égalité ! Le maire a départagé en votant contre ${game.players.find(p => p.id === mayorChoice)?.name}.`);
                }
            }
            
            if (eliminated.length === 1) {
                const player = game.players.find(p => p.id === eliminated[0])!;
                player.isAlive = false;
                
                // Vérifier si la victime est amoureuse → Tuer le partenaire aussi
                const victimRoleName = player.role ? (AVAILABLE_ROLES[player.role]?.name || player.role) : 'Joueur';
                if (game.lovers?.includes(player.id)) {
                    const otherLoverId = game.lovers[0] === player.id ? game.lovers[1] : game.lovers[0];
                    const otherLover = game.players.find(p => p.id === otherLoverId);
                    if (otherLover && otherLover.isAlive) {
                        otherLover.isAlive = false;
                        game.narratorMessage = await generateNarration(`${player.name} est éliminé par le village. Il était ${victimRoleName}. ${otherLover.name}, fou de chagrin, s'est donné la mort.`);
                    } else {
                        game.narratorMessage = await generateNarration(`${player.name} est éliminé par le village. Il était ${victimRoleName}.`);
                    }
                } else {
                    game.narratorMessage = await generateNarration(`${player.name} est éliminé par le village. Il était ${victimRoleName}.`);
                }

                checkWinConditions(game);
                if (game.winner) game.phase = 'GAME_OVER';
                else if(player.role === 'HUNTER') { game.phase = 'HUNTER_REVENGE'; game.hunterWhoDiedId = player.id; }
                else if(player.id === game.mayorId) game.phase = 'MAYOR_SUCCESSION';
                else await startNight(game, gameCode);
            } else {
                game.narratorMessage = await generateNarration("Vote partagé, personne n'est éliminé. La nuit tombe.");
                await startNight(game, gameCode);
            }
            break;
        }
        case 'HUNTER_REVENGE': {
            const player = game.players.find(p => p.id === payload.hunterTargetId)!;
            player.isAlive = false;
            
            const hunterVictimRoleName = player.role ? (AVAILABLE_ROLES[player.role]?.name || player.role) : 'Joueur';
            let deathMessage = `Dans un dernier souffle, le chasseur abat ${player.name}. Il était ${hunterVictimRoleName}.`;
            
            // Si le joueur tué est amoureux, son partenaire meurt aussi
            if (game.lovers?.includes(player.id)) {
                const otherLoverId = game.lovers[0] === player.id ? game.lovers[1] : game.lovers[0];
                const otherLover = game.players.find(p => p.id === otherLoverId);
                if (otherLover && otherLover.isAlive) {
                    otherLover.isAlive = false;
                    deathMessage += ` ${otherLover.name}, son amoureux(se), meurt de chagrin.`;
                }
            }
            
            game.narratorMessage = await generateNarration(deathMessage);
            checkWinConditions(game);
            if (game.winner) game.phase = 'GAME_OVER';
            else if (game.hunterWhoDiedId === game.mayorId) game.phase = 'MAYOR_SUCCESSION';
            else await startNight(game, gameCode);
            game.hunterWhoDiedId = null;
            break;
        }
        case 'MAYOR_SUCCESSION': {
            game.mayorId = payload.successorId;
            const newMayor = game.players.find(p => p.id === game.mayorId);
            game.narratorMessage = await generateNarration(`${newMayor?.name} est le nouveau maire. La nuit tombe.`);
            await startNight(game, gameCode);
            break;
        }
    }
    updateAndNotify(gameCode, game);
};
   
export const submitMayorVote = (clientId: string, gameCode: string | null, voterId: string, candidateId: string) => {
    if (!gameCode) return;
    const game = getGame(gameCode);
    if (!game || game.phase !== 'MAYOR_ELECTION') return;
    saveToHistory(game);
    game.mayorVotes[voterId] = candidateId;
    updateAndNotify(gameCode, game);
};
   
export const submitVote = (clientId: string, gameCode: string | null, voterId: string, votedPlayerId: string) => {
    if (!gameCode) return;
    const game = getGame(gameCode);
    if (!game || game.phase !== 'DAY_VOTE') return;
    saveToHistory(game);
    game.votes[voterId] = votedPlayerId;
    updateAndNotify(gameCode, game);
};
   
export const submitNightAction = (clientId: string, gameCode: string | null, actorId: string, targetId: string) => {
    if (!gameCode) return;
    const game = getGame(gameCode);
    if (!game) return;
    
    saveToHistory(game);
    
    // Gestion des actions du narrateur (pour le jeu en présentiel)
    if (actorId === 'NARRATOR_SEER' && game.phase === 'SEER_TURN') {
        game.seerChoice = targetId;
        // Ajouter le joueur à la liste des joueurs déjà vus
        if (!game.seerSeenPlayers.includes(targetId)) {
            game.seerSeenPlayers.push(targetId);
        }
        updateAndNotify(gameCode, game);
        
        // NE PAS passer automatiquement à la phase suivante
        // Le narrateur doit avoir le temps de montrer le résultat à la voyante
        // Il cliquera manuellement sur "Phase Suivante"
        return;
    }
    
    if (actorId === 'NARRATOR_WEREWOLVES' && game.phase === 'WEREWOLVES_TURN') {
        game.werewolfChoice = targetId;
        game.werewolfVictimId = targetId;
        updateAndNotify(gameCode, game);
        
        // Passer automatiquement à la phase suivante après l'action des loups-garous
        setTimeout(async () => {
            const refreshedGame = getGame(gameCode);
            if (refreshedGame && refreshedGame.phase === 'WEREWOLVES_TURN') {
                await advanceNightTurn(refreshedGame, gameCode);
            }
        }, 100);
        return;
    }
    
    // Actions directes des joueurs (pour les cas où c'est encore nécessaire)
    const actor = game.players.find(p => p.id === actorId);
    if (actor?.role === 'SEER' && game.phase === 'SEER_TURN') {
        game.seerChoice = targetId;
        // Ajouter le joueur à la liste des joueurs déjà vus
        if (!game.seerSeenPlayers.includes(targetId)) {
            game.seerSeenPlayers.push(targetId);
        }
    }
    if (actor?.role === 'WEREWOLF' && game.phase === 'WEREWOLVES_TURN') {
        game.werewolfChoice = targetId;
        game.werewolfVictimId = targetId;
    }
    updateAndNotify(gameCode, game);
};
   
export const submitWitchAction = (clientId: string, gameCode: string | null, action: WitchAction) => {
    if (!gameCode) return;
    const game = getGame(gameCode);
    if (!game || game.phase !== 'WITCH_TURN') return;
    
    saveToHistory(game);
    
    // Le narrateur peut soumettre les actions de la sorcière
    const narrator = game.players.find(p => p.isNarrator && p.id === clientId);
    const witch = game.players.find(p => p.role === 'WITCH');
    
    if (!narrator && !witch) return;

    if (action.actionType === 'HEAL' && game.witchPotions.heal) {
        game.witchHealChoice = true;
        game.witchPotions.heal = false;
        game.witchActionCompleted = true;
    }
    if (action.actionType === 'KILL' && game.witchPotions.kill) {
        game.witchKillChoice = action.targetId;
        game.witchPotions.kill = false;
        game.witchActionCompleted = true;
    }
    if (action.actionType === 'NONE') {
        // La sorcière ne fait rien cette nuit
        game.witchActionCompleted = true;
    }
    
    // Passer automatiquement à la phase suivante après l'action de la sorcière
    updateAndNotify(gameCode, game);
    
    // Avancer automatiquement vers la phase suivante
    setTimeout(async () => {
        const refreshedGame = getGame(gameCode);
        if (refreshedGame && refreshedGame.phase === 'WITCH_TURN') {
            await advanceNightTurn(refreshedGame, gameCode);
        }
    }, 100);
};
   
export const submitCupidSelection = (clientId: string, gameCode: string | null, player1Id: string, player2Id: string) => {
    if (!gameCode) return;
    const game = getGame(gameCode);
    if (!game || game.phase !== 'CUPID_TURN') return;
    
    saveToHistory(game);
    
    // Le narrateur ou Cupidon peuvent soumettre la sélection
    const narrator = game.players.find(p => p.isNarrator && p.id === clientId);
    const cupid = game.players.find(p => p.role === 'CUPID');
    
    if (!narrator && !cupid) return;
    
    game.lovers = [player1Id, player2Id];
    updateAndNotify(gameCode, game);
    
    // Passer automatiquement à la phase suivante après la sélection de Cupidon
    setTimeout(async () => {
        const refreshedGame = getGame(gameCode);
        if (refreshedGame && refreshedGame.phase === 'CUPID_TURN') {
            await advanceNightTurn(refreshedGame, gameCode);
        }
    }, 100);
};
   
export const submitThiefChoice = (clientId: string, gameCode: string | null, targetPlayerId: string) => {
    if (!gameCode) return;
    const game = getGame(gameCode);
    if (!game || game.phase !== 'THIEF_TURN') return;
    
    // Seul le narrateur peut soumettre le choix du voleur (pour le jeu en présentiel)
    const narrator = game.players.find(p => p.isNarrator && p.id === clientId);
    if (!narrator) return;
    
    // Sauvegarder l'état actuel dans l'historique avant modification
    saveToHistory(game);
    
    // Trouver le voleur et la victime
    const thief = game.players.find(p => p.role === 'THIEF');
    const victim = game.players.find(p => p.id === targetPlayerId);
    
    if (!thief || !victim || victim.isNarrator || victim.role === 'THIEF') {
        return; // Ne peut pas voler le narrateur ou soi-même
    }
    
    // ÉCHANGE DES RÔLES
    const stolenRole = victim.role; // Sauvegarder le rôle volé
    thief.role = stolenRole; // Le voleur prend le rôle de la victime
    victim.role = 'VILLAGER'; // La victime devient simple villageois
    victim.isStolen = true; // Marquer la victime comme volée
    
    // Enregistrer qui était le voleur et qui a été volé
    game.thiefPlayerId = thief.id;
    game.thiefStolenFromId = targetPlayerId;
    
    updateAndNotify(gameCode, game);
};

// Fonction de retour en arrière : restaure l'état précédent
export const undoLastAction = (clientId: string, gameCode: string | null) => {
    if (!gameCode) return;
    const game = getGame(gameCode);
    if (!game) return;
    
    // Seul le narrateur peut revenir en arrière
    const narrator = game.players.find(p => p.isNarrator && p.id === clientId);
    if (!narrator) return;
    
    // Vérifier qu'il y a un historique
    if (!game.history || game.history.length === 0) {
        console.log('Aucun état précédent disponible');
        return;
    }
    
    // Récupérer le dernier état sauvegardé
    const previousState = game.history.pop()!;
    
    // Restaurer l'état précédent (en conservant l'historique restant)
    const remainingHistory = game.history;
    Object.assign(game, previousState);
    game.history = remainingHistory;
    
    updateAndNotify(gameCode, game);
};
