import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { type DashboardMetrics } from '@/lib/api';

interface RevenueHighlightProps {
  metrics: DashboardMetrics;
}

export function RevenueHighlight({ metrics }: RevenueHighlightProps) {
  if (metrics.recentRevenue <= 0) return null;

  return (
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
  );
} 