import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Pizza } from 'lucide-react';
import { type Invoice, type Item } from '@/lib/api';
import { itemsApi } from '@/lib/api';

interface PrintableInvoiceProps {
  invoice: Invoice;
}

export function PrintableInvoice({ invoice }: PrintableInvoiceProps) {
  const [items, setItems] = useState<Record<number, Item>>({});

  useEffect(() => {
    const loadItems = async () => {
      try {
        const loadedItems = await itemsApi.getItems();
        const itemsMap = loadedItems.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {} as Record<number, Item>);
        setItems(itemsMap);
      } catch (error) {
        console.error('Failed to load items:', error);
      }
    };
    loadItems();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">INVOICE</h1>
        <p className="text-muted-foreground">{invoice.invoiceNumber}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="font-semibold mb-2">Bill To:</h2>
          <p>{invoice.customerName}</p>
            {invoice.customerPhone && <p>{invoice.customerPhone}</p>}
        </div>
        <div className="text-right">
          <h2 className="font-semibold mb-2">Invoice Details:</h2>
          <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
        </div>
      </div>

      <table className="w-full mb-8">
          <thead>
          <tr className="border-b">
            <th className="text-left py-2">Item</th>
            <th className="text-right py-2">Qty</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
          {invoice.items.map((item) => (
            <tr key={`invoice-item-${item.itemId}-${item.quantity}`} className="border-b">
              <td className="py-2">{items[item.itemId]?.name || 'Loading...'}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">LKR {item.price.toFixed(2)}</td>
              <td className="text-right py-2">LKR {(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

      <div className="text-right">
        <p className="text-xl font-bold">Total: LKR {invoice.total.toFixed(2)}</p>
      </div>
    </div>
  );
}