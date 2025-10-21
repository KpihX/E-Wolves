import { ref, set, get, onValue, update, remove, off } from 'firebase/database';
import { database } from '../config/firebase';
import { GameState, Role, WitchAction } from '../types';
import { generateNightSequence, AVAILABLE_ROLES, SECOND_NIGHT_PHASES, generateRecommendedConfig } from '../types/gameConfig';

// --- CONFIGURATION ---
export const STORAGE_KEY = 'werewolf-games'; // Gardé pour compatibilité

// --- MOTEUR DE JEU FIREBASE ---
let currentClientId: string | null = null;
let stateUpdateCallback: ((gameCode: string | null) => void) | null = null;
let activeListeners: Map<string, () => void> = new Map();

// --- Fonctions de gestion de l'état avec Firebase ---

/**
 * Récupère toutes les parties depuis Firebase
 */
const getGames = async (): Promise<Record<string, GameState>> => {
    try {
        const gamesRef = ref(database, 'games');
        const snapshot = await get(gamesRef);
        return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
        console.error('Erreur lors de la récupération des parties:', error);
        return {};
    }
};

/**
 * Sauvegarde toutes les parties dans Firebase
 */
const saveGames = async (games: Record<string, GameState>): Promise<void> => {
    try {
        const gamesRef = ref(database, 'games');
        await set(gamesRef, games);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des parties:', error);
        throw error;
    }
};

/**
 * Récupère une partie spécifique depuis Firebase
 */
export const getGame = async (gameCode: string): Promise<GameState | null> => {
    try {
        const gameRef = ref(database, `games/${gameCode}`);
        const snapshot = await get(gameRef);
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error(`Erreur lors de la récupération de la partie ${gameCode}:`, error);
        return null;
    }
};

/**
 * Écoute les changements en temps réel d'une partie
 */
export const subscribeToGame = (gameCode: string, callback: (game: GameState | null) => void): (() => void) => {
    const gameRef = ref(database, `games/${gameCode}`);
    
    const unsubscribe = onValue(gameRef, (snapshot) => {
        const game = snapshot.exists() ? snapshot.val() : null;
        callback(game);
    }, (error) => {
        console.error(`Erreur d'écoute de la partie ${gameCode}:`, error);
        callback(null);
    });

    // Stocker le listener pour nettoyage ultérieur
    activeListeners.set(gameCode, unsubscribe);

    // Retourner la fonction de désabonnement
    return () => {
        off(gameRef);
        activeListeners.delete(gameCode);
    };
};

/**
 * Met à jour une partie dans Firebase et notifie les listeners
 */
const updateAndNotify = async (gameCode: string, game: GameState): Promise<void> => {
    try {
        const gameRef = ref(database, `games/${gameCode}`);
        await set(gameRef, game);
        
        // La notification est automatique via onValue()
        if (stateUpdateCallback) {
            stateUpdateCallback(gameCode);
        }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la partie ${gameCode}:`, error);
        throw error;
    }
};

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

// --- Moteur de jeu principal (exécuté par le "maître") ---
export const initialize = (clientId: string, onStateUpdate: (gameCode: string | null) => void) => {
    currentClientId = clientId;
    stateUpdateCallback = onStateUpdate;
};

/**
 * Nettoie tous les listeners actifs
 */
export const cleanup = () => {
    activeListeners.forEach((unsubscribe) => unsubscribe());
    activeListeners.clear();
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
            const player = livingPlayers.find(p => p.id === loverId);
            return player && player.role === 'WEREWOLF';
        });
        
        const hasVillagerInCouple = game.lovers.some(loverId => {
            const player = livingPlayers.find(p => p.id === loverId);
            return player && player.role !== 'WEREWOLF';
        });
        
        if (hasWerewolfInCouple && hasVillagerInCouple) {
            game.winner = 'LOVERS';
            game.phase = 'GAME_OVER';
            const lover1 = livingPlayers.find(p => p.id === game.lovers![0]);
            const lover2 = livingPlayers.find(p => p.id === game.lovers![1]);
            game.winReason = `${lover1?.name} (${lover1?.role}) et ${lover2?.name} (${lover2?.role}) sont les deux seuls survivants. Leur amour a triomphé contre tous, malgré leurs différences.`;
            return;
        }
    }
};
