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
    console.log('updateStateForClient appelé avec gameCode:', gameCode);
    if (!gameCode) {
      setGameState(initialState);
      return;
    }
    const game = await gameService.getGame(gameCode);
    console.log('updateStateForClient - jeu récupéré:', game);
    if (game) {
      const currentPlayer = game.players.find((p: Player) => p.id === clientId.current) || null;
      // Déterminer le bon screen en fonction de la phase et du rôle
      const screen: Screen = game.phase === 'ROLE_ASSIGNMENT' ? 'LOBBY' :
                             currentPlayer?.isNarrator ? 'GAME_NARRATOR' : 
                             'GAME_PLAYER';
      console.log('updateStateForClient - screen calculé:', screen, 'currentPlayer:', currentPlayer);
      setGameState({ ...game, currentPlayer, screen });
      if (currentPlayer) {
        sessionStorage.setItem('gameCode', gameCode);
      }
    } else {
        console.log('updateStateForClient - jeu non trouvé, retour HOME');
        sessionStorage.removeItem('gameCode');
        setGameState({...initialState, screen: 'HOME' });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Tentative de reconnexion à une partie existante
    const existingGameCode = sessionStorage.getItem('gameCode');
    if (existingGameCode) {
      console.log('Reconnexion à la partie:', existingGameCode);
      gameService.reconnectPlayer(clientId.current, existingGameCode);
      updateStateForClient(existingGameCode);
      
      // S'abonner aux changements temps réel pour la reconnexion
      gameService.subscribeToGame(existingGameCode, (updatedGame) => {
        if (!updatedGame) {
          console.log('Partie supprimée, retour HOME');
          sessionStorage.removeItem('gameCode');
          setGameState({...initialState, screen: 'HOME'});
          return;
        }
        
        const currentPlayer = updatedGame.players.find(p => p.id === clientId.current);
        if (currentPlayer) {
          const screen: Screen = updatedGame.phase === 'ROLE_ASSIGNMENT' ? 'LOBBY' :
                                 currentPlayer.isNarrator ? 'GAME_NARRATOR' : 
                                 'GAME_PLAYER';
          setGameState({ ...updatedGame, currentPlayer, screen });
        }
      });
    }
    
    // Nettoyage des listeners à la fermeture
    return () => {
      gameService.cleanup();
    };
  }, []); // Vide pour n'exécuter qu'au montage

  const handleAction = useCallback(async (action: Function, ...args: any[]) => {
    setIsLoading(true);
    try {
      const result = await action(clientId.current, ...args);
      console.log('handleAction result:', result, 'type:', typeof result, 'length:', result?.length);
      
      // Si l'action retourne un gameCode (ex: createGame), s'abonner aux changements
      if (typeof result === 'string' && result.length === 5) {
        console.log('Création de partie détectée, gameCode:', result);
        sessionStorage.setItem('gameCode', result);
        
        // S'abonner aux changements temps réel
        let isFirstUpdate = true;
        gameService.subscribeToGame(result, (updatedGame) => {
          console.log('subscribeToGame callback appelé, updatedGame:', updatedGame);
          
          if (!updatedGame) {
            console.error('Le jeu n\'existe plus');
            sessionStorage.removeItem('gameCode');
            setGameState({...initialState, screen: 'HOME'});
            setIsLoading(false);
            return;
          }
          
          const currentPlayer = updatedGame.players.find(p => p.id === clientId.current);
          console.log('currentPlayer trouvé:', currentPlayer);
          
          if (!currentPlayer) {
            console.error('Le joueur n\'est pas dans la partie');
            return;
          }
          
          // Déterminer le bon screen en fonction du rôle et de la phase
          const screen: Screen = updatedGame.phase === 'ROLE_ASSIGNMENT' ? 'LOBBY' :
                                 currentPlayer.isNarrator ? 'GAME_NARRATOR' : 
                                 'GAME_PLAYER';
          console.log('Screen calculé:', screen, 'isNarrator:', currentPlayer.isNarrator, 'phase:', updatedGame.phase);
          setGameState({ ...updatedGame, currentPlayer, screen });
          
          // Désactiver le loading seulement après la première mise à jour
          if (isFirstUpdate) {
            console.log('Première mise à jour, désactivation du loading');
            setIsLoading(false);
            isFirstUpdate = false;
          }
        });
        
        // Ne pas appeler setIsLoading(false) ici, on attend le premier callback
      } else {
        // Pour les autres actions, on désactive le loading immédiatement
        console.log('Action sans gameCode, désactivation du loading');
        setIsLoading(false);
      }
    } catch (e: any) {
      console.error('Erreur dans handleAction:', e);
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