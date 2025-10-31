import { Card } from "@/components/ui/card";

interface ActionTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function ActionTypeCard({
  icon,
  title,
  description,
  selected = false,
  onClick
}: ActionTypeCardProps) {
  return (
    <Card
      className={`p-6 cursor-pointer hover-elevate active-elevate-2 transition-all ${
        selected ? 'border-primary border-2' : ''
      }`}
      onClick={onClick}
      data-testid={`card-action-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`p-3 rounded-xl ${selected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}