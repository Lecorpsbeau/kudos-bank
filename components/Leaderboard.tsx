'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSkin } from './SkinsProvider';

interface LeaderboardEntry {
  id: string;
  username: string;
  balance: number;
  active_skin: string;
}

export default function Leaderboard({ currentUserId }: { currentUserId: string }) {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const { skinClasses } = useSkin();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(10);
    
    setLeaders(data || []);

    if (data && !data.find(entry => entry.id === currentUserId)) {
      const { data: userData } = await supabase
        .from('leaderboard')
        .select('*');
      
      if (userData) {
        const rank = userData.findIndex(entry => entry.id === currentUserId) + 1;
        setUserRank(rank);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">🏆 Classement</h2>
      
      <div className="space-y-3">
        {leaders.map((entry, index) => (
          <div
            key={entry.id}
            className={`${skinClasses.card} p-4 rounded-xl flex items-center justify-between ${
              entry.id === currentUserId ? 'ring-2 ring-purple-400' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </span>
              <div>
                <p className="font-semibold">{entry.username}</p>
                <p className={`text-sm ${skinClasses.accent}`}>{entry.balance} Kudos</p>
              </div>
            </div>
            {entry.id === currentUserId && (
              <span className="text-sm bg-purple-500/20 px-2 py-1 rounded">Toi</span>
            )}
          </div>
        ))}
      </div>
      
      {userRank && (
        <div className={`${skinClasses.card} p-4 rounded-xl mt-4`}>
          <p className="text-center">Ta position : #{userRank}</p>
        </div>
      )}
    </div>
  );
}
