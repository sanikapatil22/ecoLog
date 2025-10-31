import ImpactMetricCard from '../ImpactMetricCard';
import { Leaf } from 'lucide-react';

export default function ImpactMetricCardExample() {
  return (
    <div className="p-8 bg-background">
      <ImpactMetricCard
        icon={<Leaf className="w-5 h-5" />}
        value="2,450 kg"
        label="CO₂ Reduced"
        trend={12.5}
        period="vs last month"
      />
    </div>
  );
}