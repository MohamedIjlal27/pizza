import { Card, CardContent } from '@/components/ui/card';
import { Receipt } from 'lucide-react';
import { type Invoice } from '@/lib/api';

interface InvoiceStatsProps {
  invoices: Invoice[];
}

export function InvoiceStats({ invoices }: InvoiceStatsProps) {
  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const averageOrder = invoices.length > 0 ? totalRevenue / invoices.length : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Receipt className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold text-foreground">{invoices.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-success flex items-center justify-center">
              <span className="text-white font-bold text-sm">LKR</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">LKR {totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-warning flex items-center justify-center">
              <span className="text-white font-bold text-sm">Ø</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Average Order</p>
              <p className="text-2xl font-bold text-foreground">
                LKR {averageOrder.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 