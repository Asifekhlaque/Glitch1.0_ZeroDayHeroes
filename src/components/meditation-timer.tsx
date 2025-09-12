"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Play, Pause, RotateCcw, Music2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MEDITATION_DURATION = 120; // 2 minutes in seconds

const CircularProgress = ({ progress }: { progress: number }) => {
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
          className="text-gray-700"
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
          {Math.floor((MEDITATION_DURATION * progress) / 100 / 60)
            .toString()
            .padStart(2, "0")}
          :
          {Math.floor(((MEDITATION_DURATION * progress) / 100) % 60)
            .toString()
            .padStart(2, "0")}
        </span>
        <span className="text-muted-foreground">Time Remaining</span>
      </div>
    </div>
  );
};

export default function MeditationTimer() {
  const [timeLeft, setTimeLeft] = useState(MEDITATION_DURATION);
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Web Audio API logic must run on the client
    if (typeof window !== 'undefined' && !audioContextRef.current) {
        const audioContext = new window.AudioContext();
        audioContextRef.current = audioContext;

        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A gentle A3 note

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start silent

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();

        oscillatorRef.current = oscillator;
        gainRef.current = gainNode;
    }

    return () => {
        // Clean up on unmount
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      
      // Start or resume audio
      if (audioContextRef.current && gainRef.current) {
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        gainRef.current.gain.linearRampToValueAtTime(0.1, audioContextRef.current.currentTime + 0.5);
      }

    } else {
       // Pause audio
      if (gainRef.current && audioContextRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.5);
      }
      if (timeLeft === 0 && isActive) {
        setIsActive(false);
        toast({
          title: "Meditation Complete!",
          description: "You've successfully completed your 2-minute meditation.",
        });
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, toast]);

  const toggleTimer = () => {
    if (timeLeft > 0) {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MEDITATION_DURATION);
  };

  const progressPercentage = (timeLeft / MEDITATION_DURATION) * 100;
  const isFinished = timeLeft === 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Mindful Moment</CardTitle>
        <CardDescription>A 2-minute meditation session.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6">
        <CircularProgress progress={progressPercentage} />
        <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-muted">
          <Music2 className="w-5 h-5" />
          <span>
            {isActive ? "Calm sound is playing..." : "Sound is paused"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button onClick={toggleTimer} size="lg" disabled={isFinished}>
          {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {isActive ? "Pause" : isFinished ? "Finished" : "Start"}
        </Button>
        <Button
          onClick={resetTimer}
          variant="outline"
          size="lg"
          disabled={isActive}
        >
          <RotateCcw className="mr-2" />
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
