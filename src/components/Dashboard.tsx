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
import { dashboardApi, type DashboardMetrics, type TopSellingItem, type RecentOrder } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [topItems, setTopItems] = useState<TopSellingItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [metricsData, topItemsData, recentOrdersData] = await Promise.all([
          dashboardApi.getMetrics(),
          dashboardApi.getTopItems(),
          dashboardApi.getRecentOrders()
        ]);

        setMetrics(metricsData);
        setTopItems(topItemsData);
        setRecentOrders(recentOrdersData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

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
                <p className="text-3xl font-bold text-foreground">LKR {metrics.totalRevenue.toFixed(2)}</p>
                <div className="flex items-center text-sm text-success mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+{metrics.growthRate.toFixed(1)}%</span>
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
                <p className="text-3xl font-bold text-foreground">{metrics.totalOrders}</p>
                <div className="flex items-center text-sm text-success mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+{((metrics.recentOrders / metrics.totalOrders) * 100).toFixed(1)}%</span>
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
                <p className="text-3xl font-bold text-foreground">LKR {metrics.averageOrderValue.toFixed(2)}</p>
                <div className="flex items-center text-sm text-success mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>Active</span>
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
                <p className="text-3xl font-bold text-foreground">{metrics.totalItems}</p>
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
                {topItems.map((item, index) => (
                  <div key={`top-item-${item.itemName}`} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.itemName}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">LKR {item.revenue.toFixed(2)}</p>
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
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={`recent-order-${order.invoiceNumber}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.itemCount} items • {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">LKR {order.total.toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        {order.invoiceNumber}
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
      {metrics.recentRevenue > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 to-pizza-red/10 border-primary/20 animate-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last 7 Days Revenue</p>
                <p className="text-2xl font-bold text-primary">LKR {metrics.recentRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{metrics.recentOrders} orders</p>
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