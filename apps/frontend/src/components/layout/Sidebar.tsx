import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, Package, ShoppingCart, History, LogOut, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ERoleType } from '@contracts/generated';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: Array<ERoleType>;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['ADMIN', 'PEMBELI'],
  },
  {
    label: 'Users',
    path: '/users',
    icon: <Users className="h-5 w-5" />,
    roles: ['ADMIN'],
  },
  {
    label: 'Master Produk',
    path: '/products',
    icon: <Package className="h-5 w-5" />,
    roles: ['ADMIN'],
  },
  {
    label: 'Pembelian Produk',
    path: '/purchase',
    icon: <ShoppingCart className="h-5 w-5" />,
    roles: ['PEMBELI'],
  },
  {
    label: 'History Pembayaran',
    path: '/history',
    icon: <History className="h-5 w-5" />,
    roles: ['PEMBELI'],
  },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredNavItems = navItems.filter((item) => {
    if (!user) return false;
    return item.roles.some((role) => user.roles.some((userRole) => userRole.toLowerCase() === role.toLowerCase()));
  });

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">DOMPET</h1>
            <p className="text-xs opacity-80">Management System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50',
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 px-2">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs opacity-70 capitalize">{user?.roles}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
