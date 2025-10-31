import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Droplets, Recycle, TrendingUp, Users, Award } from "lucide-react";
import heroImage from "@assets/generated_images/Diverse_eco-friendly_activities_hero_44179e7a.png";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

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

  // Don't show landing if authenticated (will redirect via useEffect)
  if (isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="font-serif font-bold text-2xl text-foreground">EcoLog</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md">Features</a>
              <a href="#impact" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md">Impact</a>
              <a href="#corporate" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md">For Business</a>
            </nav>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-login"
              >
                Sign In
              </Button>
              <Button
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif font-bold text-5xl md:text-6xl text-foreground mb-6">
                Track Your Impact,
                <span className="text-primary"> Earn Rewards</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Transform your eco-friendly actions into measurable environmental impact. 
                Log activities, visualize your contribution, and earn EcoPoints for sustainable choices.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-hero-start"
                >
                  <Leaf className="w-5 h-5" />
                  Start Logging
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-hero-corporate"
                >
                  For Corporates
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="font-serif font-bold text-3xl text-foreground mb-1">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-3xl text-foreground mb-1">2M kg</div>
                  <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-3xl text-foreground mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Companies</div>
                </div>
              </div>
            </div>
            <div>
              <img
                src={heroImage}
                alt="People engaged in eco-friendly activities"
                className="rounded-2xl shadow-xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-4xl text-foreground mb-4">
              Make Every Action Count
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track diverse eco-actions and see your collective environmental impact in real-time
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                Log Eco-Actions
              </h3>
              <p className="text-muted-foreground">
                Track energy saving, recycling, sustainable commuting, and upcycling activities with proof uploads
              </p>
            </Card>
            <Card className="p-6">
              <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                Visualize Impact
              </h3>
              <p className="text-muted-foreground">
                See real-time metrics for CO₂ reduction, water savings, and waste diverted from landfills
              </p>
            </Card>
            <Card className="p-6">
              <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                Earn EcoPoints
              </h3>
              <p className="text-muted-foreground">
                Gain points for verified actions and redeem them for discounts from sustainable brands
              </p>
            </Card>
            <Card className="p-6">
              <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                Corporate Dashboard
              </h3>
              <p className="text-muted-foreground">
                Aggregate team impact, run challenges, and generate sustainability reports for stakeholders
              </p>
            </Card>
            <Card className="p-6">
              <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-4">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                Track Water Savings
              </h3>
              <p className="text-muted-foreground">
                Monitor water conservation through sustainable choices and see cumulative savings over time
              </p>
            </Card>
            <Card className="p-6">
              <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-4">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                Waste Diversion
              </h3>
              <p className="text-muted-foreground">
                Track recycling and upcycling to measure how much waste you've kept out of landfills
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="impact" className="py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-serif font-bold text-4xl text-foreground mb-4">
            Collective Impact
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Join thousands making a measurable difference
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-card-border">
              <Leaf className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="font-serif font-bold text-5xl text-foreground mb-2">2.1M kg</div>
              <div className="text-muted-foreground">CO₂ Emissions Reduced</div>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-card-border">
              <Droplets className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="font-serif font-bold text-5xl text-foreground mb-2">850K L</div>
              <div className="text-muted-foreground">Water Conserved</div>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-card-border">
              <Recycle className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="font-serif font-bold text-5xl text-foreground mb-2">1.5M kg</div>
              <div className="text-muted-foreground">Waste Diverted</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-serif font-bold text-xl text-foreground">EcoLog</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 EcoLog. Making sustainability measurable and rewarding.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}