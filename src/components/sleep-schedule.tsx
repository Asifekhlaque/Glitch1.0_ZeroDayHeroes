
"use client";

import { useState, useRef, useEffect } from 'react';
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
import { useToast } from "@/hooks/use-toast";
import { AlarmClock, BellRing } from "lucide-react";

export default function SleepSchedule() {
  const [bedtime, setBedtime] = useState("22:00");
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioInitialized = useRef(false);
  const [showBedtimeToast, setShowBedtimeToast] = useState(false);
  const [showScheduledToast, setShowScheduledToast] = useState(false);
  const [showCanceledToast, setShowCanceledToast] = useState(false);
  const [scheduledToastTime, setScheduledToastTime] = useState('');

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

    const playNote = (frequency: number, startTime: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + 5);
    };

    playNote(523.25, 0); // C5
    playNote(659.25, 0.5); // E5
    playNote(783.99, 1); // G5
  };
  
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showBedtimeToast) {
      toast({
        title: "🌙 Time for bed!",
        description: `It's ${bedtime}. Time to wind down and get some rest.`,
        duration: 10000,
      });
      setShowBedtimeToast(false);
    }
  }, [showBedtimeToast, bedtime, toast]);

  useEffect(() => {
    if (showScheduledToast) {
       toast({
        title: "Bedtime Scheduled!",
        description: `We'll remind you to go to bed at ${scheduledToastTime}.`,
      });
      setShowScheduledToast(false);
    }
  }, [showScheduledToast, scheduledToastTime, toast]);

  useEffect(() => {
    if (showCanceledToast) {
      toast({
        title: "Bedtime Reminder Canceled",
        description: "Your bedtime reminder has been turned off.",
      });
      setShowCanceledToast(false);
    }
  }, [showCanceledToast, toast]);


  const handleSetBedtime = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setScheduledTime(bedtime);

    const now = new Date();
    const [hours, minutes] = bedtime.split(":").map(Number);
    
    const bedtimeDate = new Date();
    bedtimeDate.setHours(hours, minutes, 0, 0);

    if (bedtimeDate < now) {
      bedtimeDate.setDate(bedtimeDate.getDate() + 1);
    }

    const timeUntilBedtime = bedtimeDate.getTime() - now.getTime();
    
    setScheduledToastTime(bedtimeDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    setShowScheduledToast(true);
    
    timeoutRef.current = setTimeout(() => {
      playNotificationSound();
      setShowBedtimeToast(true);
      setScheduledTime(null);
    }, timeUntilBedtime);
  };
  
  const handleCancel = () => {
    if(timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setScheduledTime(null);
      setShowCanceledToast(true);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Set Your Bedtime</CardTitle>
        <CardDescription>
          A consistent sleep schedule is key to good health.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 w-full">
          <AlarmClock className="w-8 h-8 text-primary" />
          <Input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="text-lg"
          />
        </div>
        {scheduledTime && (
            <div className="flex items-center gap-2 text-muted-foreground p-3 rounded-lg bg-muted/50 text-center text-sm w-full">
                <BellRing className="w-5 h-5 text-green-500"/> 
                <span>Reminder is active for {new Date(`1970-01-01T${scheduledTime}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.</span>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row gap-2">
        <Button onClick={handleSetBedtime} className="w-full" disabled={!!scheduledTime}>
          {scheduledTime ? "Reminder Set" : "Set Bedtime Reminder"}
        </Button>
        {scheduledTime && (
             <Button onClick={handleCancel} className="w-full" variant="outline">
                Cancel Reminder
             </Button>
        )}
      </CardFooter>
    </Card>
  );
}
