"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Trash2 } from 'lucide-react';
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
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(initialData?.customerPhone || '');

  useEffect(() => {
    loadItems();
    if (initialData) {
      setSelectedItems(initialData.items.map((item: any) => ({
        id: item.id,
        itemId: item.itemId,
        name: item.itemName,
        quantity: item.quantity,
        price: item.price,
        total: item.total
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

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invoice = {
      customerName,
      customerPhone,
      date: new Date().toISOString(),
      items: selectedItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        price: item.price
      })),
      total: calculateTotal()
    };

    onSave(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="customerPhone">Phone Number</Label>
                      <Input
            id="customerPhone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
                      />
        </div>
            </div>
            
      <div>
        <Label>Add Items</Label>
        <Select onValueChange={handleAddItem}>
          <SelectTrigger>
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.name} - LKR {item.price.toFixed(2)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
                  </div>

      {selectedItems.length > 0 && (
        <Card className="p-4">
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    LKR {item.price.toFixed(2)} × {item.quantity} = LKR {item.total.toFixed(2)}
                  </p>
                </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, -1)}
                      >
                    <Minus className="h-4 w-4" />
                      </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, 1)}
                      >
                    <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                      >
                    <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <p className="font-semibold">Total</p>
                <p className="font-semibold">LKR {calculateTotal().toFixed(2)}</p>
              </div>
                </div>
              </div>
          </Card>
        )}

      <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        <Button type="submit" disabled={selectedItems.length === 0 || !customerName}>
          {initialData ? 'Update' : 'Create'} Invoice
        </Button>
        </div>
      </form>
  );
}