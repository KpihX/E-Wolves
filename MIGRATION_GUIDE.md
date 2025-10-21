# 🔄 Changements à Apporter dans GameContext.tsx

## Fonctions à Mettre à Jour

Toutes les fonctions du `realtimeService` sont maintenant **asynchrones**. 

### Liste des fonctions modifiées :

1. ✅ `getGame()` → Maintenant async
2. ✅ `createGame()` → Déjà async
3. ✅ `joinGame()` → Déjà async  
4. ✅ `reconnectPlayer()` → Maintenant async
5. ✅ `leaveGame()` → Maintenant async
6. ✅ `startGame()` → Déjà async
7. ✅ `startGameWithConfig()` → Déjà async
8. ✅ `advancePhase()` → Déjà async
9. ✅ `submitMayorVote()` → À rendre async
10. ✅ `submitVote()` → À rendre async
11. ✅ `submitNightAction()` → À rendre async
12. ✅ `submitWitchAction()` → À rendre async
13. ✅ `submitCupidSelection()` → À rendre async
14. ✅ `submitThiefChoice()` → À rendre async
15. ✅ `undoLastAction()` → À rendre async

### Nouvelle Fonction :

- ✅ `subscribeToGame()` → Écoute en temps réel
- ✅ `cleanup()` → Nettoie les listeners

## Exemple de Migration

### Avant (localStorage) :

```typescript
const handleJoinGame = (name: string, code: string) => {
  joinGame(clientId, name, code); // Synchrone
  const game = getGame(code);      // Synchrone
  setGameState(game);
};
```

### Après (Firebase) :

```typescript
const handleJoinGame = async (name: string, code: string) => {
  await joinGame(clientId, name, code); // Async
  const game = await getGame(code);      // Async
  setGameState(game);
  
  // Écoute en temps réel
  subscribeToGame(code, (updatedGame) => {
    if (updatedGame) {
      setGameState(updatedGame);
    }
  });
};
```

## GameContext.tsx - Modifications Nécessaires

### 1. Import cleanup et subscribeToGame

```typescript
import { 
  createGame, 
  joinGame, 
  leaveGame, 
  startGameWithConfig,
  advancePhase,
  submitMayorVote,
  submitVote,
  submitNightAction,
  submitWitchAction,
  submitCupidSelection,
  submitThiefChoice,
  undoLastAction,
  getGame,
  subscribeToGame,  // ← NOUVEAU
  cleanup,           // ← NOUVEAU
  initialize 
} from '../services/realtimeService';
```

### 2. Ajouter l'écoute en temps réel

Dans le `useEffect` qui charge la partie :

```typescript
useEffect(() => {
  const loadGame = async () => {
    if (gameCode) {
      const game = await getGame(gameCode);
      if (game) {
        setGameState(game);
        
        // ✨ Écoute en temps réel
        const unsubscribe = subscribeToGame(gameCode, (updatedGame) => {
          if (updatedGame) {
            setGameState(updatedGame);
          }
        });
        
        // Cleanup au démontage
        return () => {
          unsubscribe();
        };
      }
    }
  };
  
  loadGame();
}, [gameCode]);

// Cleanup global
useEffect(() => {
  return () => {
    cleanup();
  };
}, []);
```

### 3. Rendre toutes les fonctions async

```typescript
const handleCreateGame = async (name: string) => {
  try {
    await createGame(clientId, name);
    // ... reste du code
  } catch (error) {
    // Gestion d'erreur
  }
};

const handleJoinGame = async (name: string, code: string) => {
  try {
    await joinGame(clientId, name, code);
    // ... reste du code
  } catch (error) {
    // Gestion d'erreur
  }
};

// Et ainsi de suite pour toutes les fonctions...
```

## Build et Test

### 1. Build

```powershell
npm run build
```

### 2. Test Local

```powershell
npm run dev
```

### 3. Test Multi-Appareils

1. Ouvrez `http://localhost:5173` dans 2 onglets
2. Créez une partie dans l'onglet 1
3. Rejoignez avec le code dans l'onglet 2
4. ✅ Vérifiez la synchronisation temps réel

## Déploiement

### 1. Commit

```powershell
git add .
git commit -m "feat(firebase): Intégration Firebase Realtime Database pour sync multi-appareils"
```

### 2. Merge dans master

```powershell
git checkout master
git merge feature/firebase-sync
```

### 3. Build et Deploy

```powershell
npm run build
vercel --prod
```

---

✅ **Une fois ces modifications faites, l'app sera entièrement synchronisée en temps réel !**
