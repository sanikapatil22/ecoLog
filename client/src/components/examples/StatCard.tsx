import StatCard from '../StatCard';
import { Users } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-8 bg-background">
      <StatCard
        label="Active Users"
        value="1,234"
        icon={<Users className="w-5 h-5" />}
      />
    </div>
  );
}