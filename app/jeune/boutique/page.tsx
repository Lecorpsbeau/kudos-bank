'use client';

import { useState } from 'react';
import { useSkin } from '@/components/SkinsProvider';
import { SKINS, PRIVILEGES } from '@/lib/skins';
import { supabase } from '@/lib/supabase';

export default function BoutiquePage() {
  const { skinClasses } = useSkin();
  const [message, setMessage] = useState('');
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  const handleAchat = async (itemName: string, cost: number, type: 'digital' | 'irl') => {
    if (!userId) return;

    try {
      const { data: balance } = await supabase.rpc('get_balance', { user_id: userId });
      
      if (!balance || balance < cost) {
        setMessage('Solde insuffisant !');
        return;
      }

      const { error } = await supabase
        .from('transactions')
        .insert({
          jeune_id: userId,
          amount: -cost,
          reason: `Achat: ${itemName}`,
          is_privilege: type === 'irl',
          privilege_status: type === 'irl' ? 'pending' : 'none'
        });

      if (error) throw error;

      setMessage('Achat réussi !');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Erreur lors de l\'achat');
    }
  };

  return (
    <div className={`${skinClasses.bg} min-h-screen p-6`}>
      <h1 className="text-3xl font-bold mb-8">🛍️ Boutique</h1>
      
      {message && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
          {message}
        </div>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Skins Numériques</h2>
        <div className="grid gap-4">
          {SKINS.filter(s => s.name !== 'classic').map((skin) => (
            <div key={skin.name} className={`${skinClasses.card} p-4 rounded-xl`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg capitalize">{skin.name}</h3>
                  <p className={`${skinClasses.accent}`}>{skin.cost} Kudos</p>
                </div>
                <button
                  onClick={() => handleAchat(skin.name, skin.cost, 'digital')}
                  className={`${skinClasses.button} px-4 py-2 rounded-lg`}
                >
                  Acheter
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Privilèges IRL</h2>
        <div className="grid gap-4">
          {PRIVILEGES.map((privilege) => (
            <div key={privilege.name} className={`${skinClasses.card} p-4 rounded-xl`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{privilege.description}</h3>
                  <p className={`${skinClasses.accent}`}>{privilege.cost} Kudos</p>
                </div>
                <button
                  onClick={() => handleAchat(privilege.name, privilege.cost, 'irl')}
                  className={`${skinClasses.button} px-4 py-2 rounded-lg`}
                >
                  Acheter
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
