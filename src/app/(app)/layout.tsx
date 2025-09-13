import AppSidebar from '@/components/app-sidebar';
import AppHeader from '@/components/app-header';
import AppBottomNav from '@/components/app-bottom-nav';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import ClientOnly from '@/components/client-only';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppHeader />
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen lg:py-8 lg:px-16 px-4 py-6 pt-20 lg:pt-8 pb-24 lg:pb-8">
          <ClientOnly>
            {children}
          </ClientOnly>
        </div>
      </SidebarInset>
      <ClientOnly>
        <AppBottomNav />
      </ClientOnly>
    </SidebarProvider>
  );
}
