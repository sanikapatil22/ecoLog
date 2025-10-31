import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Droplets, Recycle, Bike, Lightbulb, Package, Plus, Award } from "lucide-react";
import ImpactMetricCard from "@/components/ImpactMetricCard";
import ActionLogCard from "@/components/ActionLogCard";
import EcoPointsBadge from "@/components/EcoPointsBadge";
import LeaderboardItem from "@/components/LeaderboardItem";
import EmptyState from "@/components/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ActionTypeCard from "@/components/ActionTypeCard";
import { Link } from "wouter";

export default function Dashboard() {
  const [showLogAction, setShowLogAction] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState<string | null>(null);
  
  // todo: remove mock functionality - replace with real data
  const mockActions = [
    {
      id: 1,
      icon: <Bike className="w-5 h-5" />,
      title: "Biked to work (15 km)",
      timestamp: "2 hours ago",
      points: 50,
      verified: true,
      category: "Sustainable Commute"
    },
    {
      id: 2,
      icon: <Recycle className="w-5 h-5" />,
      title: "Recycled 5 kg of plastic",
      timestamp: "1 day ago",
      points: 30,
      verified: true,
      category: "Recycling"
    },
    {
      id: 3,
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Switched to LED bulbs",
      timestamp: "2 days ago",
      points: 40,
      verified: false,
      category: "Energy Saving"
    }
  ];

  const actionTypes = [
    { icon: <Lightbulb className="w-6 h-6" />, title: "Energy Saving", description: "Reduce electricity usage" },
    { icon: <Recycle className="w-6 h-6" />, title: "Recycling", description: "Recycle materials properly" },
    { icon: <Package className="w-6 h-6" />, title: "Upcycling", description: "Transform waste into value" },
    { icon: <Bike className="w-6 h-6" />, title: "Sustainable Commute", description: "Eco-friendly transport" },
  ];

  const handleLogAction = () => {
    setShowLogAction(true);
    console.log('Opening log action dialog');
  };

  const handleSelectActionType = (type: string) => {
    setSelectedActionType(type);
    console.log('Selected action type:', type);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Leaf className="w-8 h-8 text-primary" />
                <span className="font-serif font-bold text-2xl text-foreground">EcoLog</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <EcoPointsBadge points={2450} />
              <Button onClick={handleLogAction} className="gap-2" data-testid="button-log-action">
                <Plus className="w-4 h-4" />
                Log Action
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-4xl text-foreground mb-2">
            Welcome back, Alex!
          </h1>
          <p className="text-muted-foreground">
            Your environmental impact this month
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ImpactMetricCard
            icon={<Leaf className="w-5 h-5" />}
            value="245 kg"
            label="CO₂ Reduced"
            trend={12.5}
          />
          <ImpactMetricCard
            icon={<Droplets className="w-5 h-5" />}
            value="850 L"
            label="Water Saved"
            trend={8.3}
          />
          <ImpactMetricCard
            icon={<Recycle className="w-5 h-5" />}
            value="125 kg"
            label="Waste Diverted"
            trend={15.2}
          />
          <ImpactMetricCard
            icon={<Award className="w-5 h-5" />}
            value="2,450"
            label="EcoPoints Earned"
            trend={20.1}
          />
        </div>

        <Tabs defaultValue="actions" className="space-y-6">
          <TabsList data-testid="tabs-dashboard">
            <TabsTrigger value="actions" data-testid="tab-actions">Recent Actions</TabsTrigger>
            <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="rewards" data-testid="tab-rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-4">
            {mockActions.map((action) => (
              <ActionLogCard key={action.id} {...action} />
            ))}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <LeaderboardItem
              rank={1}
              name="Sarah Johnson"
              impact="1,250 kg CO₂"
              percentage={100}
              type="individual"
            />
            <LeaderboardItem
              rank={2}
              name="Michael Chen"
              impact="980 kg CO₂"
              percentage={78}
              type="individual"
            />
            <LeaderboardItem
              rank={3}
              name="Emma Williams"
              impact="875 kg CO₂"
              percentage={70}
              type="individual"
            />
            <LeaderboardItem
              rank={4}
              name="Alex Rivera"
              impact="650 kg CO₂"
              percentage={52}
              type="individual"
            />
          </TabsContent>

          <TabsContent value="rewards">
            <EmptyState
              title="Rewards Coming Soon"
              description="EcoPoints redemption marketplace will be available soon. Keep logging actions to accumulate points!"
              actionLabel="View My Points"
              onAction={() => console.log('View points clicked')}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showLogAction} onOpenChange={setShowLogAction}>
        <DialogContent className="max-w-2xl" data-testid="dialog-log-action">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Log Eco-Action</DialogTitle>
            <DialogDescription>
              Select the type of eco-friendly action you want to log
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {actionTypes.map((type) => (
              <ActionTypeCard
                key={type.title}
                {...type}
                selected={selectedActionType === type.title}
                onClick={() => handleSelectActionType(type.title)}
              />
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLogAction(false)}
              data-testid="button-cancel-action"
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedActionType}
              onClick={() => {
                console.log('Continuing with:', selectedActionType);
                setShowLogAction(false);
              }}
              data-testid="button-continue-action"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}