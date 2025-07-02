const API_BASE_URL = 'http://localhost:8080';

export interface Item {
  id: number;
  ID?: number; // For backend compatibility
  name: string;
  category: 'pizza' | 'topping' | 'beverage' | 'other';
  price: number;
  description?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
}

export interface InvoiceItem {
  id: number;
  invoiceId: number;
  itemId: number;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string;
  date: string;
  items: InvoiceItem[];
  total: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalItems: number;
  recentRevenue: number;
  recentOrders: number;
  growthRate: number;
}

export interface TopSellingItem {
  itemName: string;
  quantity: number;
  revenue: number;
}

export interface RecentOrder {
  invoiceNumber: string;
  customerName: string;
  itemCount: number;
  total: number;
  date: string;
}

// API client for items
export const itemsApi = {
  getItems: async (): Promise<Item[]> => {
    const response = await fetch(`${API_BASE_URL}/items`);
    if (!response.ok) throw new Error('Failed to fetch items');
    const items = await response.json();
    // Map the backend response to match our frontend interface
    return items.map((item: any) => ({
      id: item.ID,  // Map ID to id
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      CreatedAt: item.CreatedAt,
      UpdatedAt: item.UpdatedAt,
      DeletedAt: item.DeletedAt
    }));
  },

  getItem: async (id: number): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`);
    if (!response.ok) throw new Error('Failed to fetch item');
    return response.json();
  },

  createItem: async (item: Omit<Item, 'id'>): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create item');
    return response.json();
  },

  updateItem: async (id: number, item: Partial<Item>): Promise<Item> => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
  },

  deleteItem: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete item');
  },
};

// API client for invoices
export const invoicesApi = {
  getInvoices: async (): Promise<Invoice[]> => {
    const response = await fetch(`${API_BASE_URL}/invoices`);
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
  },

  getInvoice: async (id: number): Promise<Invoice> => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`);
    if (!response.ok) throw new Error('Failed to fetch invoice');
    return response.json();
  },

  createInvoice: async (invoice: Omit<Invoice, 'id'>): Promise<Invoice> => {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) throw new Error('Failed to create invoice');
    return response.json();
  },

  updateInvoice: async (id: number, invoice: Partial<Invoice>): Promise<Invoice> => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) throw new Error('Failed to update invoice');
    return response.json();
  },

  deleteInvoice: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete invoice');
  },
};

export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/metrics`);
    if (!response.ok) throw new Error('Failed to fetch dashboard metrics');
    return response.json();
  },

  getTopItems: async (): Promise<TopSellingItem[]> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/top-items`);
    if (!response.ok) throw new Error('Failed to fetch top selling items');
    return response.json();
  },

  getRecentOrders: async (): Promise<RecentOrder[]> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/recent-orders`);
    if (!response.ok) throw new Error('Failed to fetch recent orders');
    return response.json();
  }
}; 