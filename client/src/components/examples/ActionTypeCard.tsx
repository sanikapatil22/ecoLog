import ActionTypeCard from '../ActionTypeCard';
import { Leaf } from 'lucide-react';
import { useState } from 'react';

export default function ActionTypeCardExample() {
  const [selected, setSelected] = useState(false);
  
  return (
    <div className="p-8 bg-background">
      <div className="max-w-xs">
        <ActionTypeCard
          icon={<Leaf className="w-6 h-6" />}
          title="Energy Saving"
          description="Reduce electricity usage"
          selected={selected}
          onClick={() => setSelected(!selected)}
        />
      </div>
    </div>
  );
}