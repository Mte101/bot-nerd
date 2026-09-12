import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';

interface NavbarProps {
  appName?: string;
}

export function Navbar({ appName = 'bot-nerd' }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">{appName}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold select-none">
                {user.name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <span className="text-sm text-gray-700 hidden sm:block">{user.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
