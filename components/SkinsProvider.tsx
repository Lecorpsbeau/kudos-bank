'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { hashPin } from '@/lib/crypto';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      setError('Pseudo ou code PIN incorrect');
      return;
    }

    // Vérification du PIN (à implémenter avec bcrypt côté serveur)
    const pinValid = await verifyPin(pin, user.pin_code);
    
    if (!pinValid) {
      setError('Pseudo ou code PIN incorrect');
      return;
    }

    // Stocker la session
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userRole', user.role);
    
    router.push(user.role === 'animateur' ? '/animateur/dashboard' : '/jeune/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🌟 Kudos Bank
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-purple-200 mb-2">Pseudo</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-purple-300/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-400"
              placeholder="Ton pseudo..."
              required
            />
          </div>
          
          <div>
            <label className="block text-purple-200 mb-2">Code PIN (4 chiffres)</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full bg-white/5 border border-purple-300/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-400"
              placeholder="••••"
              maxLength={4}
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}