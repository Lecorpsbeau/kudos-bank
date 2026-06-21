'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (queryError || !user || pin !== user.pin_code) {
      setError('Pseudo ou code PIN incorrect');
      return;
    }

    localStorage.setItem('userId', user.id);
    localStorage.setItem('userRole', user.role);
    
    router.push(user.role === 'animateur' ? '/animateur/dashboard' : '/jeune/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md text-center">
        
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-4xl animate-bounce">🚀</span>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            Kudos Bank
          </h1>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pseudo</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all"
              placeholder="Ton pseudo..."
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Code PIN (4 chiffres)</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 text-center text-xl text-gray-800 tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all"
              placeholder="••••"
              maxLength={4}
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r cursor-pointer from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 transform active:scale-[0.98] transition-all mt-4"
          >
            Démarrer la mission
          </button>
        </form>
      </div>
    </div>
  );
}