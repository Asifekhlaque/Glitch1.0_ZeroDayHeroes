
'use client';

import { Button } from '@/components/ui/button';
import { Activity, ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const showBackButton = pathname !== '/dashboard';

  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b lg:hidden">
      <div className="flex items-center">
        {showBackButton ? (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-headline text-xl font-bold text-foreground">LifeBoost</h1>
          </div>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
