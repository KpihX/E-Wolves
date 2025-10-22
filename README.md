# 🐺 Loup-Garou - Jeu Numérique en Présentiel# 🐺 Loup-Garou - Jeu Numérique en Présentiel



[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)

[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange.svg)](https://firebase.google.com/)[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange.svg)](https://firebase.google.com/)

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com/)[![Status](https://img.shields.io/badge/Status-Production-success.svg)](https://e-wolves.vercel.app/)

[![Status](https://img.shields.io/badge/Status-Production-success.svg)](https://e-wolves.vercel.app/)

> **Application web de Loup-Garou pour jeu en présentiel** - Multi-appareils avec synchronisation temps réel via Firebase.

> **Application web de Loup-Garou pour jeu en présentiel** - Multi-appareils avec synchronisation temps réel via Firebase.

**🎮 [Jouer maintenant](https://e-wolves.vercel.app/)** | Made by **KπX**

**🎮 [Jouer maintenant](https://e-wolves.vercel.app/)** | Made by **KπX**

---

---

## 🎯 Concept

## 📋 Table des Matières

**Loup-Garou** digitalise le célèbre jeu de société tout en préservant son essence sociale. Les joueurs sont **physiquement ensemble**, chacun utilise son téléphone comme carte numérique. La synchronisation Firebase permet à tous les appareils de voir les mêmes informations en temps réel.

1. [Concept](#-concept)

2. [Fonctionnalités](#-fonctionnalités)### Caractéristiques

3. [Démarrage Rapide](#-démarrage-rapide)

4. [Installation Complète](#-installation-complète)- 🎭 **8 rôles jouables** (Loup-Garou, Voyante, Sorcière, Cupidon, Chasseur, Voleur, Maire, Villageois)

5. [Configuration Firebase](#-configuration-firebase)- 🌙 **Phases nocturnes guidées** avec actions spécifiques par rôle

6. [Déploiement Vercel](#-déploiement-vercel)- 🗳️ **Votes électroniques** synchronisés entre tous les joueurs

7. [Architecture du Projet](#-architecture-du-projet)- 🔥 **Synchronisation Firebase** en temps réel multi-appareils

8. [Guide d'Utilisation](#-guide-dutilisation)- 📱 **Interface responsive** mobile-first

9. [Scripts Disponibles](#-scripts-disponibles)- 🎨 **Design moderne** avec thème sombre immersif

10. [Technologies Utilisées](#-technologies-utilisées)

11. [Contribuer](#-contribuer)## 🚀 Installation rapide

12. [Licence](#-licence)

```bash

---git clone https://github.com/KpihX/E-Wolves.git

cd E-Wolves

## 🎯 Conceptnpm install

# Configurer .env avec vos identifiants Firebase

**Loup-Garou** est une application web moderne qui digitalise le célèbre jeu de société tout en préservant son essence sociale et physique. Les joueurs sont **physiquement ensemble** autour d'une table, chacun utilise son téléphone comme carte numérique.npm run dev

```

### Pourquoi cette application ?

## 🎮 Comment jouer

- ✅ **Plus besoin de cartes physiques** - Chaque joueur consulte son rôle sur son téléphone

- ✅ **Synchronisation temps réel** - Tous les appareils voient les mêmes informations instantanément**Narrateur** : Créez une partie → Partagez le code 5 lettres  

- ✅ **Narrateur facilité** - Interface dédiée pour guider les phases du jeu**Joueurs** : Rejoignez avec le code → Attendez le démarrage

- ✅ **Votes électroniques** - Fini les confusions lors des votes

- ✅ **Multi-appareils** - Fonctionne sur smartphone, tablette, ordinateur## 🏗️ Stack Technique



### Philosophie- React 19.1 + TypeScript

- Firebase Realtime Database

Le jeu reste **100% social** : les joueurs discutent, débattent et s'amusent ensemble. L'application ne fait que remplacer les cartes papier et faciliter la gestion des phases de jeu.- Vite 5.4

- Vercel (hosting)

---

## 📝 Changelog v2.0

## ✨ Fonctionnalités

- ✨ Migration Firebase (sync temps réel)

### Pour le Narrateur 🎭- 🐛 Fix navigation et création partie

- 🎨 Favicon 🐺 + signature KπX

- **Création de partie** avec code unique à 5 lettres

- **Configuration des rôles** (recommandée ou avancée)## 📄 Licence

- **Interface complète** pour gérer toutes les phases du jeu

- **Vision globale** de tous les joueurs et leurs statutsMIT © 2024 KπX

- **Navigation guidée** entre les phases nocturnes et diurnes

- **Retour en arrière** possible en cas d'erreur---



### Pour les Joueurs 🎮<div align="center">



- **Rejoindre facilement** avec un code de partieMade with ❤️ by **KπX**  

- **Consulter son rôle** secret à tout moment🐺 **Bonne chasse aux Loups-Garous !** 🌙

- **Voter électroniquement** lors des phases diurnes

- **Actions spéciales** pour chaque rôle (Voyante, Sorcière, etc.)</div>

- **Interface adaptative** selon le rôle et la phase

### Rôles Disponibles 🎭

- 🐺 **Loup-Garou** - Élimine un villageois chaque nuit
- 🔮 **Voyante** - Découvre le rôle d'un joueur
- 🧪 **Sorcière** - Potion de vie OU potion de mort
- 💘 **Cupidon** - Désigne deux amoureux liés par le destin
- 🏹 **Chasseur** - Élimine un joueur en mourant
- 🎭 **Voleur** - Vole le rôle d'un autre joueur au début
- 👑 **Maire** - Voix compte double (élu par vote)
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

L'application sera accessible sur `http://localhost:3000`

---

## 📦 Installation Complète

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure) - [Télécharger](https://nodejs.org/)
- **npm** ou **yarn** (inclus avec Node.js)
- **Git** - [Télécharger](https://git-scm.com/)
- **Compte Firebase** (gratuit) - [Créer un compte](https://firebase.google.com/)
- **Compte Vercel** (gratuit, optionnel pour déploiement) - [Créer un compte](https://vercel.com/)

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

Cette commande installe :
- React 19.1
- TypeScript 5.2
- Vite 5.4
- Firebase SDK
- Toutes les dépendances nécessaires

#### 3️⃣ Configurer Firebase

Voir la section [Configuration Firebase](#-configuration-firebase) ci-dessous.

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

Firebase Realtime Database est utilisé pour la synchronisation en temps réel entre tous les appareils.

### Étape 1 : Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur **"Ajouter un projet"**
3. Donnez un nom à votre projet (ex: `loup-garou-app`)
4. Acceptez les conditions et créez le projet

### Étape 2 : Activer Realtime Database

1. Dans le menu latéral, allez dans **"Realtime Database"**
2. Cliquez sur **"Créer une base de données"**
3. Choisissez un emplacement (ex: `europe-west1`)
4. Démarrez en **mode test** (nous configurerons les règles après)

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

⚠️ **Note** : Ces règles permettent un accès public. Pour la production, considérez d'ajouter Firebase Authentication.

### Étape 4 : Récupérer les identifiants

1. Allez dans **Paramètres du projet** (⚙️ icône en haut)
2. Cliquez sur **"Général"**
3. Scrollez jusqu'à **"Vos applications"**
4. Cliquez sur l'icône **Web** (`</>`)
5. Enregistrez l'application (ex: "Loup-Garou Web")
6. Copiez les valeurs de configuration

### Étape 5 : Créer le fichier .env

À la racine du projet, créez un fichier `.env` :

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

⚠️ **Important** : Le fichier `.env` est déjà dans `.gitignore` et ne sera pas commité.

### Vérification

Lancez l'application :

```bash
npm run dev
```

Si tout est configuré correctement, vous devriez pouvoir créer et rejoindre des parties !

---

## ☁️ Déploiement Vercel

Vercel offre un hébergement gratuit avec CDN global pour les applications React.

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
4. Importez votre repository `E-Wolves`
5. Vercel détecte automatiquement Vite

#### 3️⃣ Configurer les variables d'environnement

Dans Vercel Dashboard :

1. Allez dans **Settings** > **Environment Variables**
2. Ajoutez **TOUTES** les variables `VITE_FIREBASE_*` de votre `.env`
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

# Suivez les instructions :
# - Set up and deploy? Yes
# - Scope? Votre compte
# - Link to existing project? No
# - Project name? e-wolves
# - Directory? ./
# - Override settings? No

# Ajouter les variables d'environnement
vercel env add VITE_FIREBASE_API_KEY
# Répétez pour toutes les variables

# Déployer en production
vercel --prod
```

### Mises à jour automatiques

Avec le déploiement GitHub, chaque push sur `main` déclenche automatiquement un nouveau déploiement !

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
├── 📁 components/              # Composants réutilisables
│   ├── Button.tsx              # Bouton stylisé
│   ├── Button.css
│   ├── Input.tsx               # Champ de saisie
│   ├── Input.css
│   ├── RoleCard.tsx            # Carte d'affichage de rôle
│   ├── RoleCard.css
│   ├── GameConfiguration.tsx   # Configuration des rôles
│   ├── GameOverModal.tsx       # Modal de fin de partie
│   └── ErrorDisplay.tsx        # Affichage d'erreurs
│
├── 📁 config/
│   └── firebase.ts             # Configuration Firebase
│
├── 📁 context/
│   └── GameContext.tsx         # État global du jeu (React Context)
│
├── 📁 hooks/
│   └── useErrorHandler.ts      # Hook pour gestion d'erreurs
│
├── 📁 pages/                   # Pages de l'application
│   ├── HomePage.tsx            # Écran d'accueil
│   ├── CreateGamePage.tsx      # Création de partie
│   ├── JoinGamePage.tsx        # Rejoindre une partie
│   ├── LobbyPage.tsx           # Lobby avant démarrage
│   ├── GameNarratorPage.tsx    # Interface narrateur
│   └── GamePlayerPage.tsx      # Interface joueur
│
├── 📁 services/
│   └── realtimeService.ts      # Logique métier + Firebase
│
├── 📁 types/
│   ├── index.ts                # Types TypeScript principaux
│   └── gameConfig.ts           # Types pour configuration
│
├── 📁 utils/
│   └── logger.ts               # Utilitaire de logging
│
├── App.tsx                     # Composant racine
├── index.tsx                   # Point d'entrée React
├── index.css                   # Styles globaux
├── index.html                  # HTML principal
├── vite.config.ts              # Configuration Vite
├── tsconfig.json               # Configuration TypeScript
├── package.json                # Dépendances npm
├── .env                        # Variables d'environnement (à créer)
├── .env.example                # Template .env
└── README.md                   # Ce fichier !
```

### Architecture logique

```
┌─────────────────────────────────────────────────────────┐
│                    FIREBASE REALTIME DB                  │
│              (Synchronisation temps réel)                │
└───────────────────────┬─────────────────────────────────┘
                        │
            ┌───────────┴────────────┐
            │                        │
┌───────────▼──────────┐   ┌────────▼──────────┐
│  realtimeService.ts  │   │  GameContext.tsx  │
│  (Business Logic)    │◄──┤  (State Manager)  │
└──────────────────────┘   └───────────────────┘
            │                        │
            └────────────┬───────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │  Pages  │    │  Hooks  │    │Components│
    └─────────┘    └─────────┘    └──────────┘
```

### Flux de données

1. **Utilisateur** interagit avec un **Component** ou une **Page**
2. **Action** déclenchée via **GameContext**
3. **GameContext** appelle **realtimeService**
4. **realtimeService** communique avec **Firebase**
5. **Firebase** notifie tous les clients connectés
6. **GameContext** met à jour l'état local
7. **Components** se re-rendent automatiquement

---

## 📖 Guide d'Utilisation

### Pour le Narrateur

#### 1. Créer une partie

1. Ouvrez l'application
2. Cliquez sur **"Créer une partie"**
3. Entrez votre nom de narrateur
4. Un code à 5 lettres est généré (ex: `ABCDE`)
5. **Partagez ce code** aux joueurs

#### 2. Attendre les joueurs

- Les joueurs rejoignent avec le code
- Vous voyez la liste se remplir en temps réel
- Attendez que tout le monde soit là

#### 3. Configurer les rôles

**Mode Recommandé** (automatique) :
- L'application suggère une configuration équilibrée
- Basée sur le nombre de joueurs
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

#### 5. Gérer les phases

**Phase nocturne** :
- Suivez l'ordre des tours (Voleur → Cupidon → Loups → Voyante → Sorcière)
- Cliquez sur **"Phase suivante"** après chaque action
- L'application vous guide

**Phase diurne** :
- Annoncez les morts de la nuit
- Gérez le vote du village
- Éliminez le joueur avec majorité

#### 6. Terminer la partie

- L'application détecte automatiquement la victoire
- Loups gagnent si ≥ Villageois
- Village gagne si tous les Loups éliminés
- Amoureux gagnent dans certaines conditions

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

### Maintenance

```bash
# Installer les dépendances
npm install

# Mettre à jour les packages
npm update

# Nettoyer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
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

### Outils de Développement

- **ESLint** - Linting JavaScript/TypeScript
- **Git** - Contrôle de version
- **npm** - Gestionnaire de packages

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

Les contributions sont les bienvenues ! Voici comment participer :

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

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, point-virgules manquants, etc.
- `refactor:` Refactoring de code
- `test:` Ajout de tests
- `chore:` Tâches de maintenance

### Idées de contributions

- 🌐 Traductions (anglais, espagnol, etc.)
- 🎨 Nouveaux thèmes visuels
- 🎭 Nouveaux rôles de jeu
- 🐛 Corrections de bugs
- 📱 Améliorations mobile
- ♿ Accessibilité

---

## 📄 Licence

MIT © 2024 KπX

Vous êtes libre de :
- ✅ Utiliser ce projet à des fins personnelles ou commerciales
- ✅ Modifier le code source
- ✅ Distribuer votre version
- ✅ Utiliser à des fins privées

Sous conditions de :
- 📋 Inclure la licence et le copyright dans toute copie
- 📋 Ne pas tenir l'auteur responsable

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

### Signaler un Bug

Si vous trouvez un bug, ouvrez une [Issue](https://github.com/KpihX/E-Wolves/issues) avec :
- 🐛 Description du problème
- 📱 Appareil utilisé (mobile/desktop)
- 🌐 Navigateur et version
- 📸 Captures d'écran si possible
- 🔄 Étapes pour reproduire

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

## 🎓 FAQ

### Questions Générales

**Q : L'application fonctionne-t-elle hors ligne ?**  
R : Non, Firebase nécessite une connexion internet pour la synchronisation.

**Q : Combien de joueurs maximum ?**  
R : Pas de limite technique, mais recommandé 4-15 joueurs pour une bonne expérience.

**Q : Les parties sont-elles sauvegardées ?**  
R : Les parties sont supprimées automatiquement après 24h d'inactivité.

**Q : Puis-je jouer seul pour tester ?**  
R : Oui ! Ouvrez plusieurs onglets/appareils avec le même code.

### Questions Techniques

**Q : Pourquoi Vite et pas Create React App ?**  
R : Vite est beaucoup plus rapide (HMR instantané) et moderne.

**Q : Puis-je utiliser un autre backend que Firebase ?**  
R : Oui, mais vous devrez adapter `realtimeService.ts`.

**Q : Comment activer HTTPS en local ?**  
R : `vite --https` (certificat auto-signé)

**Q : Les variables VITE_* sont-elles sécurisées ?**  
R : Elles sont exposées côté client. N'y mettez jamais de clés privées !

### Problèmes Courants

**Q : "Permission denied" sur Firebase**  
R : Vérifiez vos règles de sécurité Firebase (voir section Configuration).

**Q : Build échoue avec des erreurs TypeScript**  
R : Lancez `npm run type-check` pour identifier les erreurs.

**Q : L'app ne se connecte pas à Firebase**  
R : Vérifiez que toutes les variables `VITE_FIREBASE_*` sont dans `.env`.

---

## 🙏 Remerciements

- **L'équipe React** pour ce framework incroyable
- **Firebase** pour la base de données temps réel gratuite
- **Vercel** pour l'hébergement simple et puissant
- **La communauté open-source** pour l'inspiration

---

<div align="center">

## 🎮 Prêt à jouer ?

### [🐺 Lancez une partie maintenant !](https://e-wolves.vercel.app/)

Made with ❤️ by **KπX**

🌙 **Bonne chasse aux Loups-Garous !** 🐺

---

⭐ **Si vous aimez ce projet, donnez-lui une étoile sur GitHub !** ⭐

</div>
