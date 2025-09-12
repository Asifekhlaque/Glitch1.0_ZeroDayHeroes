
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, BellRing } from "lucide-react";

const CircularProgress = ({
  progress,
  timeLeft,
}: {
  progress: number;
  timeLeft: number;
}) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-64 h-64">
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth="12"
          fill="transparent"
        />
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-5xl font-bold text-foreground">
          {Math.floor(timeLeft / 60)
            .toString()
            .padStart(2, "0")}
          :
          {(timeLeft % 60).toString().padStart(2, "0")}
        </span>
        <span className="text-muted-foreground">Next Reminder</span>
      </div>
    </div>
  );
};

export default function WaterReminder() {
  const [intervalMinutes, setIntervalMinutes] = useState(30);
  const [timeLeft, setTimeLeft] = useState(intervalMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioInitialized = useRef(false);

  const initializeAudio = () => {
    if (audioInitialized.current || typeof window === 'undefined') return;
    
    const context = new window.AudioContext();
    audioContextRef.current = context;
    audioInitialized.current = true;
  };

  const playNotificationSound = () => {
    initializeAudio();
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
    
    oscillator.start();

    setTimeout(() => {
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      setTimeout(() => oscillator.stop(), 500);
    }, 5000); // Play for 5 seconds
  };
  
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);


  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isActive) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playNotificationSound();
            toast({
              title: "💧 Time to hydrate!",
              description: "Take a moment to drink a glass of water.",
              duration: 10000,
            });
            return intervalMinutes * 60; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, intervalMinutes, toast]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(intervalMinutes * 60);
    }
  }, [intervalMinutes, isActive]);

  const handleStart = () => {
    setTimeLeft(intervalMinutes * 60);
    setIsActive(true);
    toast({
      title: "Reminders Started!",
      description: `We'll remind you to drink water every ${intervalMinutes} minutes.`,
    });
  };

  const handleStop = () => {
    setIsActive(false);
    toast({
      title: "Reminders Stopped",
      description: "Hydration reminders have been paused.",
    });
  };

  const progress = (timeLeft / (intervalMinutes * 60)) * 100;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Hydration Tracker</CardTitle>
        <CardDescription>
          Set how often you want to be reminded to drink water.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="interval">Reminder Interval (minutes)</Label>
          <Input
            id="interval"
            type="number"
            min="1"
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(Math.max(1, parseInt(e.target.value) || 1))}
            disabled={isActive}
            className="text-lg"
          />
        </div>
        {isActive ? (
          <CircularProgress progress={progress} timeLeft={timeLeft} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 w-64 rounded-full border-4 border-dashed bg-muted/50">
            <BellRing className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Reminders are off</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        {!isActive ? (
          <Button onClick={handleStart} size="lg">
            <Play className="mr-2" /> Start Reminders
          </Button>
        ) : (
          <Button onClick={handleStop} variant="destructive" size="lg">
            <Pause className="mr-2" /> Stop Reminders
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
