
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

  const scheduleNotification = (bedtimeDate: Date) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const now = new Date();
    const timeUntilBedtime = bedtimeDate.getTime() - now.getTime();
    
    if (timeUntilBedtime > 0) {
      timeoutRef.current = setTimeout(() => {
        playNotificationSound();
        setShowBedtimeToast(true);
        setScheduledTime(null);
        try {
            localStorage.removeItem("sleepSchedule");
        } catch (error) {
            console.error("Failed to remove from localStorage", error);
        }
      }, timeUntilBedtime);
    }
  };

  useEffect(() => {
    try {
      const savedTime = localStorage.getItem("sleepSchedule");
      if (savedTime) {
        const bedtimeDate = new Date(savedTime);
        if (bedtimeDate > new Date()) {
          const time = bedtimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          setBedtime(time);
          setScheduledTime(time);
          scheduleNotification(bedtimeDate);
        } else {
          localStorage.removeItem("sleepSchedule");
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showBedtimeToast) {
      toast({
        title: "🌙 Time for bed!",
        description: `It's ${new Date(`1970-01-01T${bedtime}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. Time to wind down and get some rest.`,
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
    const now = new Date();
    const [hours, minutes] = bedtime.split(":").map(Number);
    
    const bedtimeDate = new Date();
    bedtimeDate.setHours(hours, minutes, 0, 0);

    if (bedtimeDate < now) {
      bedtimeDate.setDate(bedtimeDate.getDate() + 1);
    }
    
    setScheduledTime(bedtime);

    try {
      localStorage.setItem("sleepSchedule", bedtimeDate.toISOString());
    } catch (error) {
      console.error("Failed to write to localStorage", error);
    }
    
    setScheduledToastTime(bedtimeDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    setShowScheduledToast(true);
    
    scheduleNotification(bedtimeDate);
  };
  
  const handleCancel = () => {
    if(timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setScheduledTime(null);
    setShowCanceledToast(true);
    try {
      localStorage.removeItem("sleepSchedule");
    } catch (error) {
      console.error("Failed to remove from localStorage", error);
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
            disabled={!!scheduledTime}
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
