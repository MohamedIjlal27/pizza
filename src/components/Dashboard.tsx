"use client";

import { useState, useEffect } from 'react';
import { dashboardApi, type DashboardMetrics, type TopSellingItem, type RecentOrder } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KeyMetrics } from '@/components/dashboard/KeyMetrics';
import { TopSellingItems } from '@/components/dashboard/TopSellingItems';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RevenueHighlight } from '@/components/dashboard/RevenueHighlight';
import { LoadingState } from '@/components/dashboard/LoadingState';

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
    return <LoadingState />;
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
      <DashboardHeader />
      <KeyMetrics metrics={metrics} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <TopSellingItems items={topItems} />
        <RecentOrders orders={recentOrders} />
      </div>

      <QuickActions />
      <RevenueHighlight metrics={metrics} />
    </div>
  );
}