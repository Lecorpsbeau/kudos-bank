'use client';

import SkinsProvider from '@/components/SkinsProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function JeuneLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  if (!userId) return <div>Chargement...</div>;

  return (
    <SkinsProvider userId={userId}>
      <div className="min-h-screen bg-gray-900 text-white">
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-lg border-t border-gray-700 p-4">
          <div className="flex justify-around max-w-md mx-auto">
            <Link href="/jeune/dashboard" className={`flex flex-col items-center ${pathname === '/jeune/dashboard' ? 'text-purple-400' : 'text-gray-400'}`}>
              <span>💰</span>
              <span className="text-xs">Kudos</span>
            </Link>
            <Link href="/jeune/classement" className={`flex flex-col items-center ${pathname === '/jeune/classement' ? 'text-purple-400' : 'text-gray-400'}`}>
              <span>🏆</span>
              <span className="text-xs">Classement</span>
            </Link>
            <Link href="/jeune/boutique" className={`flex flex-col items-center ${pathname === '/jeune/boutique' ? 'text-purple-400' : 'text-gray-400'}`}>
              <span>🛍️</span>
              <span className="text-xs">Boutique</span>
            </Link>
          </div>
        </nav>
        <main className="pb-20">{children}</main>
      </div>
    </SkinsProvider>
  );
}
