import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pizza, Receipt, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: 'items' | 'invoices';
  onScreenChange: (screen: 'items' | 'invoices') => void;
}

export function Layout({ children, currentScreen, onScreenChange }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'items', label: 'Item Management', icon: Pizza },
    { id: 'invoices', label: 'Invoice Management', icon: Receipt },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-pizza-crust">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-pizza-red rounded-lg flex items-center justify-center">
                <Pizza className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Pizza Shop</h1>
                <p className="text-sm text-muted-foreground">Billing System</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentScreen === item.id ? 'default' : 'ghost'}
                    onClick={() => onScreenChange(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border">
              <div className="py-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentScreen === item.id ? 'default' : 'ghost'}
                      onClick={() => {
                        onScreenChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start flex items-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-card/95 backdrop-blur-sm shadow-lg border-0 min-h-[600px]">
          <div className="p-6">
            {children}
          </div>
        </Card>
      </main>
    </div>
  );
}