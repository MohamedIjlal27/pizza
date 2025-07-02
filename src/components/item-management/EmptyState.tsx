import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pizza, Plus } from "lucide-react";

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Pizza className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No items yet</h3>
        <p className="text-muted-foreground mb-4">Add your first menu item to get started</p>
        <Button onClick={onAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </CardContent>
    </Card>
  );
} 