'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layers, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      
      if (data?.user) {
         // Crear el perfil inicial en la tabla 'profiles'
         const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            subscription_tier: 'free'
         } as any); // Usamos any para evitar conflictos de tipado con Supabase Query Builder en el cliente si los tipos generados no están 100% sincronizados
         
         if (profileError) throw profileError;
         
         router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#a78bfa]/10 blur-[150px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111113] border border-[#27272a]/60 rounded-[32px] p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
            <Layers className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold font-display text-white mb-2">Empieza hoy</h1>
          <p className="text-zinc-500 text-sm">Crea tu identidad digital en segundos</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-100 text-[11px] text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full bg-black/40 border border-[#27272a] rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:border-[#00c9b1] outline-none transition-all placeholder:text-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-black/40 border border-[#27272a] rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:border-[#00c9b1] outline-none transition-all placeholder:text-zinc-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-[#27272a] rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:border-[#00c9b1] outline-none transition-all placeholder:text-zinc-800"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-[#00c9b1] hover:bg-[#00c9b1]/90 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                Crear Cuenta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-zinc-500 text-sm">
          Al registrarte, aceptas nuestros {' '}
          <Link href="/terms" className="text-zinc-400 hover:text-white underline underline-offset-4">Términos</Link>
        </div>

        <div className="mt-6 text-center pt-6 border-t border-[#27272a]/60">
          <p className="text-zinc-500 text-sm">
            ¿Ya tienes cuenta? {' '}
            <Link href="/login" className="text-[#00c9b1] font-bold hover:underline transition-all underline-offset-4">
              Entrar
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
