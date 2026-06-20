import { SkinConfig, Privilege } from '@/types';

export const SKINS: SkinConfig[] = [
  {
    name: 'classic',
    cost: 0,
    type: 'digital',
    classes: {
      bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
      text: 'text-white',
      accent: 'text-purple-400',
      card: 'bg-gray-800/50 backdrop-blur-lg',
      button: 'bg-purple-600 hover:bg-purple-700',
    }
  },
  {
    name: 'cyberpunk',
    cost: 150,
    type: 'digital',
    classes: {
      bg: 'bg-gradient-to-br from-purple-900 via-violet-900 to-blue-900',
      text: 'text-cyan-300',
      accent: 'text-pink-400',
      card: 'bg-purple-800/30 backdrop-blur-lg border-purple-500/30',
      button: 'bg-cyan-500 hover:bg-cyan-600 text-purple-900',
    }
  },
  {
    name: 'espace',
    cost: 300,
    type: 'digital',
    classes: {
      bg: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-black',
      text: 'text-blue-200',
      accent: 'text-yellow-300',
      card: 'bg-indigo-900/20 backdrop-blur-lg border-blue-500/20',
      button: 'bg-indigo-600 hover:bg-indigo-700',
    }
  },
  {
    name: 'royal',
    cost: 500,
    type: 'digital',
    classes: {
      bg: 'bg-gradient-to-br from-amber-900 via-yellow-900 to-amber-950',
      text: 'text-amber-100',
      accent: 'text-yellow-300',
      card: 'bg-amber-800/30 backdrop-blur-lg border-amber-400/30',
      button: 'bg-amber-500 hover:bg-amber-600 text-amber-900',
    }
  }
];

export const PRIVILEGES: Privilege[] = [
  {
    name: "choisir_musique",
    cost: 100,
    type: 'irl',
    description: "Choisir la musique du réveil de la colo"
  },
  {
    name: "joker_vaisselle",
    cost: 250,
    type: 'irl',
    description: "Joker : Sauter une corvée de vaisselle"
  },
  {
    name: "gouter_vip",
    cost: 400,
    type: 'irl',
    description: "Goûter VIP avec l'équipe d'animation"
  }
];

export function getSkinConfig(skinName: string): SkinConfig {
  return SKINS.find(s => s.name === skinName) || SKINS[0];
}
