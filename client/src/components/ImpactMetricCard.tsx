import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ImpactMetricCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend?: number;
  period?: string;
}

export default function ImpactMetricCard({
  icon,
  value,
  label,
  trend,
  period = "this month"
}: ImpactMetricCardProps) {
  const isPositive = trend && trend > 0;
  
  return (
    <Card className="p-6 hover-elevate">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          </div>
          <div className="font-serif font-bold text-4xl mb-1 text-foreground">
            {value}
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            {label}
          </div>
          {trend !== undefined && (
            <div className="flex items-center gap-1 text-xs">
              {isPositive ? (
                <TrendingUp className="w-3 h-3 text-primary" />
              ) : (
                <TrendingDown className="w-3 h-3 text-destructive" />
              )}
              <span className={isPositive ? "text-primary" : "text-destructive"}>
                {Math.abs(trend)}%
              </span>
              <span className="text-muted-foreground">{period}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}