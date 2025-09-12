
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
  const [showHydrationToast, setShowHydrationToast] = useState(false);
  const [showStartedToast, setShowStartedToast] = useState(false);
  const [showStoppedToast, setShowStoppedToast] = useState(false);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem("hydrationReminder");
      if (savedState) {
        const { interval, endTime, active } = JSON.parse(savedState);
        if (active && endTime && Date.now() < endTime) {
          setIntervalMinutes(interval);
          setIsActive(true);
          setTimeLeft(Math.round((endTime - Date.now()) / 1000));
        } else if (active) {
            // Timer expired while tab was closed
            setShowHydrationToast(true);
            const newEndTime = Date.now() + interval * 60 * 1000;
            localStorage.setItem("hydrationReminder", JSON.stringify({ interval, endTime: newEndTime, active: true }));
            setTimeLeft(interval * 60);
        } else {
          localStorage.removeItem("hydrationReminder");
        }
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
  }, []);

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

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const playNote = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + startTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + startTime + duration);
    };

    const noteDuration = 0.4;
    const totalDuration = 5;
    let time = 0;
    
    while(time < totalDuration) {
      playNote(523.25, time, noteDuration); // C5
      playNote(659.25, time, noteDuration); // E5
      playNote(783.99, time + 0.2, noteDuration); // G5
      time += 1.5;
    }
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
        try {
          const savedState = localStorage.getItem("hydrationReminder");
          if (!savedState) {
            setIsActive(false);
            return;
          }
          const { endTime, interval } = JSON.parse(savedState);
          const remaining = Math.round((endTime - Date.now()) / 1000);

          if (remaining <= 0) {
            playNotificationSound();
            setShowHydrationToast(true);
            const newEndTime = Date.now() + interval * 60 * 1000;
            localStorage.setItem("hydrationReminder", JSON.stringify({ interval, endTime: newEndTime, active: true }));
            setTimeLeft(interval * 60);
          } else {
            setTimeLeft(remaining);
          }
        } catch (error) {
          console.error("Error in timer interval", error);
          setIsActive(false);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive]);

  useEffect(() => {
    if (showHydrationToast) {
      toast({
        title: "💧 Time to hydrate!",
        description: "Take a moment to drink a glass of water.",
        duration: 10000,
      });
      setShowHydrationToast(false);
    }
  }, [showHydrationToast, toast]);

  useEffect(() => {
    if (showStartedToast) {
      toast({
        title: "Reminders Started!",
        description: `We'll remind you to drink water every ${intervalMinutes} minutes.`,
      });
      setShowStartedToast(false);
    }
  }, [showStartedToast, intervalMinutes, toast]);

  useEffect(() => {
    if (showStoppedToast) {
      toast({
        title: "Reminders Stopped",
        description: "Hydration reminders have been paused.",
      });
      setShowStoppedToast(false);
    }
  }, [showStoppedToast, toast]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(intervalMinutes * 60);
    }
  }, [intervalMinutes]);

  const handleStart = () => {
    const duration = intervalMinutes * 60;
    const endTime = Date.now() + duration * 1000;
    
    try {
      localStorage.setItem("hydrationReminder", JSON.stringify({
        interval: intervalMinutes,
        endTime: endTime,
        active: true,
      }));
    } catch (error) {
        console.error("Failed to write to localStorage", error);
    }

    setTimeLeft(duration);
    setIsActive(true);
    setShowStartedToast(true);
  };

  const handleStop = () => {
    setIsActive(false);
    setShowStoppedToast(true);
    setTimeLeft(intervalMinutes * 60);
    try {
      localStorage.removeItem("hydrationReminder");
    } catch (error) {
        console.error("Failed to remove from localStorage", error);
    }
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
            onChange={(e) => {
              if (!isActive) {
                setIntervalMinutes(Math.max(1, parseInt(e.target.value) || 1))
              }
            }}
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
