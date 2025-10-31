import ActionLogCard from '../ActionLogCard';
import { Bike } from 'lucide-react';

export default function ActionLogCardExample() {
  return (
    <div className="p-8 bg-background">
      <ActionLogCard
        icon={<Bike className="w-5 h-5" />}
        title="Biked to work (15 km)"
        timestamp="2 hours ago"
        points={50}
        verified={true}
        category="Sustainable Commute"
      />
    </div>
  );
}