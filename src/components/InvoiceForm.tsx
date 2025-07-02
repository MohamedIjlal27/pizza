"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, X } from 'lucide-react';
import { storage, type Item, type Invoice, type InvoiceItem } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Form validation schema
const formSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  customerAddress: z.string().optional(),
  taxRate: z.number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate cannot exceed 100%'),
});

type FormValues = z.infer<typeof formSchema>;

interface InvoiceFormProps {
  onSave: () => void;
  onCancel: () => void;
}

export function InvoiceForm({ onSave, onCancel }: InvoiceFormProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const { toast } = useToast();

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      taxRate: 8.25,
    },
  });

  useEffect(() => {
    setItems(storage.getItems());
  }, []);

  const addItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const existingItem = invoiceItems.find(ii => ii.itemId === itemId);
    if (existingItem) {
      updateQuantity(itemId, existingItem.quantity + 1);
    } else {
      const newInvoiceItem: InvoiceItem = {
        itemId: item.id,
        itemName: item.name,
        quantity: 1,
        price: item.price,
        total: item.price
      };
      setInvoiceItems([...invoiceItems, newInvoiceItem]);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setInvoiceItems(prev => prev.map(item => 
      item.itemId === itemId 
        ? { ...item, quantity, total: item.price * quantity }
        : item
    ));
  };

  const removeItem = (itemId: string) => {
    setInvoiceItems(prev => prev.filter(item => item.itemId !== itemId));
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (form.watch('taxRate') / 100);
  const total = subtotal + taxAmount;

  const handleSave = form.handleSubmit((data) => {
    if (invoiceItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the invoice",
        variant: "destructive"
      });
      return;
    }

    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: storage.getNextInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      customerName: data.customerName,
      customerPhone: data.customerPhone || undefined,
      customerAddress: data.customerAddress || undefined,
      items: invoiceItems,
      subtotal,
      taxRate: data.taxRate,
      taxAmount,
      total
    };

    storage.saveInvoice(invoice);
    onSave();
  });

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  return (
    <Form {...form}>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter customer name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        placeholder="8.25"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="customerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter customer address" rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Add Items */}
        <Card>
          <CardHeader>
            <CardTitle>Add Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category}>
                  <h4 className="font-semibold text-foreground mb-2 capitalize">{category}s</h4>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {categoryItems.map((item) => (
                      <Button
                        key={item.id}
                        type="button"
                        variant="outline"
                        className="h-auto p-3 justify-between"
                        onClick={() => addItem(item.id)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">${item.price.toFixed(2)}</div>
                        </div>
                        <Plus className="w-4 h-4 ml-2" />
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        {invoiceItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoiceItems.map((item) => (
                  <div key={item.itemId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.itemName}</h4>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      
                      <div className="w-20 text-right font-medium">
                        ${item.total.toFixed(2)}
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.itemId)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({form.watch('taxRate')}%):</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">
            Save Invoice
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}