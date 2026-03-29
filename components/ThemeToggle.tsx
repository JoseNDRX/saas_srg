'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  variant?: 'navbar' | 'floating';
}

export function ThemeToggle({ variant = 'navbar' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'floating') {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        className="
          fixed bottom-6 right-6 z-50
          flex items-center justify-center
          w-12 h-12 rounded-full
          bg-card
          shadow-lg shadow-black/20 dark:shadow-white/5
          hover:scale-110 active:scale-95
          transition-all duration-200 ease-out
        "
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-500" strokeWidth={1.8} />
        ) : (
          <Moon className="w-5 h-5 text-indigo-500" strokeWidth={1.8} />
        )}
      </button>
    );
  }

  // navbar variant: No border, subtle shadow as requested
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="
        flex items-center gap-2 px-3.5 py-1.8 rounded-full
        bg-muted/80 backdrop-blur-sm
        shadow-sm shadow-black/5 dark:shadow-white/5
        hover:shadow-md hover:bg-muted/100
        text-muted-foreground hover:text-foreground
        transition-all duration-200 text-[10px] font-black uppercase tracking-widest
      "
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" strokeWidth={2.5} />
          <span className="hidden sm:inline">Modo Claro</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2.5} />
          <span className="hidden sm:inline">Modo Oscuro</span>
        </>
      )}
    </button>
  );
}
