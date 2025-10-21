import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { GameState, Screen, GameContextType, WitchAction, Player, Role } from '../types';
import { GameConfig } from '../types/gameConfig';
import * as gameService from '../services/realtimeService';

const initialState: GameState = {
  screen: 'HOME',
  gameCode: null,
  players: [],
  currentPlayer: null,
  phase: 'ROLE_ASSIGNMENT',
  narratorMessage: 'Bienvenue! Préparez-vous à commencer.',
  turn: 1,
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
  history: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const clientId = useRef(sessionStorage.getItem('clientId') || `client-${crypto.randomUUID()}`);
  sessionStorage.setItem('clientId', clientId.current);

  const updateStateForClient = useCallback(async (gameCode: string | null) => {
    if (!gameCode) {
      setGameState(initialState);
      return;
    }
    const game = await gameService.getGame(gameCode);
    if (game) {
      const currentPlayer = game.players.find((p: Player) => p.id === clientId.current) || null;
      setGameState({ ...game, currentPlayer });
      if (currentPlayer) {
        sessionStorage.setItem('gameCode', gameCode);
      }
    } else {
        sessionStorage.removeItem('gameCode');
        setGameState({...initialState, screen: 'HOME' });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Initialiser le service de jeu (qui gère la logique du "serveur" local)
    gameService.initialize(clientId.current, (gameCode) => updateStateForClient(gameCode));

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === gameService.STORAGE_KEY) {
        const gameCode = sessionStorage.getItem('gameCode');
        if(gameCode){
            updateStateForClient(gameCode);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Tentative de reconnexion
    const existingGameCode = sessionStorage.getItem('gameCode');
    if (existingGameCode) {
      gameService.reconnectPlayer(clientId.current, existingGameCode);
      updateStateForClient(existingGameCode);
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateStateForClient]);

  const handleAction = useCallback(async (action: Function, ...args: any[]) => {
    setIsLoading(true);
    try {
      await action(clientId.current, ...args);
      // L'état sera mis à jour par l'event listener 'storage'
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Une erreur est survenue.");
      setIsLoading(false);
    }
  }, []);

  const createGame = (narratorName: string) => handleAction(gameService.createGame, narratorName);
  const joinGame = (playerName: string, code: string) => handleAction(gameService.joinGame, playerName, code.toUpperCase());
  const startGameWithConfig = (config: GameConfig) => handleAction(gameService.startGameWithConfig, sessionStorage.getItem('gameCode'), config);
  const startGame = () => handleAction(gameService.startGame, sessionStorage.getItem('gameCode'));
  const advancePhase = async (payload?: { hunterTargetId?: string; successorId?: string; }) => handleAction(gameService.advancePhase, sessionStorage.getItem('gameCode'), payload);
  const submitMayorVote = (voterId: string, candidateId: string) => handleAction(gameService.submitMayorVote, sessionStorage.getItem('gameCode'), voterId, candidateId);
  const submitVote = (voterId: string, votedPlayerId: string) => handleAction(gameService.submitVote, sessionStorage.getItem('gameCode'), voterId, votedPlayerId);
  const submitNightAction = (actorId: string, targetId: string) => handleAction(gameService.submitNightAction, sessionStorage.getItem('gameCode'), actorId, targetId);
  const submitWitchAction = (action: WitchAction) => handleAction(gameService.submitWitchAction, sessionStorage.getItem('gameCode'), action);
  const submitCupidSelection = (player1Id: string, player2Id: string) => handleAction(gameService.submitCupidSelection, sessionStorage.getItem('gameCode'), player1Id, player2Id);
  const submitThiefChoice = (targetPlayerId: string) => handleAction(gameService.submitThiefChoice, sessionStorage.getItem('gameCode'), targetPlayerId);
  const undoLastAction = () => handleAction(gameService.undoLastAction, sessionStorage.getItem('gameCode'));
  
  const resetGame = () => {
      const code = sessionStorage.getItem('gameCode');
      if (code) {
        gameService.leaveGame(clientId.current, code);
      }
      sessionStorage.removeItem('gameCode');
      setGameState({...initialState, screen: 'HOME'});
  };
  
  const setScreen = (screen: Screen) => {
    if(screen === 'HOME') {
        resetGame();
    } else {
        setGameState(prev => ({...prev, screen}));
    }
  }

  const value: GameContextType = { 
    gameState, 
    isLoading, 
    setScreen, 
    createGame, 
    joinGame, 
    startGame,
    startGameWithConfig,
    advancePhase,
    submitMayorVote, 
    submitVote, 
    submitNightAction, 
    submitWitchAction,
    submitCupidSelection,
    submitThiefChoice,
    undoLastAction,
    resetGame 
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};