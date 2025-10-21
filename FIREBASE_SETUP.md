# 🔥 Guide d'Installation Firebase pour E-Wolves

Ce guide vous explique comment configurer Firebase pour activer la synchronisation multi-appareils.

---

## 📋 Étape 1 : Créer un Projet Firebase

1. **Allez sur Firebase Console** : https://console.firebase.google.com/

2. **Créez un nouveau projet** :
   - Cliquez sur "Ajouter un projet"
   - Nom du projet : `e-wolves` (ou votre choix)
   - Désactivez Google Analytics (optionnel)
   - Cliquez sur "Créer le projet"

3. **Attendez la création** (~30 secondes)

---

## 📋 Étape 2 : Activer Realtime Database

1. Dans le menu latéral, cliquez sur **"Realtime Database"**

2. Cliquez sur **"Créer une base de données"**

3. **Choisissez l'emplacement** :
   - Europe : `europe-west1` (recommandé pour la France)
   - USA : `us-central1`

4. **Mode de sécurité** :
   - Choisissez **"Mode test"** pour commencer
   - ⚠️ **Important** : Cela permet l'accès en lecture/écriture pendant 30 jours

5. **Règles de sécurité recommandées** :

Allez dans l'onglet "Règles" et remplacez par :

```json
{
  "rules": {
    "games": {
      "$gameCode": {
        ".read": true,
        ".write": true,
        ".indexOn": ["gameCode"]
      }
    }
  }
}
```

---

## 📋 Étape 3 : Obtenir les Clés de Configuration

1. Dans Firebase Console, cliquez sur **l'icône ⚙️** (Paramètres du projet)

2. Allez dans **"Vos applications"**

3. Cliquez sur **l'icône Web** `</>` pour créer une Web App

4. **Nom de l'application** : `E-Wolves Web`

5. **Cochez "Configurer Firebase Hosting"** (optionnel)

6. Cliquez sur **"Enregistrer l'application"**

7. **Copiez la configuration** qui ressemble à :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "e-wolves-xxxxx.firebaseapp.com",
  databaseURL: "https://e-wolves-xxxxx-default-rtdb.firebaseio.com",
  projectId: "e-wolves-xxxxx",
  storageBucket: "e-wolves-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## 📋 Étape 4 : Configurer les Variables d'Environnement

1. **Créez un fichier `.env`** à la racine du projet :

```bash
# Dans PowerShell
New-Item -Path ".env" -ItemType File
```

2. **Ajoutez vos clés Firebase** (remplacez par vos vraies valeurs) :

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=e-wolves-xxxxx.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://e-wolves-xxxxx-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=e-wolves-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=e-wolves-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

3. **Vérifiez que `.env` est dans `.gitignore`** ✅ (déjà fait)

---

## 📋 Étape 5 : Configurer Vercel (Variables d'Environnement)

Pour que le déploiement Vercel fonctionne avec Firebase :

### Option A : Via Dashboard Vercel (Recommandé)

1. Allez sur https://vercel.com/kamdem-ivanns-projects/e-wolves

2. Cliquez sur **"Settings"** > **"Environment Variables"**

3. **Ajoutez chaque variable** :
   - Name : `VITE_FIREBASE_API_KEY`
   - Value : `AIzaSy...` (votre vraie clé)
   - Environments : Cochez `Production`, `Preview`, `Development`
   - Cliquez sur "Save"

4. **Répétez pour toutes les variables** :
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_DATABASE_URL`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### Option B : Via CLI Vercel

```powershell
vercel env add VITE_FIREBASE_API_KEY production
# Entrez la valeur quand demandé
# Répétez pour chaque variable
```

---

## 📋 Étape 6 : Tester Localement

1. **Installez les dépendances** (déjà fait) :
```powershell
npm install
```

2. **Lancez le serveur de développement** :
```powershell
npm run dev
```

3. **Testez la synchronisation** :
   - Ouvrez l'app dans 2 onglets différents
   - Créez une partie dans l'onglet 1
   - Rejoignez avec le code dans l'onglet 2
   - ✅ Vous devriez voir les joueurs se synchroniser !

---

## 📋 Étape 7 : Déployer sur Vercel

```powershell
# Build
npm run build

# Déploiement
vercel --prod
```

✅ **C'est fait !** Votre app est maintenant multi-appareils ! 🎉

---

## 🔍 Vérification Firebase Console

Pour voir les données en temps réel :

1. Allez dans **Firebase Console** > **Realtime Database**
2. Vous verrez une structure comme :

```json
{
  "games": {
    "ABCDE": {
      "gameCode": "ABCDE",
      "players": [...],
      "phase": "LOBBY",
      ...
    }
  }
}
```

---

## 🐛 Dépannage

### Problème : "Firebase not defined"

**Solution** : Vérifiez que `.env` contient bien toutes les variables.

### Problème : "Permission denied"

**Solution** : Vérifiez les règles de sécurité Firebase (Étape 2.5).

### Problème : Parties pas synchronisées

**Solution** : 
1. Ouvrez la Console du navigateur (F12)
2. Vérifiez s'il y a des erreurs Firebase
3. Vérifiez que `databaseURL` est correct dans `.env`

---

## 📊 Limites Firebase (Plan Gratuit)

- **Connexions simultanées** : 100
- **Stockage** : 1 GB
- **Téléchargement** : 10 GB/mois
- **Requêtes** : Illimitées

✅ **Largement suffisant pour E-Wolves !**

---

## 🔒 Sécurité Production (Recommandé)

Pour la production, améliorez les règles Firebase :

```json
{
  "rules": {
    "games": {
      "$gameCode": {
        ".read": "auth == null || auth.uid != null",
        ".write": "auth == null || auth.uid != null",
        ".validate": "newData.hasChildren(['gameCode', 'players', 'phase'])",
        "$field": {
          ".validate": "true"
        }
      }
    }
  }
}
```

---

## ✅ Checklist Finale

- [ ] Projet Firebase créé
- [ ] Realtime Database activée
- [ ] Règles de sécurité configurées
- [ ] Clés Firebase copiées
- [ ] Fichier `.env` créé localement
- [ ] Variables d'environnement ajoutées sur Vercel
- [ ] Test local réussi
- [ ] Déployé sur Vercel
- [ ] Test multi-appareils réussi

**Besoin d'aide ?** Ouvrez une issue GitHub ! 🚀
