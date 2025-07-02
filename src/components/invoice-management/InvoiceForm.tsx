"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, X } from 'lucide-react';
import { itemsApi, type Item } from '@/lib/api';

interface InvoiceFormProps {
  onSave: (invoice: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function InvoiceForm({ onSave, onCancel, initialData }: InvoiceFormProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Array<{
    id: number;
    itemId: number;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: initialData?.customerName || '',
    phone: initialData?.customerPhone || '',
    address: initialData?.customerAddress || ''
  });
  const [taxRate, setTaxRate] = useState(8.25); // Default tax rate

  useEffect(() => {
    loadItems();
    if (initialData) {
      setSelectedItems(initialData.items.map((item: any) => ({
        id: item.id,
        itemId: item.itemId,
        name: item.itemName,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })));
    }
  }, [initialData]);

  const loadItems = async () => {
    try {
      const loadedItems = await itemsApi.getItems();
      setItems(loadedItems);
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  const handleAddItem = (itemId: string) => {
    const item = items.find(i => i.id === parseInt(itemId));
    if (!item) return;

    const existingItem = selectedItems.find(i => i.itemId === item.id);
    if (existingItem) {
      handleQuantityChange(existingItem.id, 1);
    } else {
      setSelectedItems(prev => [
        ...prev,
        {
          id: Date.now(),
          itemId: item.id,
          name: item.name,
          quantity: 1,
          price: item.price,
          total: item.price
        }
      ]);
    }
  };

  const handleQuantityChange = (id: number, change: number) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return {
          ...item,
          quantity: newQuantity,
          total: item.price * newQuantity
        };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoice = {
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone || undefined,
      customerAddress: customerInfo.address || undefined,
      date: new Date().toISOString(),
      items: selectedItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      taxRate,
      taxAmount,
      total
    };

    onSave(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              placeholder="Enter customer name"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerPhone">Phone</Label>
              <Input
                id="customerPhone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                placeholder="8.25"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="customerAddress">Address</Label>
            <Textarea
              id="customerAddress"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              placeholder="Enter customer address"
              rows={2}
            />
          </div>
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
                      variant="outline"
                      className="h-auto p-3 justify-between"
                      onClick={() => handleAddItem(item.id.toString())}
                      type="button"
                    >
                      <div className="text-left">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">LKR {item.price.toFixed(2)}</div>
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

      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">LKR {item.price.toFixed(2)} each</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    
                    <div className="w-20 text-right font-medium">
                      LKR {item.total.toFixed(2)}
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
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
                <span className="font-medium">LKR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({taxRate}%):</span>
                <span className="font-medium">LKR {taxAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>LKR {total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={selectedItems.length === 0 || !customerInfo.name}>
          {initialData ? 'Update' : 'Create'} Invoice
        </Button>
      </div>
    </form>
  );
} 