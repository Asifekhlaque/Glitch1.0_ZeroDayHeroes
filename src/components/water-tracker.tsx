
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import { format, startOfDay, subDays } from "date-fns";

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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Droplet, Goal, Plus, Minus, Edit, Trash, Save, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const formSchema = z.object({
  goal: z.coerce.number().min(0.1, "Goal must be at least 0.1L.").max(10),
  currentIntake: z.coerce.number().min(0),
  feedback: z.string().optional(),
});

export type WaterData = {
  date: string;
  goal: number;
  intake: number;
  feedback?: string;
};

export default function WaterTracker() {
  const [isMounted, setIsMounted] = useState(false);
  const [waterHistory, setWaterHistory] = useState<WaterData[]>([]);
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);
  const { toast } = useToast();

  const todayStr = format(startOfDay(new Date()), "yyyy-MM-dd");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: 2.0,
      currentIntake: 0,
      feedback: "",
    },
  });

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedHistory = localStorage.getItem("waterHistory");
      const history: WaterData[] = savedHistory ? JSON.parse(savedHistory) : [];
      setWaterHistory(history);

      const todayData = history.find((d: WaterData) => d.date === todayStr);
      if (todayData) {
        form.reset({
          goal: todayData.goal,
          currentIntake: todayData.intake,
          feedback: todayData.feedback || "",
        });
      } else {
        const lastData = history[history.length - 1];
        if (lastData) {
          form.reset({
            goal: lastData.goal,
            currentIntake: 0,
            feedback: ""
          });
        }
      }
       // After loading, calculate and save streak
      const streak = calculateHydrationStreak(history);
      const stats = localStorage.getItem("userStats");
      const userStats = stats ? JSON.parse(stats) : { meditationCompletions: 0 };
      userStats.hydrationStreak = streak;
      localStorage.setItem("userStats", JSON.stringify(userStats));

    } catch (error) {
      console.error("Failed to load water history from localStorage", error);
    }
  }, [todayStr, form]);

  const progress = useMemo(() => {
    const goal = form.watch("goal");
    const intake = form.watch("currentIntake");
    if (goal === 0) return 0;
    return Math.min((intake / goal) * 100, 100);
  }, [form.watch("goal"), form.watch("currentIntake")]);

  const calculateHydrationStreak = (history: WaterData[]) => {
    let streak = 0;
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Check if today's goal is met
    const todayEntry = sortedHistory.find(entry => entry.date === todayStr);
    if (todayEntry && todayEntry.intake >= todayEntry.goal) {
        streak++;
    } else if (todayEntry) {
        // if today's goal is not met, streak from yesterday is broken.
        return 0; 
    }

    // Check previous consecutive days
    for (let i = 1; i < sortedHistory.length + 1; i++) {
        const dateToCheck = format(subDays(new Date(todayStr), i), "yyyy-MM-dd");
        const entry = sortedHistory.find(d => d.date === dateToCheck);

        if (entry && entry.intake >= entry.goal) {
            streak++;
        } else {
            break; // Streak is broken
        }
    }
    return streak;
  }

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isMounted) return;
    try {
      const subscription = form.watch((values) => {
          const updatedHistory = [...waterHistory];
          const todayIndex = updatedHistory.findIndex(d => d.date === todayStr);

          const todayData: WaterData = {
            date: todayStr,
            goal: values.goal || 2.0,
            intake: values.currentIntake || 0,
            feedback: values.feedback || "",
          };

          if (todayIndex > -1) {
            updatedHistory[todayIndex] = todayData;
          } else {
            updatedHistory.push(todayData);
          }
          
          // Sort by date just in case
          updatedHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          localStorage.setItem("waterHistory", JSON.stringify(updatedHistory));
          setWaterHistory(updatedHistory);

          // Update streak
          const streak = calculateHydrationStreak(updatedHistory);
          const stats = localStorage.getItem("userStats");
          const userStats = stats ? JSON.parse(stats) : { meditationCompletions: 0 };
          userStats.hydrationStreak = streak;
          localStorage.setItem("userStats", JSON.stringify(userStats));
      });
      return () => subscription.unsubscribe();

    } catch (error) {
      console.error("Failed to save water history to localStorage", error);
    }
  }, [form.watch, waterHistory, isMounted, todayStr]);

  const handleIntakeChange = (amount: number) => {
    const currentIntake = form.getValues("currentIntake");
    form.setValue("currentIntake", Math.max(0, currentIntake + amount), { shouldDirty: true });
  };

  const handleSaveFeedback = (date: string, newFeedback: string) => {
    const updatedHistory = waterHistory.map(entry =>
      entry.date === date ? { ...entry, feedback: newFeedback } : entry
    );
    setWaterHistory(updatedHistory);
    localStorage.setItem("waterHistory", JSON.stringify(updatedHistory));
    setEditingFeedback(null);
    toast({ title: "Feedback Saved!", description: "Your feedback has been updated." });
  };
  
  const handleDeleteFeedback = (date: string) => {
     const updatedHistory = waterHistory.map(entry => {
        if (entry.date === date) {
          const { feedback, ...rest } = entry;
          return rest;
        }
        return entry;
      });
      setWaterHistory(updatedHistory);
      localStorage.setItem("waterHistory", JSON.stringify(updatedHistory));
      toast({ title: "Feedback Deleted", description: "Your feedback for that day has been removed." });
  }

  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Goal className="w-6 h-6 text-primary"/>
            Daily Water Goal
          </CardTitle>
          <CardDescription>
            Set your goal, track your intake, and see your progress.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
            <CardContent className="flex flex-col items-center gap-6">
                <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Daily Goal (Litres)</FormLabel>
                        <FormControl>
                        <Input
                            type="number"
                            step="0.1"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            
                <div className="w-full space-y-4">
                    <div className="flex justify-between items-baseline">
                        <Label>Today's Progress</Label>
                        <span className="text-sm font-bold text-primary">
                            {form.watch("currentIntake").toFixed(1)}L / {form.watch("goal").toFixed(1)}L
                        </span>
                    </div>
                    <Progress value={progress} className="w-full" />
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleIntakeChange(-0.25)}>
                        <Minus className="w-5 h-5"/>
                    </Button>
                    <Droplet className="w-10 h-10 text-blue-400" />
                    <Button variant="outline" size="icon" onClick={() => handleIntakeChange(0.25)}>
                        <Plus className="w-5 h-5"/>
                    </Button>
                </div>
                 <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Today's Feedback</FormLabel>
                        <FormControl>
                            <Textarea placeholder="How did you feel about your hydration today?" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </CardContent>
        </Form>
      </Card>
      
      {waterHistory.filter(h => h.feedback).length > 0 && (
         <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Feedback History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {waterHistory.filter(h => h.feedback).map((entry) => (
                    <div key={entry.date} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-center mb-2">
                             <p className="font-semibold">{format(new Date(entry.date), "PPP")}</p>
                             <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setEditingFeedback(entry.date)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete your feedback for this day.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteFeedback(entry.date)}>
                                            Delete
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                             </div>
                        </div>

                        {editingFeedback === entry.date ? (
                            <div className="space-y-2">
                                <Textarea 
                                    defaultValue={entry.feedback} 
                                    id={`edit-feedback-${entry.date}`}
                                    className="w-full"
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleSaveFeedback(entry.date, (document.getElementById(`edit-feedback-${entry.date}`) as HTMLTextAreaElement).value)}>
                                        <Save className="w-4 h-4 mr-2"/>
                                        Save
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditingFeedback(null)}>
                                        <X className="w-4 h-4 mr-2"/>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                                <ReactMarkdown>{entry.feedback}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
         </Card>
      )}
    </>
  );
}
