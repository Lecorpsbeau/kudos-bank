'use client';

import { useState, useEffect } from 'react';
import { supabase, getBalance } from '@/lib/supabase';
import { useSkin } from '@/components/SkinsProvider';

export default function JeuneDashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [showRequest, setShowRequest] = useState(false);
  const [requestType, setRequestType] = useState<'depot' | 'retrait'>('depot');
  const [requestAmount, setRequestAmount] = useState(0);
  const [requestReason, setRequestReason] = useState('');
  const [message, setMessage] = useState('');
  const { skinClasses } = useSkin();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  const loadData = async () => {
    const bal = await getBalance(userId!);
    setBalance(bal);

    const { data: tx } = await supabase
      .from('transactions')
      .select('*')
      .eq('jeune_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    setTransactions(tx || []);

    const { data: req } = await supabase
      .from('requests')
      .select('*')
      .eq('jeune_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    setRequests(req || []);
  };

  const handleRequest = async () => {
    if (!userId || requestAmount <= 0) return;

    const { error } = await supabase
      .from('requests')
      .insert({
        jeune_id: userId,
        type: requestType,
        amount: requestAmount,
        reason: requestReason || (requestType === 'depot' ? 'Demande de dépôt' : 'Demande de retrait')
      });

    if (error) {
      setMessage('Erreur lors de la demande');
    } else {
      setMessage('Demande envoyée !');
      setShowRequest(false);
      setRequestAmount(0);
      setRequestReason('');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      approved: 'bg-green-500/20 text-green-300',
      rejected: 'bg-red-500/20 text-red-300'
    };
    const labels: any = {
      pending: 'En attente',
      approved: 'Accepté',
      rejected: 'Refusé'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className={`${skinClasses.bg} min-h-screen p-6`}>
      {/* Solde */}
      <div className={`${skinClasses.card} p-8 rounded-2xl mb-6 text-center`}>
        <p className="text-sm opacity-70 mb-2">Ton solde</p>
        <p className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {balance}
        </p>
        <p className="text-sm opacity-70 mt-2">Kudos</p>
      </div>

      {/* Boutons d'action */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => { setRequestType('depot'); setShowRequest(true); }}
          className={`${skinClasses.button} p-4 rounded-xl font-bold text-lg`}
        >
          💰 Déposer
        </button>
        <button
          onClick={() => { setRequestType('retrait'); setShowRequest(true); }}
          className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 p-4 rounded-xl font-bold text-lg text-red-300"
        >
          🏦 Retirer
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4 text-center">
          {message}
        </div>
      )}

      {/* Formulaire de demande */}
      {showRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">
              {requestType === 'depot' ? '💰 Demander un dépôt' : '🏦 Demander un retrait'}
            </h2>
            <input
              type="number"
              value={requestAmount || ''}
              onChange={(e) => setRequestAmount(Number(e.target.value))}
              className="w-full bg-gray-700 rounded-lg p-3 mb-3 text-white"
              placeholder="Montant en Kudos"
              min="1"
            />
            <input
              type="text"
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              className="w-full bg-gray-700 rounded-lg p-3 mb-4 text-white"
              placeholder="Motif (optionnel)"
            />
            <div className="flex gap-3">
              <button
                onClick={handleRequest}
                className={`${skinClasses.button} flex-1 py-3 rounded-lg font-bold`}
              >
                Envoyer
              </button>
              <button
                onClick={() => setShowRequest(false)}
                className="bg-gray-600 hover:bg-gray-700 flex-1 py-3 rounded-lg font-bold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demandes en cours */}
      {requests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">📋 Mes demandes</h2>
          <div className="space-y-2">
            {requests.map((req) => (
              <div key={req.id} className={`${skinClasses.card} p-3 rounded-xl text-sm`}>
                <div className="flex justify-between items-center">
                  <span>{req.type === 'depot' ? '💰' : '🏦'} {req.reason}</span>
                  <span className="font-bold">{req.amount} Kudos</span>
                </div>
                <div className="mt-1">{getStatusBadge(req.status)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique */}
      <h2 className="text-lg font-bold mb-3">📜 Historique</h2>
      <div className="space-y-2">
        {transactions.map((tx: any) => (
          <div key={tx.id} className={`${skinClasses.card} p-3 rounded-xl flex justify-between items-center`}>
            <span className="text-sm">{tx.reason}</span>
            <span className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {tx.amount > 0 ? '+' : ''}{tx.amount}
            </span>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-4">Aucune transaction</p>
        )}
      </div>
    </div>
  );
}
