import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Receipt, Pizza, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InvoiceForm } from '@/components/invoice-management';
import { ItemForm, formSchema, type FormValues } from '@/components/item-management';

export function QuickActions() {
  const router = useRouter();
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: 'pizza',
      price: '',
      description: ''
    }
  });

  const handleInvoiceSaved = async (invoice: any) => {
    setIsInvoiceDialogOpen(false);
    router.push('/invoices');
  };

  const handleItemSaved = async (data: FormValues) => {
    setIsItemDialogOpen(false);
    router.push('/items');
  };

  const handleDialogClose = (type: 'invoice' | 'item') => {
    if (type === 'item') {
      form.reset();
      setIsItemDialogOpen(false);
    } else {
      setIsInvoiceDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="animate-slide-in-right">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 transition-all duration-300 hover:scale-105"
              onClick={() => setIsInvoiceDialogOpen(true)}
            >
              <Receipt className="w-6 h-6" />
              <span>New Invoice</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 transition-all duration-300 hover:scale-105"
              onClick={() => setIsItemDialogOpen(true)}
            >
              <Pizza className="w-6 h-6" />
              <span>Add Menu Item</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2 transition-all duration-300 hover:scale-105"
              onClick={() => router.push('/invoices')}
            >
              <BarChart3 className="w-6 h-6" />
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* New Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={(open) => !open && handleDialogClose('invoice')}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceForm 
            onSave={handleInvoiceSaved} 
            onCancel={() => handleDialogClose('invoice')} 
          />
        </DialogContent>
      </Dialog>

      {/* New Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={(open) => !open && handleDialogClose('item')}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <ItemForm 
            form={form}
            editingItem={null}
            onSubmit={handleItemSaved}
            onCancel={() => handleDialogClose('item')}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 