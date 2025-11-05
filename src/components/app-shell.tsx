"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Bot,
  Flame,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const menuItems = [
  { href: '/ai-insights', label: 'AI Аналитика', icon: Bot, description: "Находите закономерности с помощью ИИ." },
  { href: '/analytics', label: 'Аналитика', icon: BarChart, description: "Глубокий анализ вашей производительности." },
  { href: '/settings', label: 'Настройки', icon: Settings, description: "Настройте свой журнал." },
  { href: '/trades', label: 'Сделки', icon: Wallet, description: "Записывайте и просматривайте все свои сделки." },
  { href: '/', label: 'Панель', icon: LayoutDashboard, description: "Ваш центр управления торговлей." },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const sortedMenuItems = [...menuItems].sort((a, b) => b.href.length - a.href.length);
  const currentPage = sortedMenuItems.find(item => pathname.startsWith(item.href)) || menuItems.find(i => i.href === '/');

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-headline font-semibold">NovaTrade</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.sort((a,b) => a.href.length - b.href.length).map((item) => (
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
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar?.imageUrl} data-ai-hint={userAvatar?.imageHint} alt="Аватар пользователя" />
              <AvatarFallback>ТД</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate">Трейдер Джо</span>
              <span className="text-xs text-muted-foreground">Pro План</span>
            </div>
          </div>
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
            <Button>Новая сделка</Button>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
