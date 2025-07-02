import { Button } from '@/components/ui/button';
import { Receipt, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  searchTerm?: string;
  onCreateClick: () => void;
}

export function EmptyState({ searchTerm, onCreateClick }: EmptyStateProps) {
  return (
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
          <Button onClick={onCreateClick}>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 