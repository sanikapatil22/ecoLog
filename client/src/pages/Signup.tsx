import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startAsGuest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/guest', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to create guest session');
      toast({ title: 'Welcome!', description: 'Signed in as guest. You can start logging actions.' });
      setLocation('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: err?.message || 'Could not start as guest' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-xl w-full p-8 bg-card rounded-2xl shadow">
        <h1 className="font-serif text-2xl font-bold mb-4">Get started</h1>
        <p className="text-sm text-muted-foreground mb-6">Start logging eco-actions quickly. For a full account, sign in via your provider.</p>
        <div className="flex gap-3">
          <Button onClick={startAsGuest} disabled={loading}>
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" />
            ) : null}
            Start as Guest
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/api/login'}>Sign in</Button>
        </div>
      </div>
    </div>
  );
}
