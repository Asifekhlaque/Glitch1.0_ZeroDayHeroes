
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    // On component mount, clear any existing user stats to simulate a new login session.
    try {
      localStorage.removeItem('userStats');
      localStorage.removeItem('waterHistory');
      localStorage.removeItem('hydrationReminder');
      localStorage.removeItem('userName');
    } catch (error) {
      console.error("Failed to clear localStorage", error);
    }
  }, []);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        localStorage.setItem('userName', name.trim());
      } catch (error) {
        console.error("Failed to save user name to localStorage", error);
      }
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-4 text-center">
            <div className="inline-flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <Activity className="h-7 w-7 text-primary-foreground" />
                </div>
            </div>
          <CardTitle className="text-3xl font-bold font-headline">Welcome to Mental Boost</CardTitle>
          <CardDescription>
            Enter your name to start your wellness journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Start Journey
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            This is a demo. No real authentication is performed.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
