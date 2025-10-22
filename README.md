# 🐺 Loup-Garou - Jeu Numérique en Présentiel

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange.svg)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com/)
[![Status](https://img.shields.io/badge/Status-Production-success.svg)](https://e-wolves.vercel.app/)

Application web de Loup-Garou pour jeu en présentiel avec synchronisation temps réel.

🎮 [Jouer maintenant](https://e-wolves.vercel.app/) | Made by **KπX**

---

## 📋 Table des Matières

1. [Concept](#-concept)
2. [Fonctionnalités](#-fonctionnalités)
3. [Démarrage Rapide](#-démarrage-rapide)
4. [Installation Complète](#-installation-complète)
5. [Configuration Firebase](#-configuration-firebase)
6. [Déploiement Vercel](#-déploiement-vercel)
7. [Architecture du Projet](#-architecture-du-projet)
8. [Guide d'Utilisation](#-guide-dutilisation)
9. [Scripts Disponibles](#-scripts-disponibles)
10. [Technologies Utilisées](#-technologies-utilisées)
11. [Contribuer](#-contribuer)
12. [Licence](#-licence)

---

## 🎯 Concept

**Loup-Garou** digitalise le célèbre jeu de société tout en préservant son essence sociale. Les joueurs sont **physiquement ensemble**, chacun utilise son téléphone comme carte numérique. La synchronisation Firebase permet à tous les appareils de voir les mêmes informations en temps réel.

### Pourquoi cette application ?

- ✅ Plus besoin de cartes physiques
- ✅ Synchronisation temps réel multi-appareils
- ✅ Interface narrateur pour gérer les phases
- ✅ Votes électroniques
- ✅ Fonctionne sur smartphone, tablette, ordinateur

---

## ✨ Fonctionnalités

### Pour le Narrateur ��

- Création de partie avec code unique à 5 lettres
- Configuration des rôles recommandée ou avancée
- Interface complète pour gérer toutes les phases
- Vision globale de tous les joueurs
- Navigation guidée entre phases nocturnes et diurnes

### Pour les Joueurs 🎮

- Rejoindre facilement avec un code
- Consulter son rôle secret à tout moment
- Voter électroniquement lors des phases diurnes
- Actions spéciales selon le rôle
- Interface adaptative

### Rôles Disponibles 🎭

- 🐺 **Loup-Garou** - Élimine un villageois chaque nuit
- 🔮 **Voyante** - Découvre le rôle d'un joueur
- 🧪 **Sorcière** - Potion de vie OU potion de mort
- 💘 **Cupidon** - Désigne deux amoureux
- 🏹 **Chasseur** - Élimine un joueur en mourant
- 🎭 **Voleur** - Vole le rôle d'un autre joueur au début
- 👑 **Maire** - Voix compte double
- 🧑 **Villageois** - Vote pendant la journée

---

## 🚀 Démarrage Rapide

Pour tester rapidement en local :

```bash
# 1. Cloner le projet
git clone https://github.com/KpihX/E-Wolves.git
cd E-Wolves

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env (voir section Configuration Firebase)
# Ajoutez vos identifiants Firebase

# 4. Lancer en mode développement
npm run dev
```

L'application sera accessible sur http://localhost:3000

---

## 📦 Installation Complète

### Prérequis

- **Node.js** (version 18+) - [Télécharger](https://nodejs.org/)
- **npm** ou **yarn**
- **Git** - [Télécharger](https://git-scm.com/)
- **Compte Firebase** (gratuit) - [Créer un compte](https://firebase.google.com/)
- **Compte Vercel** (gratuit, optionnel) - [Créer un compte](https://vercel.com/)

### Installation pas à pas

#### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/KpihX/E-Wolves.git
cd E-Wolves
```

#### 2️⃣ Installer les dépendances

```bash
npm install
```

Cette commande installe React 19.1, TypeScript 5.2, Vite 5.4, Firebase SDK et toutes les dépendances.

#### 3️⃣ Configurer Firebase

Voir la section Configuration Firebase ci-dessous.

#### 4️⃣ Lancer l'application

```bash
# Mode développement (avec HMR)
npm run dev

# Build de production
npm run build

# Prévisualiser le build de production
npm run preview
```

---

## 🔥 Configuration Firebase

Firebase Realtime Database est utilisé pour la synchronisation en temps réel.

### Étape 1 : Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur **"Ajouter un projet"**
3. Donnez un nom (ex: loup-garou-app)
4. Acceptez les conditions et créez le projet

### Étape 2 : Activer Realtime Database

1. Dans le menu, allez dans **"Realtime Database"**
2. Cliquez sur **"Créer une base de données"**
3. Choisissez un emplacement (ex: europe-west1)
4. Démarrez en **mode test**

### Étape 3 : Configurer les règles de sécurité

Dans l'onglet **"Règles"** de Realtime Database, remplacez par :

```json
{
  "rules": {
    "games": {
      "$gameCode": {
        ".read": true,
        ".write": true,
        ".indexOn": ["phase", "gameCode"]
      }
    }
  }
}
```

⚠️ **Note** : Ces règles permettent un accès public. Pour la production, considérez Firebase Authentication.

### Étape 4 : Récupérer les identifiants

1. Allez dans **Paramètres du projet** (⚙️ en haut)
2. Cliquez sur **"Général"**
3. Scrollez jusqu'à **"Vos applications"**
4. Cliquez sur l'icône **Web**
5. Enregistrez l'application (ex: "Loup-Garou Web")
6. Copiez les valeurs de configuration

### Étape 5 : Créer le fichier .env

À la racine du projet, créez un fichier .env :

```bash
# PowerShell (Windows)
New-Item .env

# Bash (Mac/Linux)
touch .env
```

Ajoutez vos identifiants Firebase :

```env
VITE_FIREBASE_API_KEY=AIzaSyCxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://votre-projet-default-rtdb.europe-west1.firebasedatabase.app/
VITE_FIREBASE_PROJECT_ID=votre-projet-id
VITE_FIREBASE_STORAGE_BUCKET=votre-projet.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

⚠️ **Important** : Le fichier .env est dans .gitignore et ne sera pas commité.

### Vérification

Lancez l'application :

```bash
npm run dev
```

Si tout est configuré, vous pouvez créer et rejoindre des parties !

---

## ☁️ Déploiement Vercel

Vercel offre un hébergement gratuit avec CDN global.

### Méthode 1 : Déploiement via GitHub (Recommandé)

#### 1️⃣ Pusher sur GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit"

# Créer un repo sur GitHub et le lier
git remote add origin https://github.com/VOTRE-USERNAME/E-Wolves.git
git push -u origin main
```

#### 2️⃣ Importer dans Vercel

1. Allez sur [vercel.com](https://vercel.com/)
2. Connectez-vous avec GitHub
3. Cliquez sur **"New Project"**
4. Importez votre repository E-Wolves
5. Vercel détecte automatiquement Vite

#### 3️⃣ Configurer les variables d'environnement

Dans Vercel Dashboard :

1. Allez dans **Settings** > **Environment Variables**
2. Ajoutez **TOUTES** les variables VITE_FIREBASE_* de votre .env
3. Sélectionnez **Production**, **Preview**, et **Development**

#### 4️⃣ Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 1-2 minutes
3. Votre site est en ligne ! 🎉

### Méthode 2 : Déploiement via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Ajouter les variables d'environnement
vercel env add VITE_FIREBASE_API_KEY
# Répétez pour toutes les variables

# Déployer en production
vercel --prod
```

### Mises à jour automatiques

Chaque push sur main déclenche automatiquement un nouveau déploiement :

```bash
git add .
git commit -m "Nouvelle fonctionnalité"
git push
# Vercel déploie automatiquement ✨
```

---

## 🏗️ Architecture du Projet

### Structure des fichiers

```
E-Wolves/
│
├── components/              # Composants réutilisables
│   ├── Button.tsx           # Bouton stylisé
│   ├── Button.css
│   ├── Input.tsx            # Champ de saisie
│   ├── Input.css
│   ├── RoleCard.tsx         # Carte d'affichage de rôle
│   ├── RoleCard.css
│   ├── GameConfiguration.tsx # Configuration des rôles
│   ├── GameOverModal.tsx    # Modal de fin de partie
│   └── ErrorDisplay.tsx     # Affichage d'erreurs
│
├── config/
│   └── firebase.ts          # Configuration Firebase
│
├── context/
│   └── GameContext.tsx      # État global (React Context)
│
├── hooks/
│   └── useErrorHandler.ts   # Hook gestion d'erreurs
│
├── pages/                   # Pages de l'application
│   ├── HomePage.tsx         # Écran d'accueil
│   ├── CreateGamePage.tsx   # Création de partie
│   ├── JoinGamePage.tsx     # Rejoindre une partie
│   ├── LobbyPage.tsx        # Lobby avant démarrage
│   ├── GameNarratorPage.tsx # Interface narrateur
│   └── GamePlayerPage.tsx   # Interface joueur
│
├── services/
│   └── realtimeService.ts   # Logique métier + Firebase
│
├── types/
│   ├── index.ts             # Types TypeScript principaux
│   └── gameConfig.ts        # Types pour configuration
│
├── utils/
│   └── logger.ts            # Utilitaire de logging
│
├── App.tsx                  # Composant racine
├── index.tsx                # Point d'entrée React
├── index.css                # Styles globaux
├── index.html               # HTML principal
├── vite.config.ts           # Configuration Vite
├── tsconfig.json            # Configuration TypeScript
├── package.json             # Dépendances npm
├── .env                     # Variables d'environnement (à créer)
└── README.md                # Ce fichier
```

### Flux de données

```
┌────────────────────────────────────┐
│     FIREBASE REALTIME DB           │
│   (Synchronisation temps réel)     │
└───────────────┬────────────────────┘
                │
    ┌───────────┴────────────┐
    │                        │
┌───▼────────────┐   ┌───────▼────────┐
│ realtimeService│◄──┤  GameContext   │
│ (Business Logic)   │ (State Manager)│
└────────────────┘   └────────────────┘
        │                    │
        └──────────┬─────────┘
                   │
   ┌───────────────┼───────────────┐
   │               │               │
┌──▼───┐      ┌───▼──┐      ┌────▼──┐
│Pages │      │Hooks │      │Comps  │
└──────┘      └──────┘      └───────┘
```

---

## 📖 Guide d'Utilisation

### Pour le Narrateur

#### 1. Créer une partie

1. Ouvrez l'application
2. Cliquez sur **"Créer une partie"**
3. Entrez votre nom de narrateur
4. Un code à 5 lettres est généré (ex: ABCDE)
5. **Partagez ce code** aux joueurs

#### 2. Attendre les joueurs

- Les joueurs rejoignent avec le code
- Vous voyez la liste se remplir en temps réel
- Attendez que tout le monde soit là

#### 3. Configurer les rôles

**Mode Recommandé** (automatique) :

- L'application suggère une configuration équilibrée
- 4-6 joueurs : Loups + Voyante + Villageois
- 7-10 joueurs : + Sorcière + Cupidon
- 11+ joueurs : + Chasseur + Voleur

**Mode Avancé** (manuel) :

- Choisissez exactement les rôles
- Minimum : 1 Loup-Garou + 2 autres
- Équilibrez Village vs Loups

#### 4. Démarrer la partie

1. Cliquez sur **"Démarrer la partie"**
2. Les rôles sont attribués aléatoirement
3. Les joueurs peuvent consulter leur rôle secret
4. Suivez les instructions à l'écran

### Pour les Joueurs

#### 1. Rejoindre

1. Ouvrez l'application
2. Cliquez sur **"Rejoindre une partie"**
3. Entrez le **code de partie** (5 lettres)
4. Entrez votre **nom** (unique)
5. Attendez le démarrage

#### 2. Découvrir son rôle

- Une fois la partie démarrée
- Consultez votre carte de rôle
- **Ne montrez à personne !** 🤫

#### 3. Participer

**Si vous êtes Villageois** :

- Écoutez les discussions
- Votez lors des phases diurnes

**Si vous avez un rôle spécial** :

- Attendez votre phase
- Suivez les instructions
- Agissez via votre téléphone

---

## 🔧 Scripts Disponibles

### Développement

```bash
# Lancer le serveur de développement
npm run dev
# → http://localhost:3000 avec HMR

# Type checking TypeScript
npm run type-check
# → Vérifie les erreurs de types sans build
```

### Production

```bash
# Build de production
npm run build
# → Compile dans /dist (optimisé)

# Prévisualiser le build
npm run preview
# → Teste le build localement avant déploiement
```

---

## 🛠️ Technologies Utilisées

### Frontend

| Technologie | Version | Rôle |
|-------------|---------|------|
| **React** | 19.1 | Framework UI |
| **TypeScript** | 5.2 | Typage statique |
| **Vite** | 5.4 | Build tool & HMR |
| **CSS Modules** | - | Styling |

### Backend & Infrastructure

| Service | Rôle |
|---------|------|
| **Firebase Realtime Database** | Base de données temps réel |
| **Vercel** | Hosting & CDN global |
| **GitHub** | Version control & CI/CD |

### Dépendances Principales

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "firebase": "^10.14.1"
  },
  "devDependencies": {
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.2",
    "typescript": "^5.2.2",
    "vite": "^5.4.21"
  }
}
```

---

## 🤝 Contribuer

Les contributions sont les bienvenues !

### Workflow de contribution

1. **Fork** le projet
2. **Clone** votre fork

```bash
git clone https://github.com/VOTRE-USERNAME/E-Wolves.git
```

3. **Créez une branche** pour votre feature

```bash
git checkout -b feature/ma-super-fonctionnalite
```

4. **Committez** vos changements

```bash
git commit -m "feat: Ajout de ma super fonctionnalité"
```

5. **Pushez** vers votre fork

```bash
git push origin feature/ma-super-fonctionnalite
```

6. **Ouvrez une Pull Request** sur le repo principal

### Conventions de commit

Utilisez les [Conventional Commits](https://www.conventionalcommits.org/) :

- feat: Nouvelle fonctionnalité
- fix: Correction de bug
- docs: Documentation
- style: Formatage
- refactor: Refactoring de code
- test: Ajout de tests
- chore: Tâches de maintenance

---

## 📄 Licence

MIT © 2024 KπX

Vous êtes libre de :

- ✅ Utiliser ce projet à des fins personnelles ou commerciales
- ✅ Modifier le code source
- ✅ Distribuer votre version
- ✅ Utiliser à des fins privées

---

## 📧 Contact & Support

### Auteur

**KπX** - Développeur Full-Stack

- GitHub : [@KpihX](https://github.com/KpihX)
- Projet : [E-Wolves](https://github.com/KpihX/E-Wolves)

### Liens Utiles

- 🎮 **Application Live** : [e-wolves.vercel.app](https://e-wolves.vercel.app/)
- 📚 **Documentation React** : [react.dev](https://react.dev/)
- 🔥 **Documentation Firebase** : [firebase.google.com/docs](https://firebase.google.com/docs)
- ▲ **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)

---

## 📝 Changelog

### v2.0.0 - Firebase Integration (Octobre 2024)

#### ✨ Nouvelles Fonctionnalités

- Migration vers Firebase Realtime Database
- Synchronisation multi-appareils en temps réel
- Plusieurs joueurs peuvent rejoindre depuis différents appareils
- Mise à jour instantanée de l'état du jeu

#### 🐛 Corrections

- Fix freeze lors de la création de partie
- Fix navigation entre écrans (LOBBY → GAME)
- Fix rejoindre une partie ne fonctionnait pas
- Correction du centrage des éléments

#### 🎨 UI/UX

- Ajout favicon loup-garou 🐺
- Signature développeur "By KπX" en footer
- Amélioration du layout responsive
- Messages de chargement plus clairs

### v1.0.0 - Version Initiale (Septembre 2024)

#### ✨ Fonctionnalités

- 8 rôles jouables
- Interface narrateur complète
- Interface joueur adaptative
- Configuration recommandée/avancée
- Votes électroniques
- Phases nocturnes et diurnes
- LocalStorage pour persistance

#### 🎨 Design

- Thème sombre immersif
- Police Cinzel pour titres
- Animations fluides
- Responsive mobile-first

---

<div align="center">

## 🎮 Prêt à jouer ?

### [🐺 Lancez une partie maintenant !](https://e-wolves.vercel.app/)

Made with ❤️ by **KπX**

🌙 **Bonne chasse aux Loups-Garous !** 🐺

---

⭐ **Si vous aimez ce projet, donnez-lui une étoile sur GitHub !** ⭐

</div>
