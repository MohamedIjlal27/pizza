"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  Pizza, 
  Clock, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3
} from 'lucide-react';
import { storage, type Invoice, type Item } from '@/lib/storage';

export function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setInvoices(storage.getInvoices());
    setItems(storage.getItems());
  }, []);

  // Calculate metrics
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalOrders = invoices.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalItems = items.length;

  // Recent invoices (last 7 days)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const recentInvoices = invoices.filter(
    invoice => new Date(invoice.date) >= last7Days
  );
  const recentRevenue = recentInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

  // Top selling items
  const itemSales = invoices.reduce((acc, invoice) => {
    invoice.items.forEach(item => {
      if (!acc[item.itemName]) {
        acc[item.itemName] = { quantity: 0, revenue: 0 };
      }
      acc[item.itemName].quantity += item.quantity;
      acc[item.itemName].revenue += item.total;
    });
    return acc;
  }, {} as Record<string, { quantity: number; revenue: number }>);

  const topItems = Object.entries(itemSales)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 5);

  // Recent activity
  const recentActivity = invoices
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Growth calculation (mock for demo)
  const growthRate = 12.5; // This would typically be calculated from historical data

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your pizza shop today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground">LKR {totalRevenue.toFixed(2)}</p>
                <div className="flex items-center text-sm text-success mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+{growthRate}%</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-pizza-red flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold text-foreground">{totalOrders}</p>
                <div className="flex items-center text-sm text-success mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+8.2%</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-pizza-orange to-warning flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-3xl font-bold text-foreground">LKR {averageOrderValue.toFixed(2)}</p>
                <div className="flex items-center text-sm text-success mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+5.4%</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Menu Items</p>
                <p className="text-3xl font-bold text-foreground">{totalItems}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Active</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <Pizza className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Selling Items */}
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Top Selling Items</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topItems.length > 0 ? (
              <div className="space-y-4">
                {topItems.map(([itemName, data], index) => (
                  <div key={itemName} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{itemName}</p>
                        <p className="text-sm text-muted-foreground">{data.quantity} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">LKR {data.revenue.toFixed(2)}</p>
                      <Badge variant="secondary" className="text-xs">
                        Revenue
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Pizza className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No sales data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{invoice.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.items.length} items • {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">LKR {invoice.total.toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        {invoice.invoiceNumber}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent orders</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-slide-in-right">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col space-y-2 transition-all duration-300 hover:scale-105">
              <Receipt className="w-6 h-6" />
              <span>New Invoice</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 transition-all duration-300 hover:scale-105">
              <Pizza className="w-6 h-6" />
              <span>Add Menu Item</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 transition-all duration-300 hover:scale-105">
              <BarChart3 className="w-6 h-6" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Revenue Highlight */}
      {recentRevenue > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 to-pizza-red/10 border-primary/20 animate-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last 7 Days Revenue</p>
                <p className="text-2xl font-bold text-primary">LKR {recentRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{recentInvoices.length} orders</p>
              </div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-pizza-red flex items-center justify-center animate-float">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}