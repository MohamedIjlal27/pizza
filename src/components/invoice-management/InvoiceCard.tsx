import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Printer, Trash2 } from 'lucide-react';
import { type Invoice } from '@/lib/api';

interface InvoiceCardProps {
  invoice: Invoice;
  onPrint: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export function InvoiceCard({ invoice, onPrint, onDelete }: InvoiceCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="font-mono">
                {invoice.invoiceNumber}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(invoice.date).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-semibold">{invoice.customerName}</h3>
            {invoice.customerPhone && (
              <p className="text-sm text-muted-foreground">{invoice.customerPhone}</p>
            )}
            <p className="font-medium">LKR {invoice.total.toFixed(2)}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onPrint(invoice)}>
              <Printer className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete invoice {invoice.invoiceNumber}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(invoice)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 