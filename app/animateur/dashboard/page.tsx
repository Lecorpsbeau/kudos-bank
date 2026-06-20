'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AnimateurDashboard() {
  const [jeunes, setJeunes] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedJeune, setSelectedJeune] = useState('');
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<'jeunes' | 'requests'>('jeunes');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: j } = await supabase.from('leaderboard').select('*');
    setJeunes(j || []);

    const { data: r } = await supabase
      .from('requests')
      .select('*, users!jeune_id(username)')
      .order('created_at', { ascending: false });
    setRequests(r || []);
  };

  const handleTransaction = async () => {
    if (!selectedJeune || amount === 0) return;
    const animateurId = localStorage.getItem('userId');
    
    const { error } = await supabase.from('transactions').insert({
      jeune_id: selectedJeune,
      animateur_id: animateurId,
      amount: amount,
      reason: reason || (amount > 0 ? 'Dépôt' : 'Retrait')
    });

    if (!error) {
      setMessage('Transaction effectuée !');
      setAmount(0);
      setReason('');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    const animateurId = localStorage.getItem('userId');
    const req = requests.find(r => r.id === requestId);
    
    await supabase.from('requests').update({
      status,
      animateur_id: animateurId
    }).eq('id', requestId);

    if (status === 'approved' && req) {
      const sign = req.type === 'depot' ? 1 : -1;
      await supabase.from('transactions').insert({
        jeune_id: req.jeune_id,
        animateur_id: animateurId,
        amount: req.amount * sign,
        reason: `${req.type === 'depot' ? 'Dépôt' : 'Retrait'}: ${req.reason}`
      });
    }

    loadData();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">👑 Dashboard Animateur</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('jeunes')}
          className={`px-4 py-2 rounded-lg font-bold ${tab === 'jeunes' ? 'bg-purple-600' : 'bg-gray-700'}`}
        >
          👥 Jeunes ({jeunes.length})
        </button>
        <button
          onClick={() => setTab('requests')}
          className={`px-4 py-2 rounded-lg font-bold relative ${tab === 'requests' ? 'bg-purple-600' : 'bg-gray-700'}`}
        >
          📋 Demandes
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {requests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {message && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4 text-center">
          {message}
        </div>
      )}

      {/* Onglet Jeunes */}
      {tab === 'jeunes' && (
        <>
          {/* Transaction rapide */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">⚡ Transaction rapide</h2>
            <select
              value={selectedJeune}
              onChange={(e) => setSelectedJeune(e.target.value)}
              className="w-full bg-gray-700 rounded-lg p-3 mb-3 text-white"
            >
              <option value="">Sélectionner un jeune</option>
              {jeunes.map(j => (
                <option key={j.id} value={j.id}>{j.username} ({j.balance} Kudos)</option>
              ))}
            </select>
            <div className="flex gap-3 mb-3">
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="flex-1 bg-gray-700 rounded-lg p-3 text-white"
                placeholder="Montant (+ ou -)"
              />
              <button
                onClick={() => setAmount(Math.abs(amount))}
                className="bg-green-600 px-4 rounded-lg text-sm font-bold"
              >
                +
              </button>
              <button
                onClick={() => setAmount(-Math.abs(amount))}
                className="bg-red-600 px-4 rounded-lg text-sm font-bold"
              >
                -
              </button>
            </div>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-700 rounded-lg p-3 mb-3 text-white"
              placeholder="Motif"
            />
            <button
              onClick={handleTransaction}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold"
            >
              Valider la transaction
            </button>
          </div>

          {/* Liste des jeunes */}
          <h2 className="text-lg font-bold mb-3">📊 Classement</h2>
          <div className="space-y-2">
            {jeunes.map((jeune, index) => (
              <div key={jeune.id} className="bg-gray-800 rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <span className="font-bold">{jeune.username}</span>
                </div>
                <span className="text-purple-400 font-bold">{jeune.balance} Kudos</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Onglet Demandes */}
      {tab === 'requests' && (
        <div className="space-y-3">
          {requests.filter(r => r.status === 'pending').length === 0 && (
            <p className="text-center text-gray-500 py-8">Aucune demande en attente</p>
          )}
          {requests.filter(r => r.status === 'pending').map((req) => (
            <div key={req.id} className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold">
                    {(req as any).users?.username}
                  </p>
                  <p className="text-sm text-gray-400">
                    {req.type === 'depot' ? '💰 Dépôt' : '🏦 Retrait'} : {req.reason}
                  </p>
                  <p className="text-lg font-bold text-purple-400 mt-1">
                    {req.amount} Kudos
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(req.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRequest(req.id, 'approved')}
                  className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold text-sm"
                >
                  ✅ Accepter
                </button>
                <button
                  onClick={() => handleRequest(req.id, 'rejected')}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-bold text-sm"
                >
                  ❌ Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
