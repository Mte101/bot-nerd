import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar, type NavLink } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  links: NavLink[];
  appName?: string;
}

export function DashboardLayout({ children, links, appName }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar appName={appName} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar links={links} />
        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
