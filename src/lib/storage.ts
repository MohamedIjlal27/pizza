// Local storage utilities for the pizza shop app
export interface Item {
  id: string;
  name: string;
  category: 'pizza' | 'topping' | 'beverage' | 'other';
  price: number;
  description?: string;
}

export interface InvoiceItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

class StorageManager {
  private readonly ITEMS_KEY = 'pizza-shop-items';
  private readonly INVOICES_KEY = 'pizza-shop-invoices';
  private readonly INVOICE_COUNTER_KEY = 'pizza-shop-invoice-counter';

  // Item management
  getItems(): Item[] {
    const stored = localStorage.getItem(this.ITEMS_KEY);
    return stored ? JSON.parse(stored) : this.getDefaultItems();
  }

  saveItems(items: Item[]): void {
    localStorage.setItem(this.ITEMS_KEY, JSON.stringify(items));
  }

  addItem(item: Omit<Item, 'id'>): Item {
    const items = this.getItems();
    const newItem: Item = {
      ...item,
      id: Date.now().toString()
    };
    items.push(newItem);
    this.saveItems(items);
    return newItem;
  }

  updateItem(id: string, updates: Partial<Item>): void {
    const items = this.getItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.saveItems(items);
    }
  }

  deleteItem(id: string): void {
    const items = this.getItems().filter(item => item.id !== id);
    this.saveItems(items);
  }

  // Invoice management
  getInvoices(): Invoice[] {
    const stored = localStorage.getItem(this.INVOICES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  saveInvoices(invoices: Invoice[]): void {
    localStorage.setItem(this.INVOICES_KEY, JSON.stringify(invoices));
  }

  getNextInvoiceNumber(): string {
    const counter = parseInt(localStorage.getItem(this.INVOICE_COUNTER_KEY) || '0') + 1;
    localStorage.setItem(this.INVOICE_COUNTER_KEY, counter.toString());
    return `INV-${counter.toString().padStart(4, '0')}`;
  }

  saveInvoice(invoice: Invoice): void {
    const invoices = this.getInvoices();
    const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
    
    if (existingIndex !== -1) {
      invoices[existingIndex] = invoice;
    } else {
      invoices.push(invoice);
    }
    
    this.saveInvoices(invoices);
  }

  deleteInvoice(id: string): void {
    const invoices = this.getInvoices().filter(inv => inv.id !== id);
    this.saveInvoices(invoices);
  }

  // Default items for new installations
  private getDefaultItems(): Item[] {
    const defaultItems: Item[] = [
      { id: '1', name: 'Margherita Pizza', category: 'pizza', price: 12.99, description: 'Classic tomato sauce, mozzarella, fresh basil' },
      { id: '2', name: 'Pepperoni Pizza', category: 'pizza', price: 14.99, description: 'Tomato sauce, mozzarella, pepperoni' },
      { id: '3', name: 'Supreme Pizza', category: 'pizza', price: 18.99, description: 'Loaded with pepperoni, sausage, peppers, onions, mushrooms' },
      { id: '4', name: 'Extra Cheese', category: 'topping', price: 2.50, description: 'Additional mozzarella cheese' },
      { id: '5', name: 'Mushrooms', category: 'topping', price: 1.50, description: 'Fresh mushrooms' },
      { id: '6', name: 'Pepperoni', category: 'topping', price: 2.00, description: 'Premium pepperoni slices' },
      { id: '7', name: 'Coca Cola', category: 'beverage', price: 2.99, description: '16oz bottle' },
      { id: '8', name: 'Bottled Water', category: 'beverage', price: 1.99, description: '16oz bottle' },
    ];
    
    this.saveItems(defaultItems);
    return defaultItems;
  }
}

export const storage = new StorageManager();