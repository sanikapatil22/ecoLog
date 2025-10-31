import { Leaf, Users, TrendingUp, Target, Droplets, Recycle, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/StatCard";
import ImpactMetricCard from "@/components/ImpactMetricCard";
import LeaderboardItem from "@/components/LeaderboardItem";
import { Link } from "wouter";
import corporateHeroImage from "@assets/generated_images/Sustainable_corporate_office_space_be4fd1f1.png";

export default function CorporateDashboard() {
  // todo: remove mock functionality
  const topEmployees = [
    { rank: 1, name: "Sarah Johnson", impact: "1,250 kg CO₂", percentage: 100 },
    { rank: 2, name: "Michael Chen", impact: "980 kg CO₂", percentage: 78 },
    { rank: 3, name: "Emma Williams", impact: "875 kg CO₂", percentage: 70 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Leaf className="w-8 h-8 text-primary" />
                <span className="font-serif font-bold text-2xl text-foreground">EcoLog</span>
                <span className="text-sm text-muted-foreground ml-2">Corporate</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                  Switch to Personal
                </span>
              </Link>
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
              TechCorp Sustainability Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Organizational impact • 245 team members
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Active Employees"
            value="245"
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            label="Total Actions"
            value="1,432"
            icon={<Target className="w-5 h-5" />}
          />
          <StatCard
            label="Participation Rate"
            value="82%"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard
            label="Team EcoPoints"
            value="45.2K"
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
              value="12,450 kg"
              label="CO₂ Reduced"
              trend={18.5}
              period="vs last quarter"
            />
            <ImpactMetricCard
              icon={<Droplets className="w-5 h-5" />}
              value="8,500 L"
              label="Water Saved"
              trend={12.3}
              period="vs last quarter"
            />
            <ImpactMetricCard
              icon={<Recycle className="w-5 h-5" />}
              value="6,250 kg"
              label="Waste Diverted"
              trend={22.1}
              period="vs last quarter"
            />
          </div>
        </div>

        <Tabs defaultValue="top-performers" className="space-y-6">
          <TabsList data-testid="tabs-corporate">
            <TabsTrigger value="top-performers" data-testid="tab-performers">
              Top Performers
            </TabsTrigger>
            <TabsTrigger value="departments" data-testid="tab-departments">
              Departments
            </TabsTrigger>
            <TabsTrigger value="reports" data-testid="tab-reports">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top-performers" className="space-y-4">
            {topEmployees.map((employee) => (
              <LeaderboardItem
                key={employee.rank}
                rank={employee.rank}
                name={employee.name}
                impact={employee.impact}
                percentage={employee.percentage}
                type="individual"
              />
            ))}
          </TabsContent>

          <TabsContent value="departments">
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-foreground">Engineering</h3>
                  <span className="text-primary font-semibold">4,250 kg CO₂</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Team Size</p>
                    <p className="font-semibold text-foreground">85</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Participation</p>
                    <p className="font-semibold text-foreground">92%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Actions</p>
                    <p className="font-semibold text-foreground">487</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg/Person</p>
                    <p className="font-semibold text-foreground">50 kg</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-foreground">Sales & Marketing</h3>
                  <span className="text-primary font-semibold">3,850 kg CO₂</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Team Size</p>
                    <p className="font-semibold text-foreground">72</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Participation</p>
                    <p className="font-semibold text-foreground">78%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Actions</p>
                    <p className="font-semibold text-foreground">398</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg/Person</p>
                    <p className="font-semibold text-foreground">53 kg</p>
                  </div>
                </div>
              </Card>
            </div>
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