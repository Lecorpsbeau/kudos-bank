'use client';

import { Leaderboard } from '@/components/Leaderboard';
import { useSkin } from '@/components/SkinsProvider';

export default function ClassementPage() {
  const { skinClasses } = useSkin();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  return (
    <div className={`${skinClasses.bg} min-h-screen p-6`}>
      <Leaderboard currentUserId={userId || ''} />
    </div>
  );
}
