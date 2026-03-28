import { LayoutDashboard, Users, Webhook, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#09090b] text-white">
      {/* Sidebar Fija */}
      <aside className="w-64 shrink-0 border-r border-[#27272a]/60 bg-[#111113] flex flex-col p-4">
        <div className="flex items-center gap-2 mb-10 mt-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <span className="text-white text-xs font-bold">SMX</span>
          </div>
          <span className="font-display font-bold text-lg">PuestoWeb</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Resumen" active />
          <NavItem href="/dashboard/leads" icon={Users} label="Contactos Capturados" />
          <NavItem href="/dashboard/pixel" icon={Webhook} label="Tracking Pixels" />
          <NavItem href="/dashboard/config" icon={Settings} label="Configuración" />
        </nav>

        <div className="mt-auto border-t border-[#27272a]/60 pt-4 flex items-center gap-3 px-2 text-sm text-zinc-400 hover:text-white cursor-pointer transition-colors">
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 h-screen overflow-hidden flex flex-col relative w-[calc(100%-16rem)]">
        <header className="h-16 shrink-0 border-b border-[#27272a]/60 bg-[#09090b]/80 backdrop-blur-sm flex items-center px-6 sticky top-0 z-10">
          <h2 className="text-sm font-medium text-zinc-300">Editor de Micrositio</h2>
        </header>
        
        <div className="flex-1 overflow-auto h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active = false }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-[#00c9b1]/10 text-[#00c9b1]' 
          : 'text-zinc-400 hover:bg-[#27272a]/50 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
