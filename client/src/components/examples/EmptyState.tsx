import EmptyState from '../EmptyState';

export default function EmptyStateExample() {
  return (
    <div className="p-8 bg-background">
      <EmptyState
        title="Start Your Eco Journey"
        description="Log your first eco-friendly action to start making a positive impact on the environment."
        actionLabel="Log Your First Action"
        onAction={() => console.log('Log action clicked')}
      />
    </div>
  );
}