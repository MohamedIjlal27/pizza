import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Loading items...</h3>
      </CardContent>
    </Card>
  );
} 