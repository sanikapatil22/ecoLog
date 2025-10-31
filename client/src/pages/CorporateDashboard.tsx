import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Leaf, Users, TrendingUp, Target, Droplets, Recycle, Award, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import StatCard from "@/components/StatCard";
import ImpactMetricCard from "@/components/ImpactMetricCard";
import LeaderboardItem from "@/components/LeaderboardItem";
import { useAuth } from "@/hooks/useAuth";
import corporateHeroImage from "@assets/generated_images/Sustainable_corporate_office_space_be4fd1f1.png";

export default function CorporateDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access the corporate dashboard.",
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

  // Don't render if not authenticated (will redirect via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return <CorporateDashboardContent user={user} />;
}

function CorporateDashboardContent({ user }: { user: any }) {

  // Fetch corporate metrics
  const { data: metrics } = useQuery({
    queryKey: ["/api/metrics/corporate"],
    select: (data: any) => ({
      co2Reduced: parseFloat(data.co2Reduced || "0"),
      waterSaved: parseFloat(data.waterSaved || "0"),
      wasteDiverted: parseFloat(data.wasteDiverted || "0"),
      ecoPoints: data.ecoPoints || 0,
      actionCount: data.actionCount || 0,
      activeEmployees: data.activeEmployees || 1,
    }),
    enabled: user?.accountType === "corporate",
  });

  // Fetch leaderboard for top employees
  const { data: topEmployees = [] } = useQuery<any[]>({
    queryKey: ["/api/leaderboard", { type: "individual" }],
    enabled: user?.accountType === "corporate",
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (user?.accountType !== "corporate") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="font-serif font-bold text-2xl text-foreground mb-2">
            Corporate Access Required
          </h2>
          <p className="text-muted-foreground mb-6">
            This dashboard is only available for corporate accounts. Please switch to your corporate account or contact support.
          </p>
          <Button onClick={() => window.location.href = "/dashboard"} data-testid="button-go-to-personal">
            Go to Personal Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="font-serif font-bold text-2xl text-foreground">EcoLog</span>
              <span className="text-sm text-muted-foreground ml-2">Corporate</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => window.location.href = "/dashboard"}
                data-testid="button-switch-personal"
              >
                Switch to Personal
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={corporateHeroImage}
          alt="Sustainable corporate office"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60 flex items-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-2">
              {user?.companyName || "Corporate"} Sustainability Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Organizational impact • {metrics?.activeEmployees ?? 1} team member{(metrics?.activeEmployees ?? 1) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Active Employees"
            value={(metrics?.activeEmployees ?? 1).toString()}
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            label="Total Actions"
            value={(metrics?.actionCount ?? 0).toLocaleString()}
            icon={<Target className="w-5 h-5" />}
          />
          <StatCard
            label="Participation Rate"
            value="100%"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard
            label="Team EcoPoints"
            value={(metrics?.ecoPoints ?? 0).toLocaleString()}
            icon={<Award className="w-5 h-5" />}
          />
        </div>

        <div className="mb-8">
          <h2 className="font-serif font-semibold text-2xl text-foreground mb-6">
            Organizational Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        </div>

        <Tabs defaultValue="top-performers" className="space-y-6">
          <TabsList data-testid="tabs-corporate">
            <TabsTrigger value="top-performers" data-testid="tab-performers">
              Top Performers
            </TabsTrigger>
            <TabsTrigger value="reports" data-testid="tab-reports">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top-performers" className="space-y-4">
            {topEmployees.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                  No employee data yet
                </h3>
                <p className="text-muted-foreground">
                  Employee performance will appear here once team members start logging actions
                </p>
              </Card>
            ) : (
              topEmployees.slice(0, 10).map((employee) => (
                <LeaderboardItem
                  key={employee.userId}
                  rank={employee.rank}
                  name={employee.name}
                  impact={`${employee.co2Reduced.toFixed(0)} kg CO₂`}
                  percentage={(employee.co2Reduced / (topEmployees[0]?.co2Reduced || 1)) * 100}
                  type="individual"
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="reports">
            <Card className="p-8 text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                Sustainability Reports
              </h3>
              <p className="text-muted-foreground mb-6">
                Generate comprehensive reports for stakeholders and regulatory compliance
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground">
                  Monthly Summary
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground">
                  Quarterly Review
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground">
                  Annual Report
                </span>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}