'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Alert {
  id: string;
  reason: string;
  created_at: string;
  privilege_status: string;
  users?: {
    username: string;
  };
}

export default function PrivilegeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*, users!jeune_id(username)')
      .eq('is_privilege', true)
      .eq('privilege_status', 'pending')
      .order('created_at', { ascending: false });

    setAlerts(data || []);
  };

  const handleGrant = async (transactionId: string) => {
    await supabase
      .from('transactions')
      .update({ privilege_status: 'granted' })
      .eq('id', transactionId);

    loadAlerts();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">🔔 Alertes Privilèges</h1>
      
      {alerts.length === 0 ? (
        <div className="text-center text-gray-400 mt-12">
          <p className="text-xl">Aucune alerte en attente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-yellow-300">
                    {(alert as any).users?.username}
                  </h3>
                  <p className="text-gray-300 mt-2">{alert.reason}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleGrant(alert.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Marquer comme accordé
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
