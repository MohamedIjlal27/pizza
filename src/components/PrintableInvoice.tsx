import { Separator } from '@/components/ui/separator';
import { Pizza } from 'lucide-react';
import type { Invoice } from '@/lib/storage';

interface PrintableInvoiceProps {
  invoice: Invoice;
}

export function PrintableInvoice({ invoice }: PrintableInvoiceProps) {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white text-black print:p-6 print:shadow-none">
      {/* Header */}
      <div className="text-center mb-8 print:mb-6">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center print:bg-gray-800">
            <Pizza className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pizza Shop</h1>
            <p className="text-gray-600">Delicious Pizza & More</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>123 Main Street, Pizza City, PC 12345</p>
          <p>Phone: (555) 123-PIZZA | Email: orders@pizzashop.com</p>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-8 print:mb-6">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Bill To:</h3>
          <div className="text-sm">
            <p className="font-medium">{invoice.customerName}</p>
            {invoice.customerPhone && <p>{invoice.customerPhone}</p>}
            {invoice.customerAddress && (
              <p className="whitespace-pre-line">{invoice.customerAddress}</p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="bg-gray-50 p-4 rounded-lg print:bg-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h2>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</p>
              <p><span className="font-medium">Date:</span> {new Date(invoice.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Due Date:</span> {new Date(invoice.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8 print:mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 text-gray-800">Item</th>
              <th className="text-center py-3 text-gray-800 w-20">Qty</th>
              <th className="text-right py-3 text-gray-800 w-24">Price</th>
              <th className="text-right py-3 text-gray-800 w-24">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 text-gray-800">{item.itemName}</td>
                <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                <td className="py-3 text-right text-gray-600">${item.price.toFixed(2)}</td>
                <td className="py-3 text-right font-medium text-gray-800">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8 print:mb-6">
        <div className="w-64">
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-800">${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
              <span className="font-medium text-gray-800">${invoice.taxAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between py-3 text-lg">
              <span className="font-bold text-gray-800">Total:</span>
              <span className="font-bold text-gray-800">${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Separator className="mb-6" />
      <div className="text-center text-sm text-gray-600 space-y-2">
        <p className="font-semibold">Thank you for your business!</p>
        <p>Payment is due upon receipt. Please retain this invoice for your records.</p>
        <p>For questions about this invoice, please contact us at (555) 123-PIZZA</p>
      </div>

    </div>
  );
}