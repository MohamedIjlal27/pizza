import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  Pizza, 
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { type DashboardMetrics } from '@/lib/api';

interface KeyMetricsProps {
  metrics: DashboardMetrics;
}

export function KeyMetrics({ metrics }: KeyMetricsProps) {
  return (
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
  );
} 