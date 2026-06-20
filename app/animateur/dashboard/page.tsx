'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AnimateurDashboard() {
  const [jeunes, setJeunes] = useState<any[]>([]);
  const [selectedJeune, setSelectedJeune] = useState('');
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadJeunes();
  }, []);

  const loadJeunes = async () => {
    const { data } = await supabase
      .from('leaderboard')
      .select('*');
    setJeunes(data || []);
  };

  const handleTransaction = async () => {
    const animateurId = localStorage.getItem('userId');
    await supabase.from('transactions').insert({
      jeune_id: selectedJeune,
      animateur_id: animateurId,
      amount: amount,
      reason: reason
    });
    loadJeunes();
    setAmount(0);
    setReason('');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Animateur</h1>
      
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Transaction rapide</h2>
        <select
          value={selectedJeune}
          onChange={(e) => setSelectedJeune(e.target.value)}
          className="w-full bg-gray-700 rounded-lg p-2 mb-4"
        >
          <option value="">Sélectionner un jeune</option>
          {jeunes.map(j => (
            <option key={j.id} value={j.id}>{j.username} ({j.balance} Kudos)</option>
          ))}
        </select>
        
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full bg-gray-700 rounded-lg p-2 mb-4"
          placeholder="Montant (+ ou -)"
        />
        
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full bg-gray-700 rounded-lg p-2 mb-4"
          placeholder="Motif"
        />
        
        <button
          onClick={handleTransaction}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
        >
          Valider
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Liste des jeunes</h2>
      <div className="space-y-3">
        {jeunes.map(jeune => (
          <div key={jeune.id} className="bg-gray-800 rounded-xl p-4 flex justify-between">
            <span>{jeune.username}</span>
            <span className="text-purple-400">{jeune.balance} Kudos</span>
          </div>
        ))}
      </div>
    </div>
  );
}
