
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

const CircularProgress = ({ progress, timeLeft }: { progress: number, timeLeft: number }) => {
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
          {Math.floor(timeLeft / 60)
            .toString()
            .padStart(2, "0")}
          :
          {(timeLeft % 60)
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
  const audioInitialized = useRef(false);

  const initializeAudio = () => {
    if (audioInitialized.current || typeof window === 'undefined') return;
    
    const context = new window.AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, context.currentTime); // A gentle A3 note
    gainNode.gain.setValueAtTime(0, context.currentTime); // Start silent

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();

    audioContextRef.current = context;
    oscillatorRef.current = oscillator;
    gainRef.current = gainNode;
    audioInitialized.current = true;
  };
  
  const playCompletionSound = () => {
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
      gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + startTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + startTime + duration);
    };
  
    // A simple, pleasant completion chime
    playNote(523.25, 0, 0.3); // C5
    playNote(659.25, 0.2, 0.3); // E5
    playNote(783.99, 0.4, 0.4); // G5
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playCompletionSound();
      toast({
        title: "Congratulations!",
        description: "You have completed your Meditation.",
      });
      if (gainRef.current && audioContextRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.5);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, toast]);

  useEffect(() => {
    // Cleanup audio context on component unmount
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const toggleTimer = () => {
    if (timeLeft <= 0) return;

    if (!audioInitialized.current) {
      initializeAudio();
    }
    
    const audioContext = audioContextRef.current;
    const gainNode = gainRef.current;

    if (audioContext && gainNode) {
      if (!isActive) {
        // User is starting the timer
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.5);
      } else {
        // User is pausing the timer
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      }
    }
    
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MEDITATION_DURATION);
    const audioContext = audioContextRef.current;
    const gainNode = gainRef.current;
    if (audioContext && gainNode) {
        gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    }
  };

  const progressPercentage = ((MEDITATION_DURATION - timeLeft) / MEDITATION_DURATION) * 100;
  const isFinished = timeLeft === 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Mindful Moment</CardTitle>
        <CardDescription>A 2-minute meditation session.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6">
        <CircularProgress progress={progressPercentage} timeLeft={timeLeft} />
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
        >
          <RotateCcw className="mr-2" />
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
