import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();
  const isPembeli = user?.roles.includes('PEMBELI');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm">
      <div>{title && <h1 className="text-xl font-semibold text-foreground">{title}</h1>}</div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            3
          </span>
        </Button>

        {isPembeli && (
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </Button>
        )}
      </div>
    </header>
  );
};
