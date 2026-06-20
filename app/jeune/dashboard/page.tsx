'use client';

import { useState, useEffect } from 'react';
import { supabase, getBalance } from '@/lib/supabase';
import { useSkin } from '@/components/SkinsProvider';

export default function JeuneDashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { skinClasses } = useSkin();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  const loadData = async () => {
    const bal = await getBalance(userId!);
    setBalance(bal);

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('jeune_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    setTransactions(data || []);
  };

  return (
    <div className={`${skinClasses.bg} min-h-screen p-6`}>
      <div className={`${skinClasses.card} p-6 rounded-2xl mb-6`}>
        <h1 className="text-2xl font-bold mb-2">Ton Solde</h1>
        <p className="text-4xl font-bold text-purple-400">{balance} Kudos</p>
      </div>

      <h2 className="text-xl font-bold mb-4">Historique</h2>
      <div className="space-y-3">
        {transactions.map((tx: any) => (
          <div key={tx.id} className={`${skinClasses.card} p-4 rounded-xl`}>
            <div className="flex justify-between">
              <span>{tx.reason}</span>
              <span className={tx.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
