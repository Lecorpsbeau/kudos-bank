'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AnimateurLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 p-4">
        <div className="flex justify-around max-w-md mx-auto">
          <Link href="/animateur/dashboard" className={pathname === '/animateur/dashboard' ? 'text-purple-400' : 'text-gray-400'}>
            👥 Dashboard
          </Link>
          <Link href="/animateur/alertes" className={pathname === '/animateur/alertes' ? 'text-purple-400' : 'text-gray-400'}>
            🔔 Alertes
          </Link>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
