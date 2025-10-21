import { Role, GamePhase } from './index';

// Noms français des phases pour l'interface utilisateur
export const PHASE_NAMES: Record<GamePhase, string> = {
  'ROLE_ASSIGNMENT': 'Attribution des rôles',
  'THIEF_TURN': 'Tour du Voleur',
  'NIGHT': 'Nuit',
  'CUPID_TURN': 'Tour de Cupidon',
  'SEER_TURN': 'Tour de la Voyante',
  'WEREWOLVES_TURN': 'Tour des Loups-Garous',
  'WITCH_TURN': 'Tour de la Sorcière',
  'DAY_DISCUSSION': 'Discussion du village',
  'MAYOR_ELECTION': 'Élection du maire',
  'MAYOR_TIE_BREAKER': 'Départage pour le maire',
  'DAY_VOTE': 'Vote d\'élimination',
  'MAYOR_SUCCESSION': 'Succession du maire',
  'HUNTER_REVENGE': 'Vengeance du chasseur',
  'GAME_OVER': 'Fin de partie'
};

// Messages d'instruction pour le narrateur selon les phases
export const PHASE_INSTRUCTIONS: Record<string, string> = {
  'THIEF_TURN': '🌙 PREMIÈRE NUIT : Le voleur regarde les deux cartes non distribuées et peut échanger son rôle.',
  'ROLE_ASSIGNMENT': '☀️ RÉVEIL GÉNÉRAL : Tout le monde consulte son téléphone pour vérifier son rôle (échange possible du voleur).',
  'CUPID_TURN': '💕 DEUXIÈME NUIT : Cupidon désigne deux joueurs qui deviennent amoureux. Si l\'un meurt, l\'autre meurt de chagrin.',
  'SEER_TURN': '🔮 La voyante désigne un joueur pour connaître son véritable rôle.',
  'WEREWOLVES_TURN': '🐺 Les loups-garous se concertent et choisissent une victime à dévorer.',
  'WITCH_TURN': '🧪 La sorcière peut utiliser sa potion de vie (sauver) ou sa potion de mort (tuer).',
};

// Configuration des rôles disponibles avec leurs contraintes
export interface RoleConfig {
  id: Role;
  name: string;
  description: string;
  team: 'VILLAGERS' | 'WEREWOLVES' | 'NEUTRAL';
  minPlayers: number; // Nombre minimum de joueurs pour inclure ce rôle
  maxCount: number; // Nombre maximum de ce rôle dans une partie
  defaultCount: number; // Nombre par défaut
  isEssential: boolean; // Rôle obligatoire
  nightAction: boolean; // A une action nocturne
  priority: number; // Ordre d'exécution la nuit (plus bas = plus tôt)
}

// Configuration complète de la partie
export interface GameConfig {
  minPlayers: number;
  maxPlayers: number;
  werewolfCount: number;
  roles: Record<Role, number>; // Nombre de chaque rôle
  enabledRoles: Role[]; // Rôles activés pour cette partie
  cupidCanChooseSelf?: boolean; // Si vrai, Cupidon peut se choisir comme amoureux (par défaut: true)
}

