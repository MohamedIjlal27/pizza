"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pizza, Coffee, PlusCircle } from 'lucide-react';
import { itemsApi, type Item } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { LoadingState, EmptyState, ItemCard, ItemForm, formSchema, type FormValues } from './item-management';

// Utility functions
const getCategoryIcon = (category: Item['category']) => {
  switch (category) {
    case 'pizza':
      return <Pizza className="w-4 h-4" />;
    case 'beverage':
      return <Coffee className="w-4 h-4" />;
    default:
      return <PlusCircle className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: Item['category']) => {
  switch (category) {
    case 'pizza':
      return 'bg-primary text-primary-foreground';
    case 'topping':
      return 'bg-pizza-orange text-white';
    case 'beverage':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

// Main ItemManagement Component
export function ItemManagement() {
  const [items, setItems] = useState<Item[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: 'pizza',
      price: '',
      description: ''
    },
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const loadedItems = await itemsApi.getItems();
      const validItems = loadedItems.filter(item => {
        if (!item.id) {
          console.warn('Found item without ID:', item);
          return false;
        }
        return true;
      });
      setItems(validItems);
    } catch (error) {
      console.error('Error loading items:', error);
      toast({
        title: "Error",
        description: "Failed to load items. Please check the console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      name: '',
      category: 'pizza',
      price: '',
      description: ''
    });
    setEditingItem(null);
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      const price = parseFloat(data.price);
      
      if (editingItem) {
        await itemsApi.updateItem(editingItem.id, {
          name: data.name,
          category: data.category,
          price,
          description: data.description
        });
        toast({
          title: "Success",
          description: "Item updated successfully"
        });
      } else {
        await itemsApi.createItem({
          name: data.name,
          category: data.category,
          price,
          description: data.description
        });
        toast({
          title: "Success",
          description: "Item added successfully"
        });
      }
      
      loadItems();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: editingItem ? "Failed to update item" : "Failed to create item",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: Item) => {
    try {
      await itemsApi.deleteItem(item.id);
      loadItems();
      toast({
        title: "Success",
        description: "Item deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Item Management</h2>
          <p className="text-muted-foreground">Manage your menu items, toppings, and beverages</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            </DialogHeader>
            <ItemForm 
              form={form}
              editingItem={editingItem}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : Object.entries(groupedItems).length === 0 ? (
        <EmptyState onAddClick={() => setIsDialogOpen(true)} />
      ) : (
        Object.entries(groupedItems).map(([category, categoryItems]) => (
          <Card key={`category-${category}-${Date.now()}`}>
            <CardHeader>
              <CardTitle className="capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryItems.map((item) => (
                  <ItemCard
                    key={`item-${item.id}`}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}