'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground transition-colors duration-500">
      <header className="h-16 shrink-0 border-b border-border glass flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white text-[10px] font-bold">SMX</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">PuestoWeb</span>
          </Link>
          <div className="h-4 w-[1px] bg-border mx-2" />
          <h2 className="text-sm font-medium text-muted-foreground italic">Editor de Micrositio</h2>
        </div>

        <div className="flex items-center gap-4">
           <Link 
            href="/dashboard/leads" 
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
          >
            Contactos
          </Link>
          <Link 
            href="/dashboard/pixel" 
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
          >
            Píxeles
          </Link>
          <Link 
            href="/dashboard/config" 
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
          >
            Configuración
          </Link>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all active:scale-95"
          >
            <LogOut className="w-3 h-3" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="flex-1 w-full bg-background relative">
        <div className="max-w-[1400px] mx-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
