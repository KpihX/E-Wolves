// FIX: Removed invalid file markers causing parsing errors.
// FIX: Implementing the RoleCard component.
import React from 'react';
import { Role } from '../types';

interface RoleCardProps {
  role: Role;
  isMayor: boolean;
  partnerName?: string;
  isStolen?: boolean; // Si le joueur a été volé par le voleur
}

const roleDetails: Record<Role, { title: string; description: string; emoji: string }> = {
  VILLAGER: {
    title: 'Villageois',
    description: "Votre but est d'éliminer tous les Loups-Garous. Utilisez votre intuition et votre pouvoir de persuasion.",
    emoji: '🧑‍🌾'
  },
  WEREWOLF: {
    title: 'Loup-Garou',
    description: 'Chaque nuit, vous vous réunissez pour dévorer un villageois. Le jour, vous vous faites passer pour un innocent.',
    emoji: '🐺'
  },
  SEER: {
    title: 'Voyante',
    description: "Chaque nuit, vous pouvez découvrir le vrai rôle d'un joueur. Aidez les villageois sans vous faire démasquer.",
    emoji: '🔮'
  },
  HUNTER: {
    title: 'Chasseur',
    description: "Si vous mourez, vous devez choisir un autre joueur qui mourra immédiatement avec vous.",
    emoji: '🎯'
  },
  WITCH: {
    title: 'Sorcière',
    description: "Vous avez deux potions : une pour sauver une personne de la mort, et une pour empoisonner quelqu'un. Chaque potion ne peut être utilisée qu'une fois.",
    emoji: '🧪'
  },
  CUPID: {
    title: 'Cupidon',
    description: "La première nuit, vous devez désigner deux joueurs qui tomberont éperdument amoureux. Si l'un meurt, l'autre meurt de chagrin.",
    emoji: '💘'
  },
  THIEF: {
    title: 'Voleur',
    description: "Lors de la Nuit 0, vous devez choisir un joueur dont vous volerez le rôle. Votre victime deviendra un simple villageois. Désignez discrètement votre cible au narrateur.",
    emoji: '🎭'
  },
  LITTLE_GIRL: {
    title: 'Petite Fille',
    description: "Pendant la nuit des Loups-Garous, vous pouvez discrètement espionner pour découvrir leur identité. Attention à ne pas vous faire prendre !",
    emoji: '👧'
  }
};


export const RoleCard: React.FC<RoleCardProps> = ({ role, isMayor, partnerName, isStolen }) => {
  const details = roleDetails[role];

  if (!details) {
    return (
      <div>
        <h2>Rôle non attribué</h2>
        <p>Veuillez attendre le début de la partie.</p>
      </div>
    );
  }

  // Description spéciale pour un joueur volé
  const stolenDescription = "⚠️ Votre rôle original a été volé par le Voleur ! Vous êtes maintenant un simple Villageois. Votre but est d'éliminer tous les Loups-Garous en utilisant votre intuition et votre pouvoir de persuasion.";

  return (
    <div style={{ 
        padding: '2rem', 
        border: '2px solid var(--secondary-color)', 
        borderRadius: '12px',
        backgroundColor: 'var(--primary-color-light)',
        textAlign: 'center',
        maxWidth: '400px',
        margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>{details.emoji}</h1>
      <h2 style={{ fontSize: '2rem', color: 'var(--accent-color)', margin: '0.5rem 0' }}>{details.title}</h2>
      {isMayor && <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>👑 MAIRE DU VILLAGE 👑</p>}
      {isStolen && (
        <div style={{ 
          backgroundColor: '#ff4444', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '8px', 
          fontWeight: 'bold',
          fontSize: '1.1rem',
          margin: '0.5rem 0'
        }}>
          🎭 RÔLE VOLÉ 🎭
        </div>
      )}
      <p style={{ opacity: 0.9 }}>{isStolen ? stolenDescription : details.description}</p>
      {partnerName && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--secondary-color)' }}>
            <p style={{fontSize: '1.2rem'}}>❤️ En couple avec <strong>{partnerName}</strong></p>
        </div>
      )}
    </div>
  );
};