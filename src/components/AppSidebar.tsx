"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Pizza, 
  Receipt, 
  Settings, 
  BarChart3,
  Package,
  Users,
  FileText
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';


const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    description: 'Overview & Analytics'
  },
  {
    title: 'Items',
    url: '/items',
    icon: Pizza,
    description: 'Menu Management'
  },
  {
    title: 'Invoices',
    url: '/invoices',
    icon: Receipt,
    description: 'Billing & Orders'
  }
];

const secondaryItems = [
  {
    title: 'Reports',
    url: '/reports',
    icon: BarChart3,
    description: 'Sales Analytics'
  },
  {
    title: 'Inventory',
    url: '/inventory',
    icon: Package,
    description: 'Stock Management'
  },
  {
    title: 'Customers',
    url: '/customers',
    icon: Users,
    description: 'Customer Database'
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const active = isActive(path);
    return active 
      ? 'bg-primary/15 text-primary border-r-2 border-primary hover:bg-primary/20 shadow-sm' 
      : 'hover:bg-accent/10 hover:text-primary transition-all duration-200';
  };

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-72'} transition-all duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
      <SidebarHeader className="border-b border-border/10 pb-6 pt-4">
        <div className="flex items-center space-x-3 px-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary via-primary/80 to-pizza-red rounded-xl flex items-center justify-center shadow-lg">
              <Pizza className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary via-primary/50 to-pizza-red rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-pizza-red bg-clip-text text-transparent">Pizza Shop</h2>
              <p className="text-xs font-medium text-muted-foreground">Billing System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="space-y-6 pt-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={`${collapsed ? 'sr-only' : 'text-sm font-semibold text-muted-foreground px-3 mb-2'}`}>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`${getNavClass(item.url)} group relative rounded-lg p-3`}
                    >
                      <Link href={item.url}>
                        <Icon className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} transition-all duration-200`} />
                        {!collapsed && (
                          <div className="flex-1 animate-fade-in">
                            <span className="text-base font-medium">{item.title}</span>
                            
                          </div>
                        )}
                        {collapsed && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-popover/95 backdrop-blur-sm text-popover-foreground rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                            <p className="text-base font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={`${collapsed ? 'sr-only' : 'text-sm font-semibold text-muted-foreground px-3 mb-2'}`}>
            Additional Features
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-2">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`${getNavClass(item.url)} group relative opacity-40 pointer-events-none rounded-lg p-3`}
                    >
                      <div>
                        <Icon className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} transition-all duration-200`} />
                        {!collapsed && (
                          <div className="flex-1">
                            <span className="text-base font-medium">{item.title}</span>
                          </div>
                        )}
                        {collapsed && (
                          <div className="absolute left-full ml-2 px-3 py-2 bg-popover/95 backdrop-blur-sm text-popover-foreground rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                            <p className="text-base font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">Coming Soon</p>
                          </div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-4 py-6 mx-2 rounded-xl bg-gradient-to-tr from-primary/5 via-primary/3 to-pizza-red/5 backdrop-blur-sm animate-fade-in border border-border/5">
                <div className="text-center space-y-3">
                  <div className="relative inline-flex">
                    <FileText className="w-8 h-8 text-primary mx-auto" />
                    <div className="absolute -inset-1 bg-primary rounded-full blur opacity-20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-foreground">
                      Modern POS System
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Streamlined Operations
                    </p>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}