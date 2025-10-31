import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Droplets, Recycle, Bike, Lightbulb, Package, Plus, Award, LogOut } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ActionTypeCard from "@/components/ActionTypeCard";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Action } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access your dashboard.",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated (will redirect via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return <DashboardContent user={user} />;
}

function DashboardContent({ user }: { user: any }) {
  const { toast } = useToast();
  const [showLogAction, setShowLogAction] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    unit: "",
  });

  // Fetch user actions
  const { data: actions = [] } = useQuery<Action[]>({
    queryKey: ["/api/actions"],
  });

  // Fetch personal metrics
  const { data: metrics } = useQuery({
    queryKey: ["/api/metrics/personal"],
    select: (data: any) => ({
      co2Reduced: parseFloat(data.co2Reduced || "0"),
      waterSaved: parseFloat(data.waterSaved || "0"),
      wasteDiverted: parseFloat(data.wasteDiverted || "0"),
      ecoPoints: data.ecoPoints || 0,
    }),
  });

  // Fetch leaderboard
  const { data: leaderboard = [] } = useQuery<any[]>({
    queryKey: ["/api/leaderboard"],
  });

  // Create action mutation
  const createActionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/actions", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/actions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics/personal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Action logged successfully!",
        description: "Your eco-friendly action has been recorded.",
      });
      setShowLogAction(false);
      setSelectedActionType(null);
      setFormData({ title: "", description: "", quantity: "", unit: "" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to log action. Please try again.",
        variant: "destructive",
      });
    },
  });

  const actionTypes = [
    { id: "energy_saving", icon: <Lightbulb className="w-6 h-6" />, title: "Energy Saving", description: "Reduce electricity usage", unit: "kWh" },
    { id: "recycling", icon: <Recycle className="w-6 h-6" />, title: "Recycling", description: "Recycle materials properly", unit: "kg" },
    { id: "upcycling", icon: <Package className="w-6 h-6" />, title: "Upcycling", description: "Transform waste into value", unit: "kg" },
    { id: "sustainable_commute", icon: <Bike className="w-6 h-6" />, title: "Sustainable Commute", description: "Eco-friendly transport", unit: "km" },
  ];

  const handleLogAction = () => {
    setShowLogAction(true);
  };

  const handleSelectActionType = (typeId: string) => {
    setSelectedActionType(typeId);
    const type = actionTypes.find(t => t.id === typeId);
    if (type) {
      setFormData(prev => ({ ...prev, unit: type.unit }));
    }
  };

  const handleSubmitAction = () => {
    if (!selectedActionType || !formData.title || !formData.quantity) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createActionMutation.mutate({
      category: selectedActionType,
      title: formData.title,
      description: formData.description,
      quantity: formData.quantity,
      unit: formData.unit,
    });
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "energy_saving":
        return <Lightbulb className="w-5 h-5" />;
      case "recycling":
        return <Recycle className="w-5 h-5" />;
      case "upcycling":
        return <Package className="w-5 h-5" />;
      case "sustainable_commute":
        return <Bike className="w-5 h-5" />;
      default:
        return <Leaf className="w-5 h-5" />;
    }
  };

  const formatCategory = (category: string) => {
    return category.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const formatTimestamp = (date: Date | string) => {
    const actionDate = new Date(date);
    const now = new Date();
    const diff = now.getTime() - actionDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="font-serif font-bold text-2xl text-foreground">EcoLog</span>
            </div>
            <div className="flex items-center gap-4">
              <EcoPointsBadge points={metrics?.ecoPoints || 0} />
              <Button onClick={handleLogAction} className="gap-2" data-testid="button-log-action">
                <Plus className="w-4 h-4" />
                Log Action
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-4xl text-foreground mb-2">
            Welcome back, {user?.firstName || user?.email}!
          </h1>
          <p className="text-muted-foreground">
            Your environmental impact this month
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ImpactMetricCard
            icon={<Leaf className="w-5 h-5" />}
            value={`${metrics?.co2Reduced?.toFixed(1) ?? "0.0"} kg`}
            label="CO₂ Reduced"
          />
          <ImpactMetricCard
            icon={<Droplets className="w-5 h-5" />}
            value={`${metrics?.waterSaved?.toFixed(0) ?? "0"} L`}
            label="Water Saved"
          />
          <ImpactMetricCard
            icon={<Recycle className="w-5 h-5" />}
            value={`${metrics?.wasteDiverted?.toFixed(1) ?? "0.0"} kg`}
            label="Waste Diverted"
          />
          <ImpactMetricCard
            icon={<Award className="w-5 h-5" />}
            value={(metrics?.ecoPoints ?? 0).toLocaleString()}
            label="EcoPoints Earned"
          />
        </div>

        <Tabs defaultValue="actions" className="space-y-6">
          <TabsList data-testid="tabs-dashboard">
            <TabsTrigger value="actions" data-testid="tab-actions">Recent Actions</TabsTrigger>
            <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-4">
            {actions.length === 0 ? (
              <EmptyState
                title="Start Your Eco Journey"
                description="Log your first eco-friendly action to start making a positive impact on the environment."
                actionLabel="Log Your First Action"
                onAction={handleLogAction}
              />
            ) : (
              actions.map((action) => (
                <ActionLogCard
                  key={action.id}
                  icon={getCategoryIcon(action.category)}
                  title={action.title}
                  timestamp={formatTimestamp(action.createdAt!)}
                  points={action.pointsEarned}
                  verified={action.verified}
                  category={formatCategory(action.category)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            {leaderboard.map((item) => (
              <LeaderboardItem
                key={item.userId}
                rank={item.rank}
                name={item.name}
                impact={`${item.co2Reduced.toFixed(0)} kg CO₂`}
                percentage={(item.co2Reduced / (leaderboard[0]?.co2Reduced || 1)) * 100}
                type="individual"
              />
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showLogAction} onOpenChange={setShowLogAction}>
        <DialogContent className="max-w-2xl" data-testid="dialog-log-action">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Log Eco-Action</DialogTitle>
            <DialogDescription>
              {!selectedActionType
                ? "Select the type of eco-friendly action you want to log"
                : "Provide details about your eco-action"}
            </DialogDescription>
          </DialogHeader>

          {!selectedActionType ? (
            <div className="grid grid-cols-2 gap-4 py-4">
              {actionTypes.map((type) => (
                <ActionTypeCard
                  key={type.id}
                  {...type}
                  selected={selectedActionType === type.id}
                  onClick={() => handleSelectActionType(type.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Biked to work"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  data-testid="input-action-title"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity ({formData.unit}) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 15"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  data-testid="input-action-quantity"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  data-testid="input-action-description"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedActionType(null)}
                className="w-full"
                data-testid="button-back-to-types"
              >
                Back to Action Types
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowLogAction(false);
                setSelectedActionType(null);
                setFormData({ title: "", description: "", quantity: "", unit: "" });
              }}
              data-testid="button-cancel-action"
            >
              Cancel
            </Button>
            {selectedActionType && (
              <Button
                onClick={handleSubmitAction}
                disabled={createActionMutation.isPending}
                data-testid="button-submit-action"
              >
                {createActionMutation.isPending ? "Logging..." : "Log Action"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}