// Définition des rôles disponibles
export const AVAILABLE_ROLES: Record<Role, RoleConfig> = {
  WEREWOLF: {
    id: 'WEREWOLF',
    name: 'Loup-Garou',
    description: 'Créature sanguinaire qui dévore un villageois chaque nuit. Gagne si les loups égalent ou dépassent les villageois.',
    team: 'WEREWOLVES',
    minPlayers: 4,
    maxCount: 4,
    defaultCount: 2,
    isEssential: true,
    nightAction: true,
    priority: 3
  },
  SEER: {
    id: 'SEER',
    name: 'Voyante',
    description: 'Oracle du village qui peut découvrir la véritable identité d\'un joueur chaque nuit.',
    team: 'VILLAGERS',
    minPlayers: 4,
    maxCount: 1,
    defaultCount: 1,
    isEssential: true,
    nightAction: true,
    priority: 1
  },
  WITCH: {
    id: 'WITCH',
    name: 'Sorcière',
    description: 'Apothicaire mystérieuse avec une potion de vie (sauver) et une potion de mort (tuer). Une seule utilisation chacune.',
    team: 'VILLAGERS',
    minPlayers: 4,
    maxCount: 1,
    defaultCount: 1,
    isEssential: true,
    nightAction: true,
    priority: 4
  },
  HUNTER: {
    id: 'HUNTER',
    name: 'Chasseur',
    description: 'Tireur d\'élite qui emporte un joueur dans la mort. Quand il meurt, il désigne une dernière victime.',
    team: 'VILLAGERS',
    minPlayers: 6,
    maxCount: 1,
    defaultCount: 1,
    isEssential: false,
    nightAction: false,
    priority: 0
  },
  CUPID: {
    id: 'CUPID',
    name: 'Cupidon',
    description: 'Ange de l\'amour qui unit deux âmes. Si un amoureux meurt, l\'autre meurt de chagrin. Peut créer des alliances inattendues.',
    team: 'VILLAGERS',
    minPlayers: 4,
    maxCount: 1,
    defaultCount: 0,
    isEssential: false,
    nightAction: true,
    priority: 0
  },
  THIEF: {
    id: 'THIEF',
    name: 'Voleur',
    description: 'Opportuniste qui peut échanger son rôle avec l\'une des deux cartes non distribuées au début de la partie.',
    team: 'NEUTRAL',
    minPlayers: 4,
    maxCount: 1,
    defaultCount: 0,
    isEssential: false,
    nightAction: false,
    priority: -1
  },
  VILLAGER: {
    id: 'VILLAGER',
    name: 'Villageois',
    description: 'Citoyen ordinaire du village. Pas de pouvoir spécial, mais le vote et la déduction sont ses armes.',
    team: 'VILLAGERS',
    minPlayers: 0,
    maxCount: 10,
    defaultCount: 0,
    isEssential: false,
    nightAction: false,
    priority: 0
  },
  LITTLE_GIRL: {
    id: 'LITTLE_GIRL',
    name: 'Petite Fille',
    description: 'Enfant curieuse qui peut discrètement ouvrir les yeux et observer les loups-garous pendant leur tour.',
    team: 'VILLAGERS',
    minPlayers: 4,
    maxCount: 1,
    defaultCount: 0,
    isEssential: false,
    nightAction: false,
    priority: 0
  }
};

// Phases nocturnes pour la PREMIÈRE nuit uniquement (SEULEMENT le voleur)
export const FIRST_NIGHT_PHASES: Role[] = [
  'THIEF'   // Seul le voleur joue la première nuit
];

// Phases nocturnes pour la DEUXIÈME nuit (Cupidon + rôles réguliers)
export const SECOND_NIGHT_PHASES: Role[] = [
  'CUPID',    // Cupidon joue UNE SEULE FOIS, à la 2e nuit
  'SEER',
  'WEREWOLF',
  'WITCH'
];

// Phases nocturnes pour les nuits SUIVANTES (3e nuit et plus)
export const REGULAR_NIGHT_PHASES: Role[] = [
  'SEER',
  'WEREWOLF',
  'WITCH'
];

// Contraintes de validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Génère une configuration recommandée selon le nombre de joueurs
export function generateRecommendedConfig(playerCount: number): GameConfig {
  const config: GameConfig = {
    minPlayers: playerCount,
    maxPlayers: playerCount,
    werewolfCount: 0, // sera calculé selon les priorités
    roles: {} as Record<Role, number>,
    enabledRoles: []
  };

  // Initialiser tous les rôles à 0
  Object.keys(AVAILABLE_ROLES).forEach(role => {
    config.roles[role as Role] = 0;
  });

  // CONFIGURATION SELON VOS PRIORITÉS : Loup, Sorcière, Voyante, Cupidon, Voleur/Chasseur
  // Villageois seulement si trop de joueurs
  
  if (playerCount >= 4) {
    // 4 joueurs : 1 loup, 1 sorcière, 1 voyante, 1 cupidon
    config.roles.WEREWOLF = 1;
    config.roles.WITCH = 1;
    config.roles.SEER = 1;
    config.roles.CUPID = 1;
    config.werewolfCount = 1;
  }

  if (playerCount >= 5) {
    // 5e joueur : Voleur
    config.roles.THIEF = 1;
  }

  if (playerCount >= 6) {
    // 6e joueur : Chasseur
    config.roles.HUNTER = 1;
  }

  if (playerCount >= 7) {
    // 7e joueur : 2e loup-garou
    config.roles.WEREWOLF = 2;
    config.werewolfCount = 2;
  }

  if (playerCount >= 8) {
    // 8e joueur et plus : ajouter des villageois pour les places restantes
    const totalAssignedRoles = Object.values(config.roles).reduce((sum, count) => sum + count, 0);
    const remainingSlots = playerCount - totalAssignedRoles;
    
    if (remainingSlots > 0) {
      // Pour plus de 8 joueurs : 1 loup-garou pour 3 nouveaux villageois
      const extraWerewolves = Math.floor(remainingSlots / 4);
      const extraVillagers = remainingSlots - extraWerewolves;
      
      if (extraWerewolves > 0) {
        config.roles.WEREWOLF += extraWerewolves;
        config.werewolfCount += extraWerewolves;
      }
      
      config.roles.VILLAGER = extraVillagers;
    }
  }

  // Calculer les rôles activés
  config.enabledRoles = Object.entries(config.roles)
    .filter(([_, count]) => count > 0)
    .map(([role, _]) => role as Role);

  // Par défaut, Cupidon peut se choisir lui-même
  config.cupidCanChooseSelf = true;

  return config;
}

