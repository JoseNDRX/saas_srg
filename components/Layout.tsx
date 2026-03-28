'use client';

import { type ReactNode } from 'react';
import { Navbar } from './Navbar';
import { ThemeToggle } from './ThemeToggle';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  /** Pass true to hide the standard Navbar (e.g. for microsite viewer pages) */
  hideNavbar?: boolean;
  /** Pass true to show the floating theme toggle instead of navbar variant */
  floatingThemeToggle?: boolean;
}

export function Layout({ children, hideNavbar = false, floatingThemeToggle = false }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-dvh">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideNavbar && <Footer />}
      {floatingThemeToggle && <ThemeToggle variant="floating" />}
    </div>
  );
}
