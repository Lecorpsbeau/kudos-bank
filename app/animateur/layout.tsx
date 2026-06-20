'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AnimateurLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 p-4">
        <h1 className="text-center text-lg font-bold">👑 Kudos Bank Admin</h1>
      </header>
      <main className="pb-20">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-lg border-t border-gray-700 p-4">
        <div className="flex justify-around max-w-md mx-auto">
          <Link
            href="/animateur/dashboard"
            className={`flex flex-col items-center text-sm ${pathname === '/animateur/dashboard' ? 'text-purple-400' : 'text-gray-400'}`}
          >
            <span className="text-xl">👥</span>
            <span>Jeunes</span>
          </Link>
          <Link
            href="/animateur/alertes"
            className={`flex flex-col items-center text-sm ${pathname === '/animateur/alertes' ? 'text-purple-400' : 'text-gray-400'}`}
          >
            <span className="text-xl">🔔</span>
            <span>Privilèges</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