// Valide une configuration de jeu
export function validateGameConfig(config: GameConfig): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  const totalRoles = Object.values(config.roles).reduce((sum, count) => sum + count, 0);
  const totalPlayers = config.minPlayers;

  // Vérifications critiques
  if (totalRoles !== totalPlayers) {
    result.errors.push(`Nombre total de rôles (${totalRoles}) différent du nombre de joueurs (${totalPlayers})`);
    result.isValid = false;
  }

  if (config.werewolfCount < 1) {
    result.errors.push('Il faut au moins 1 loup-garou');
    result.isValid = false;
  }

  if (config.werewolfCount >= totalPlayers) {
    result.errors.push('Trop de loups-garous par rapport au nombre de joueurs');
    result.isValid = false;
  }

  if (config.roles.WEREWOLF !== config.werewolfCount) {
    result.errors.push('Le nombre de loups-garous dans les rôles ne correspond pas à la configuration');
    result.isValid = false;
  }

  // Vérifications par rôle
  Object.entries(config.roles).forEach(([roleId, count]) => {
    const role = roleId as Role;
    const roleConfig = AVAILABLE_ROLES[role];
    
    if (count > 0) {
      if (totalPlayers < roleConfig.minPlayers) {
        result.errors.push(`${roleConfig.name} nécessite au moins ${roleConfig.minPlayers} joueurs`);
        result.isValid = false;
      }
      
      if (count > roleConfig.maxCount) {
        result.errors.push(`Maximum ${roleConfig.maxCount} ${roleConfig.name} autorisé(s)`);
        result.isValid = false;
      }
    }
  });

  // Vérifications d'équilibre
  const villagerTeamCount = Object.entries(config.roles)
    .filter(([role, count]) => count > 0 && AVAILABLE_ROLES[role as Role].team === 'VILLAGERS')
    .reduce((sum, [_, count]) => sum + count, 0);

  if (villagerTeamCount <= config.werewolfCount) {
    result.warnings.push('L\'équipe des villageois pourrait être en sous-nombre');
  }

  // Avertissements sur l'absence de rôles essentiels
  if (config.roles.SEER === 0) {
    result.warnings.push('Aucune Voyante - le jeu sera plus difficile pour les villageois');
  }



  return result;
}

// Génère la séquence des phases nocturnes selon le tour
export function generateNightSequence(turn: number, enabledRoles: Role[]): string[] {
  const sequence: string[] = [];
  const hasThief = enabledRoles.includes('THIEF');
  
  // Fonction helper pour convertir un rôle en phase
  const roleToPhase = (role: Role): string => {
    // Cas spécial : WEREWOLF -> WEREWOLVES_TURN (pluriel)
    if (role === 'WEREWOLF') return 'WEREWOLVES_TURN';
    return `${role}_TURN`;
  };
  
  if (hasThief) {
    // Avec Voleur : tour 1 = vraie première nuit après le voleur (Cupidon + rôles)
    if (turn === 1) {
      SECOND_NIGHT_PHASES.forEach(role => {
        if (enabledRoles.includes(role)) {
          sequence.push(roleToPhase(role));
        }
      });
    } else {
      // Tour 2+ avec Voleur : cycle régulier (plus de Cupidon)
      REGULAR_NIGHT_PHASES.forEach(role => {
        if (enabledRoles.includes(role)) {
          sequence.push(roleToPhase(role));
        }
      });
    }
  } else {
    // Sans Voleur : tour 1 = première vraie nuit (Cupidon + rôles)
    if (turn === 1) {
      SECOND_NIGHT_PHASES.forEach(role => {
        if (enabledRoles.includes(role)) {
          sequence.push(roleToPhase(role));
        }
      });
    } else {
      // Tour 2+ sans Voleur : cycle régulier (plus de Cupidon)
      REGULAR_NIGHT_PHASES.forEach(role => {
        if (enabledRoles.includes(role)) {
          sequence.push(roleToPhase(role));
        }
      });
    }
  }

  return sequence;
}