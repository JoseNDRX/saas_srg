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
          bg-zinc-800 border border-zinc-600
          shadow-lg shadow-black/40
          hover:scale-110 hover:border-teal-400
          transition-all duration-200 ease-out
        "
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400" strokeWidth={1.8} />
        ) : (
          <Moon className="w-5 h-5 text-indigo-400" strokeWidth={1.8} />
        )}
      </button>
    );
  }

  // navbar variant
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="
        flex items-center gap-1.5 px-3 py-1.5 rounded-full
        border border-zinc-700 hover:border-teal-400
        text-zinc-400 hover:text-white
        transition-all duration-200 text-sm font-medium
        bg-zinc-800/50
      "
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} />
          <span className="hidden sm:inline">Claro</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-400" strokeWidth={2} />
          <span className="hidden sm:inline">Oscuro</span>
        </>
      )}
    </button>
  );
}
