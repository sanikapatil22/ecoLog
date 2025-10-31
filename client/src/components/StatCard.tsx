import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  iconBgColor = "bg-primary/10"
}: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBgColor} text-primary flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-0.5">{label}</p>
          <p className="font-serif font-bold text-2xl text-foreground">{value}</p>
        </div>
      </div>
    </Card>
  );
}