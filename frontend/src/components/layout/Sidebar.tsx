import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  links: NavLink[];
}

export function Sidebar({ links }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-60 shrink-0 min-h-screen border-r border-gray-200 bg-white p-4">
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.href || location.pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              to={link.href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
