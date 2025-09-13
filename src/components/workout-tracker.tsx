
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { format, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WORKOUT_DURATION = 25 * 60; // 25 minutes in seconds

const initialExercises = [
    { id: "pushups", name: "Push-ups (3 sets of 10-15 reps)", done: false },
    { id: "squats", name: "Squats (3 sets of 12-15 reps)", done: false },
    { id: "plank", name: "Plank (3 sets of 30-60 seconds)", done: false },
    { id: "jumping-jacks", name: "Jumping Jacks (3 sets of 30-60 seconds)", done: false },
    { id: "lunges", name: "Lunges (3 sets of 10-12 reps per leg)", done: false },
    { id: "bicep-curls", name: "Bicep Curls (3 sets of 10-12 reps per arm)", done: false },
];

const medalTiers = {
  0: { name: 'No Medal', level: 0 },
  1: { name: 'Bronze', level: 1 },
  2: { name: 'Silver', level: 2 },
  3: { name: 'Gold', level: 3 },
  4: { name: 'Diamond', level: 4 },
  5: { name: 'Expert', level: 5 },
};

const getMedalForCompletions = (completions: number) => {
  if (completions >= 5) return medalTiers[5];
  if (completions >= 4) return medalTiers[4];
  if (completions >= 3) return medalTiers[3];
  if (completions >= 2) return medalTiers[2];
  if (completions >= 1) return medalTiers[1];
  return medalTiers[0];
};

const CircularProgress = ({ progress, timeLeft }: { progress: number, timeLeft: number }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-64 h-64">
        <circle cx="128" cy="128" r={radius} stroke="hsl(var(--border))" strokeWidth="12" fill="transparent" />
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
          {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </span>
        <span className="text-muted-foreground">Time Remaining</span>
      </div>
    </div>
  );
};

export default function WorkoutTracker() {
  const [timeLeft, setTimeLeft] = useState(WORKOUT_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [exercises, setExercises] = useState(() => initialExercises.map(e => ({...e})));
  const [workoutCompletedToday, setWorkoutCompletedToday] = useState(false);
  const { toast } = useToast();
  const todayStr = format(startOfDay(new Date()), "yyyy-MM-dd");

  const completeWorkout = useCallback(() => {
    if (workoutCompletedToday) return;

    try {
      const statsRaw = localStorage.getItem("userStats");
      const userStats = statsRaw ? JSON.parse(statsRaw) : { workoutCompletions: 0 };
      const oldCompletions = userStats.workoutCompletions || 0;
      const newCompletions = oldCompletions + 1;

      userStats.workoutCompletions = newCompletions;
      userStats.lastWorkoutDate = todayStr;
      localStorage.setItem("userStats", JSON.stringify(userStats));

      const oldMedal = getMedalForCompletions(oldCompletions);
      const newMedal = getMedalForCompletions(newCompletions);

      if (newMedal.level > oldMedal.level) {
        toast({
          title: `🏅 New Medal Unlocked: ${newMedal.name}!`,
          description: `You've completed ${newCompletions} workout${newCompletions > 1 ? 's' : ''}. Incredible!`,
        });
      } else {
        toast({
          title: "Workout Complete!",
          description: "Great job finishing your workout for the day.",
        });
      }
      setWorkoutCompletedToday(true);
    } catch (error) {
      console.error("Failed to update workout stats", error);
    }
  }, [workoutCompletedToday, todayStr, toast]);

  useEffect(() => {
    try {
        const statsRaw = localStorage.getItem("userStats");
        const stats = statsRaw ? JSON.parse(statsRaw) : {};
        if (stats.lastWorkoutDate === todayStr) {
            setWorkoutCompletedToday(true);
            const savedExercises = localStorage.getItem('workoutExercises');
            if (savedExercises) {
                setExercises(JSON.parse(savedExercises));
            }
        }
    } catch (error) {
        console.error("Failed to load workout completion status", error);
    }
  }, [todayStr]);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      completeWorkout();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, completeWorkout]);
  
  useEffect(() => {
      const allDone = exercises.every(ex => ex.done);
      if (allDone) {
          completeWorkout();
      }
      try {
        localStorage.setItem('workoutExercises', JSON.stringify(exercises));
      } catch (error) {
        console.error("Failed to save exercises to localStorage", error);
      }
  }, [exercises, completeWorkout]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(WORKOUT_DURATION);
    setExercises(initialExercises.map(e => ({...e})));
    if (workoutCompletedToday) {
        try {
            const statsRaw = localStorage.getItem("userStats");
            const userStats = statsRaw ? JSON.parse(statsRaw) : { workoutCompletions: 0 };
            const currentCompletions = userStats.workoutCompletions || 0;
            userStats.workoutCompletions = Math.max(0, currentCompletions - 1);
            delete userStats.lastWorkoutDate;
            localStorage.setItem("userStats", JSON.stringify(userStats));
            localStorage.removeItem('workoutExercises');
            setWorkoutCompletedToday(false);
             toast({
                title: "Workout Reset",
                description: "Your workout for today has been reset.",
            });
        } catch (error) {
            console.error("Failed to reset workout stats", error);
        }
    }
  };

  const handleExerciseCheck = (id: string) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, done: !ex.done } : ex));
  };

  const progressPercentage = ((WORKOUT_DURATION - timeLeft) / WORKOUT_DURATION) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Dumbbell className="w-6 h-6 text-primary" />
          General Workout Session
        </CardTitle>
        <CardDescription>
          Start the 25-minute timer or check off exercises as you complete them.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center gap-4">
          <CircularProgress progress={progressPercentage} timeLeft={timeLeft} />
          <div className="flex justify-center gap-4">
            <Button onClick={toggleTimer} size="lg" disabled={workoutCompletedToday}>
              {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetTimer} size="lg" variant="outline">
              <RotateCcw className="mr-2" />
              Reset
            </Button>
          </div>
        </div>
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Exercise Checklist</h3>
            {exercises.map(exercise => (
                <div key={exercise.id} className="flex items-center space-x-2">
                    <Checkbox
                        id={exercise.id}
                        checked={exercise.done}
                        onCheckedChange={() => handleExerciseCheck(exercise.id)}
                        disabled={workoutCompletedToday}
                    />
                    <Label htmlFor={exercise.id} className={`flex-1 ${exercise.done ? 'line-through text-muted-foreground' : ''} ${workoutCompletedToday ? 'cursor-not-allowed' : ''}`}>
                        {exercise.name}
                    </Label>
                </div>
            ))}
        </div>
      </CardContent>
       {workoutCompletedToday && (
        <CardFooter>
            <p className="text-center w-full text-green-600 font-semibold">
                You've already completed your workout for today. Great job!
            </p>
        </CardFooter>
      )}
    </Card>
  );
}
