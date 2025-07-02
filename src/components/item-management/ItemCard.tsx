import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Pizza, Coffee, PlusCircle } from "lucide-react";
import { type Item } from "@/lib/api";

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

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

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  return (
    <Card 
      key={`item-${item.id || `temp-${Date.now()}-${Math.random()}`}`} 
      className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            <Badge variant="outline" className={getCategoryColor(item.category)}>
              <span className="flex items-center space-x-1">
                {getCategoryIcon(item.category)}
                <span>{item.category}</span>
              </span>
            </Badge>
            {item.description && (
              <p className="text-sm text-muted-foreground">{item.description}</p>
            )}
            <p className="text-lg font-bold text-foreground">LKR {item.price.toFixed(2)}</p>
          </div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" onClick={() => onEdit(item)}>
              <Edit className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Item</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {item.name}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(item)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 