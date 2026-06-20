export interface User {
  id: string;
  username: string;
  role: 'animateur' | 'jeune';
  active_skin: string;
  unlocked_skins: string[];
}

export interface Transaction {
  id: string;
  jeune_id: string;
  amount: number;
  reason: string;
  is_privilege: boolean;
  privilege_status: 'none' | 'pending' | 'granted';
  created_at: string;
}

export interface SkinConfig {
  name: string;
  cost: number;
  type: 'digital';
  classes: {
    bg: string;
    text: string;
    accent: string;
    card: string;
    button: string;
  };
}

export interface Privilege {
  name: string;
  cost: number;
  type: 'irl';
  description: string;
}
