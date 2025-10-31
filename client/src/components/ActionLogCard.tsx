import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface ActionLogCardProps {
  icon: React.ReactNode;
  title: string;
  timestamp: string;
  points: number;
  verified?: boolean;
  category: string;
}

export default function ActionLogCard({
  icon,
  title,
  timestamp,
  points,
  verified = false,
  category
}: ActionLogCardProps) {
  return (
    <Card className="p-4 hover-elevate">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-primary/10 text-primary flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{title}</h3>
            <Badge variant="secondary" className="flex-shrink-0 text-xs">
              +{points} pts
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-xs">{category}</span>
            <span>•</span>
            <span className="text-xs">{timestamp}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            {verified ? (
              <div className="flex items-center gap-1 text-xs text-primary">
                <CheckCircle className="w-3 h-3" />
                <span>Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Pending review</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}