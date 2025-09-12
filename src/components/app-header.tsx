
'use client';

import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function AppHeader() {
  const { isMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

  if (!isMobile) {
    return null;
  }

  const showBackButton = pathname !== '/dashboard';

  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b lg:hidden">
      <div>
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(true)}
        >
          <Menu />
          <span className="sr-only">Open Menu</span>
        </Button>
      </div>
    </header>
  );
}
