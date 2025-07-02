"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { invoicesApi, type Invoice } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { PrintableInvoice } from './PrintableInvoice';
import { InvoiceForm, InvoiceCard, InvoiceStats, EmptyState, SearchBar } from './invoice-management';

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const loadedInvoices = await invoicesApi.getInvoices();
      setInvoices(loadedInvoices.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive"
      });
    }
  };

  const handleInvoiceSaved = async (invoice: Partial<Invoice>) => {
    try {
      if ('id' in invoice) {
        await invoicesApi.updateInvoice(invoice.id!, invoice);
      } else {
        await invoicesApi.createInvoice(invoice as Omit<Invoice, 'id'>);
      }
    loadInvoices();
    setIsFormOpen(false);
    toast({
      title: "Success",
      description: "Invoice saved successfully"
    });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save invoice",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (invoice: Invoice) => {
    try {
      await invoicesApi.deleteInvoice(invoice.id);
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
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerPhone?.includes(searchTerm)
  );

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

        {/* Stats */}
        <InvoiceStats invoices={invoices} />

        {/* Search */}
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {/* Invoices List */}
        {filteredInvoices.length === 0 ? (
          <EmptyState searchTerm={searchTerm} onCreateClick={() => setIsFormOpen(true)} />
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard
                key={`invoice-${invoice.id}`}
                invoice={invoice}
                onPrint={handlePrint}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}