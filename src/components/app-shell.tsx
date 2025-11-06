"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Wallet,
  BarChart,
  Settings,
  Flame,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { NewTradeDialog } from './new-trade-dialog';
import type { Trade } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useTrades } from '@/context/trades-context';
import { useUser } from '@/firebase/auth/use-user';
import { getAuth, signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { Skeleton } from './ui/skeleton';

const menuItems = [
  { href: '/', label: 'Панель', icon: LayoutDashboard, description: "Ваш центр управления торговлей." },
  { href: '/trades', label: 'Сделки', icon: Wallet, description: "Записывайте и просматривайте все свои сделки." },
  { href: '/analytics', label: 'Аналитика', icon: BarChart, description: "Глубокий анализ вашей производительности." },
  { href: '/settings', label: 'Настройки', icon: Settings, description: "Настройте свой журнал." },
];

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        if (!isLoading && !user && pathname !== '/login' && pathname !== '/signup') {
            router.push('/login');
        }
    }, [user, isLoading, router, pathname]);

    if (isLoading) {
        return (
          <div className="flex h-screen w-screen items-center justify-center">
            <Flame className="h-12 w-12 animate-pulse text-primary" />
          </div>
        );
    }
    
    if (!user && pathname !== '/login' && pathname !== '/signup') {
      // This will be seen very briefly before the redirect kicks in
      return null;
    }
    
    if ((user && (pathname === '/login' || pathname === '/signup'))) {
      router.push('/');
      return null;
    }

    if (!user && (pathname === '/login' || pathname === '/signup')) {
      return <>{children}</>;
    }

    if (user && pathname !== '/login' && pathname !== '/signup') {
       return <>{children}</>;
    }
    
    return null;
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const { addTrade } = useTrades();
  const { user, isLoading } = useUser();
  const { app } = useFirebase();
  const router = useRouter();
  
  const currentPage = menuItems.find(item => pathname === item.href) || menuItems[0];

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');
  const [isNewTradeOpen, setIsNewTradeOpen] = useState(false);

  const handleAddTrade = (trade: Trade) => {
    addTrade(trade);
    toast({
      title: 'Сделка добавлена',
      description: `Сделка для ${trade.instrument} была успешно добавлена.`,
    });
  };

  const handleSignOut = async () => {
    if (!app) return;
    const auth = getAuth(app);
    await signOut(auth);
    router.push('/login');
  };
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  
  if (isAuthPage) {
      return <AuthGuard>{children}</AuthGuard>
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2">
              <Flame className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-headline font-semibold">Coffee and Profit</h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
           {isLoading ? (
               <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            ) : user ? (
              <>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL || userAvatar?.imageUrl} data-ai-hint={userAvatar?.imageHint} alt="Аватар пользователя" />
                  <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-semibold text-sm truncate">{user.displayName || user.email}</span>
                  <span className="text-xs text-muted-foreground">Pro План</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-start mt-2" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
              </>
            ) : null}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                  <div className="md:hidden">
                      <SidebarTrigger />
                  </div>
                  <div>
                      <h1 className="text-xl font-headline font-bold text-foreground">
                          {currentPage?.label}
                      </h1>
                      <p className="text-muted-foreground text-sm hidden md:block">{currentPage?.description}</p>
                  </div>
              </div>
              <Button onClick={() => setIsNewTradeOpen(true)}>Новая сделка</Button>
          </header>
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </SidebarInset>
        <NewTradeDialog 
          open={isNewTradeOpen} 
          onOpenChange={setIsNewTradeOpen} 
          onAddTrade={handleAddTrade}
        />
      </SidebarProvider>
    </AuthGuard>
  );
}
