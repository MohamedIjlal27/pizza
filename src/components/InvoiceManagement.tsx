"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Eye, Trash2, Printer, Search, Receipt } from 'lucide-react';
import { storage, type Invoice } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { InvoiceForm } from './InvoiceForm';
import { PrintableInvoice } from './PrintableInvoice';

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    const loadedInvoices = storage.getInvoices();
    setInvoices(loadedInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleInvoiceSaved = () => {
    loadInvoices();
    setIsFormOpen(false);
    toast({
      title: "Success",
      description: "Invoice saved successfully"
    });
  };

  const handleDelete = (invoice: Invoice) => {
    try {
      storage.deleteInvoice(invoice.id);
      loadInvoices();
      toast({
        title: "Success",
        description: "Invoice deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive"
      });
    }
  };

  const handlePrint = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    // Small delay to ensure the component renders before printing
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerPhone?.includes(searchTerm)
  );

  const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Print View */}
      {viewingInvoice && (
        <div className="print:block hidden">
          <PrintableInvoice invoice={viewingInvoice} />
        </div>
      )}

      {/* Screen View */}
      <div className="print:hidden">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Invoice Management</h2>
            <p className="text-muted-foreground">Create and manage customer invoices</p>
          </div>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Invoice</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <InvoiceForm onSave={handleInvoiceSaved} onCancel={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
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
                    LKR {invoices.length > 0 ? (totalRevenue / invoices.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number, customer name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? 'No invoices found' : 'No invoices yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first invoice to get started'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="font-mono">
                          {invoice.invoiceNumber}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(invoice.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">{invoice.customerName}</h4>
                        {invoice.customerPhone && (
                          <p className="text-sm text-muted-foreground">{invoice.customerPhone}</p>
                        )}
                        {invoice.customerAddress && (
                          <p className="text-sm text-muted-foreground">{invoice.customerAddress}</p>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <p className="text-2xl font-bold text-foreground">LKR {invoice.total.toFixed(2)}</p>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Invoice {invoice.invoiceNumber}</DialogTitle>
                            </DialogHeader>
                            <PrintableInvoice invoice={invoice} />
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrint(invoice)}
                        >
                          <Printer className="w-3 h-3 mr-1" />
                          Print
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-3 h-3" />
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
                              <AlertDialogAction onClick={() => handleDelete(invoice)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}