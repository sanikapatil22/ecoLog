import { Button } from "@/components/ui/button";
import emptyStateImage from "@assets/generated_images/Starting_eco-journey_illustration_f9d9caf7.png";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <img
        src={emptyStateImage}
        alt="Start your eco journey"
        className="w-48 h-48 object-contain mb-6 opacity-80"
      />
      <h3 className="font-serif font-semibold text-2xl mb-2 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg" data-testid="button-empty-action">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}