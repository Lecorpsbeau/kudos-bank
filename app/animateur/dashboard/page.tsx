'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AnimateurDashboard() {
  const [jeunes, setJeunes] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedJeune, setSelectedJeune] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<'jeunes' | 'requests'>('jeunes');
  const [search, setSearch] = useState('');

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
    if (!selectedJeune || amount === '' || amount === 0) return;
    const animateurId = localStorage.getItem('userId');
    
    const { error } = await supabase.from('transactions').insert({
      jeune_id: selectedJeune,
      animateur_id: animateurId,
      amount: Number(amount),
      reason: reason || (Number(amount) > 0 ? 'Dépôt administrateur' : 'Retrait administrateur')
    });

    if (!error) {
      setMessage('✅ Transaction effectuée !');
      setAmount('');
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
        reason: `${req.type === 'depot' ? '💰 Dépôt' : '🏦 Retrait'} accepté: ${req.reason}`
      });
    }

    setMessage(status === 'approved' ? '✅ Demande acceptée !' : '❌ Demande refusée');
    loadData();
    setTimeout(() => setMessage(''), 3000);
  };

  const jeunesFiltres = jeunes.filter(j => 
    j.username.toLowerCase().includes(search.toLowerCase())
  );

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const historiqueRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">👑 Dashboard</h1>
        <div className="flex gap-1">
          <button
            onClick={() => setTab('jeunes')}
            className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${tab === 'jeunes' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}
          >
            👥 Jeunes
          </button>
          <button
            onClick={() => setTab('requests')}
            className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors relative ${tab === 'requests' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}
          >
            📋 Demandes
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4 text-center text-sm animate-pulse">
          {message}
        </div>
      )}

      {/* === ONGLET JEUNES === */}
      {tab === 'jeunes' && (
        <>
          {/* Transaction rapide */}
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 mb-4 border border-gray-700/50">
            <h2 className="font-bold mb-3">⚡ Transaction rapide</h2>
            
            <select
              value={selectedJeune}
              onChange={(e) => setSelectedJeune(e.target.value)}
              className="w-full bg-gray-700 rounded-xl p-3 mb-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choisir un jeune...</option>
              {jeunes.map(j => (
                <option key={j.id} value={j.id}>{j.username} — {j.balance} Kudos</option>
              ))}
            </select>

            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="flex-1 bg-gray-700 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Montant"
              />
              <button
                onClick={() => setAmount(Math.abs(Number(amount || 0)))}
                className="bg-green-600 hover:bg-green-700 px-4 rounded-xl font-bold text-lg transition-colors"
              >
                +
              </button>
              <button
                onClick={() => setAmount(-Math.abs(Number(amount || 0)))}
                className="bg-red-600 hover:bg-red-700 px-4 rounded-xl font-bold text-lg transition-colors"
              >
                −
              </button>
            </div>

            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-700 rounded-xl p-3 mb-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Motif (optionnel)"
            />

            <button
              onClick={handleTransaction}
              disabled={!selectedJeune || amount === '' || amount === 0}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-bold transition-colors"
            >
              Valider
            </button>
          </div>

          {/* Recherche */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800/50 rounded-xl p-3 mb-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700/50"
            placeholder="🔍 Rechercher un jeune..."
          />

          {/* Liste */}
          <div className="space-y-1.5">
            {jeunesFiltres.map((jeune, index) => (
              <div
                key={jeune.id}
                onClick={() => setSelectedJeune(jeune.id)}
                className={`bg-gray-800/30 rounded-xl p-3 flex justify-between items-center cursor-pointer transition-colors hover:bg-gray-800/50 ${
                  selectedJeune === jeune.id ? 'ring-2 ring-purple-500 bg-gray-800/50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm w-5 text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </span>
                  <span className="font-medium text-sm">{jeune.username}</span>
                </div>
                <span className="text-purple-400 font-bold text-sm">{jeune.balance} K</span>
              </div>
            ))}
            {jeunesFiltres.length === 0 && (
              <p className="text-center text-gray-500 py-8 text-sm">Aucun résultat</p>
            )}
          </div>
        </>
      )}

      {/* === ONGLET DEMANDES === */}
      {tab === 'requests' && (
        <>
          {/* En attente */}
          {pendingRequests.length > 0 && (
            <div className="mb-6">
              <h2 className="font-bold mb-3 text-yellow-400">⏳ En attente</h2>
              <div className="space-y-2">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="bg-gray-800/50 rounded-xl p-4 border border-yellow-500/20">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-sm">{(req as any).users?.username}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{req.reason}</p>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(req.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className={`text-lg font-bold mb-3 ${req.type === 'depot' ? 'text-green-400' : 'text-red-400'}`}>
                      {req.type === 'depot' ? '+' : '−'}{req.amount} Kudos
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequest(req.id, 'approved')}
                        className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold text-xs transition-colors"
                      >
                        ✅ Accepter
                      </button>
                      <button
                        onClick={() => handleRequest(req.id, 'rejected')}
                        className="flex-1 bg-red-600/30 hover:bg-red-600/50 py-2 rounded-lg font-bold text-xs text-red-300 transition-colors"
                      >
                        ❌ Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historique */}
          {historiqueRequests.length > 0 && (
            <div>
              <h2 className="font-bold mb-3 text-gray-400">📜 Historique</h2>
              <div className="space-y-1.5">
                {historiqueRequests.map((req) => (
                  <div key={req.id} className="bg-gray-800/20 rounded-xl p-3 flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{(req as any).users?.username}</span>
                      <span className="text-gray-500 text-xs ml-2">{req.reason}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={req.type === 'depot' ? 'text-green-400' : 'text-red-400'}>
                        {req.type === 'depot' ? '+' : '−'}{req.amount}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${req.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {req.status === 'approved' ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pendingRequests.length === 0 && historiqueRequests.length === 0 && (
            <p className="text-center text-gray-500 py-12">Aucune demande</p>
          )}
        </>
      )}
    </div>
  );
}
