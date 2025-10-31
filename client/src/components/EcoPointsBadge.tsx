import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface EcoPointsBadgeProps {
  points: number;
}

export default function EcoPointsBadge({ points }: EcoPointsBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1 px-3 py-1">
      <Sparkles className="w-3 h-3 text-primary" />
      <span className="font-semibold">{points.toLocaleString()}</span>
      <span className="text-muted-foreground">pts</span>
    </Badge>
  );
}