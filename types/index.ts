// FIX: Removed invalid file markers causing parsing errors.
// FIX: Populating missing type definitions.
export type Role = 'VILLAGER' | 'WEREWOLF' | 'SEER' | 'HUNTER' | 'WITCH' | 'CUPID' | 'THIEF' | 'LITTLE_GIRL';

export interface Player {
  id: string;
  name: string;
  role: Role | null;
  isAlive: boolean;
  isNarrator: boolean;
  isStolen?: boolean; // Indique si le joueur a été volé par le voleur
}

export type Screen = 
  | 'HOME'
  | 'CREATE_GAME'
  | 'JOIN_GAME'
  | 'LOBBY'
  | 'GAME_NARRATOR'
  | 'GAME_PLAYER';

export type GamePhase =
  | 'ROLE_ASSIGNMENT'
  | 'THIEF_TURN'
  | 'NIGHT'
  | 'CUPID_TURN'
  | 'SEER_TURN'

  | 'WEREWOLVES_TURN'
  | 'WITCH_TURN'
  | 'DAY_DISCUSSION'
  | 'MAYOR_ELECTION'
  | 'MAYOR_TIE_BREAKER'
  | 'DAY_VOTE'
  | 'MAYOR_SUCCESSION'
  | 'HUNTER_REVENGE'
  | 'GAME_OVER';

export type Winner = 'VILLAGERS' | 'WEREWOLVES' | 'LOVERS' | null;

export interface GameState {
  screen: Screen;
  gameCode: string | null;
  players: Player[];
  currentPlayer: Player | null;
  phase: GamePhase;
  narratorMessage: string;
  turn: number;
  mayorId: string | null;
  mayorVotes: Record<string, string>; // voterId -> candidateId
  mayorTieCandidates: string[] | null; // Candidats à égalité pour l'élection du maire
  votes: Record<string, string>; // voterId -> votedPlayerId
  seerChoice: string | null; // playerId looked at by seer
  seerSeenPlayers: string[]; // Liste des IDs de joueurs déjà vus par la voyante
  werewolfChoice: string | null; // playerId targeted by werewolves
  werewolfVictimId: string | null; // The confirmed victim after wolves' turn
  witchPotions: {
    heal: boolean;
    kill: boolean;
  };
  witchHealChoice: boolean; // true if she decides to heal
  witchKillChoice: string | null; // playerId she decides to kill
  witchActionCompleted: boolean; // true if witch has made her choice (including NONE)
  lovers: [string, string] | null;
  winner: Winner;
  winReason?: string; // Description détaillée de la raison de la victoire
  thiefPlayerId: string | null; // ID du joueur qui était le voleur
  thiefStolenFromId: string | null; // ID du joueur dont le voleur a volé le rôle
  hunterWhoDiedId: string | null; // ID of the hunter who just died, to handle succession logic
  cupidCanChooseSelf?: boolean; // Si vrai, Cupidon peut se choisir comme amoureux (par défaut: true)
  history?: GameState[]; // Historique des états pour permettre le retour en arrière
}

export type WitchAction = { actionType: 'HEAL' } | { actionType: 'KILL', targetId: string } | { actionType: 'NONE' };

export interface GameContextType {
  gameState: GameState;
  isLoading: boolean;
  setScreen: (screen: Screen) => void;
  createGame: (narratorName: string) => void;
  joinGame: (playerName: string, code: string) => void;
  startGame: () => void;
  startGameWithConfig: (config: import('./gameConfig').GameConfig) => void;
  advancePhase: (payload?: { hunterTargetId?: string; successorId?: string }) => Promise<void>;
  submitMayorVote: (voterId: string, candidateId: string) => void;
  submitVote: (voterId: string, votedPlayerId: string) => void;
  submitNightAction: (actorId: string, targetId: string) => void;
  submitWitchAction: (action: WitchAction) => void;
  submitCupidSelection: (player1Id: string, player2Id: string) => void;
  submitThiefChoice: (targetPlayerId: string) => void; // Le voleur choisit un joueur à voler
  resetGame: () => void;
  undoLastAction: () => void; // Retour en arrière
}