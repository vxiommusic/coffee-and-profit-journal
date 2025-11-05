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
  { href: '/ai-insights', label: 'AI Insights', icon: Bot, description: "Uncover patterns with AI." },
  { href: '/analytics', label: 'Analytics', icon: BarChart, description: "Deep dive into your performance." },
  { href: '/settings', label: 'Settings', icon: Settings, description: "Customize your journal." },
  { href: '/trades', label: 'Trades', icon: Wallet, description: "Log and review all your trades." },
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, description: "Your mission control for trading." },
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
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar?.imageUrl} data-ai-hint={userAvatar?.imageHint} alt="User avatar" />
              <AvatarFallback>TJ</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate">Trader Joe</span>
              <span className="text-xs text-muted-foreground">Pro Plan</span>
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
            <Button>New Trade</Button>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
