"use client";

import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, User, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ModernLayoutProps {
  children: React.ReactNode;
}

export function ModernLayout({ children }: ModernLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-pizza-crust/20">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200" />
                
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search invoices, items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-background/50 border-border/50 focus:bg-background transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Quick Stats Badge */}
                <Badge variant="secondary" className="hidden sm:flex">
                  Live System
                </Badge>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-glow"></span>
                </Button>

                {/* Settings */}
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>

                {/* User Avatar */}
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-pizza-red rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">Admin</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 max-w-7xl">
              <div className="animate-fade-in">
                {children}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>© 2024 Pizza Shop Billing System. All rights reserved.</p>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full animate-glow"></div>
                    <span>System Online</span>
                  </span>
                  <span>Version 1.0</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}