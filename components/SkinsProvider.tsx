'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getSkinConfig } from '@/lib/skins';

interface SkinContextType {
  activeSkin: string;
  skinClasses: any;
  setSkin: (skinName: string) => Promise<void>;
}

const SkinContext = createContext<SkinContextType>(null!);

export default function SkinsProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [activeSkin, setActiveSkin] = useState('classic');

  useEffect(() => {
    loadUserSkin();
  }, [userId]);

  const loadUserSkin = async () => {
    const { data: user } = await supabase
      .from('users')
      .select('active_skin')
      .eq('id', userId)
      .single();
    
    if (user) {
      setActiveSkin(user.active_skin);
    }
  };

  const setSkin = async (skinName: string) => {
    await supabase
      .from('users')
      .update({ active_skin: skinName })
      .eq('id', userId);
    
    setActiveSkin(skinName);
  };

  const skinConfig = getSkinConfig(activeSkin);

  return (
    <SkinContext.Provider value={{ activeSkin, skinClasses: skinConfig.classes, setSkin }}>
      {children}
    </SkinContext.Provider>
  );
}

export function useSkin() {
  return useContext(SkinContext);
}
