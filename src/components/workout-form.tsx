
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getWorkoutPlan } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const formSchema = z.object({
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  weight: z.coerce.number().min(1, "Weight must be a positive number."),
  height: z.coerce.number().min(1, "Height must be a positive number."),
  goal: z.enum(["Lose Weight", "Gain Muscle", "Maintain Fitness"]),
});

export default function WorkoutForm() {
    const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isKeyBlocked, setIsKeyBlocked] = useState(false);
    const { toast } = useToast();
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        experienceLevel: "Beginner",
        weight: 70,
        height: 175,
        goal: "Maintain Fitness",
      },
    });
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      setIsLoading(true);
      setWorkoutPlan(null);
      setApiError(null);
      setIsKeyBlocked(false);

      try {
        const result = await getWorkoutPlan(values);
        setWorkoutPlan(result.workoutPlan);
      } catch (error: any) {
        if (error.message && error.message.includes("SERVICE_DISABLED")) {
          const projectIdMatch = error.message.match(/project\/(\d+)/);
          const projectId = projectIdMatch ? projectIdMatch[1] : null;
          setApiError(projectId);
        } else if (error.message && error.message.includes("API_KEY_SERVICE_BLOCKED")) {
          setIsKeyBlocked(true);
        } else {
          toast({
            variant: "destructive",
            title: "Error Generating Plan",
            description: "There was an issue creating your workout plan. Please try again.",
          });
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  
    return (
      <>
        {apiError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Action Required: Enable Generative Language API</AlertTitle>
            <AlertDescription>
              To use this AI feature, you must enable the Generative Language API in your Google Cloud project.
              <Button asChild variant="link" className="p-0 h-auto ml-1">
                <Link 
                  href={`https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=${apiError}`} 
                  target="_blank"
                >
                  Click here to enable it.
                </Link>
              </Button>
               After enabling, wait a few minutes and try again.
            </AlertDescription>
          </Alert>
        )}

        {isKeyBlocked && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Action Required: API Key Restrictions</AlertTitle>
            <AlertDescription>
              Your API key has restrictions that are blocking requests from this app. Please go to the 
              <Button asChild variant="link" className="p-0 h-auto mx-1">
                <Link
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                >
                  Google Cloud Console
                </Link>
              </Button>
               and ensure your API key has no application or API restrictions. After removing them, wait a few minutes and try again.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Your Fitness Profile</CardTitle>
                <CardDescription>
                  This information helps our AI create the best workout plan for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fitness Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Lose Weight">Lose Weight</SelectItem>
                          <SelectItem value="Gain Muscle">Gain Muscle</SelectItem>
                          <SelectItem value="Maintain Fitness">Maintain Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="175" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Workout
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
  
        {isLoading && (
           <Card>
            <CardHeader>
               <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Sparkles className="text-primary" /> Building Your Workout...
              </CardTitle>
              <CardDescription>Our AI trainer is designing your custom routine. Hold tight!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
              </div>
               <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        )}
  
        {workoutPlan && (
          <Card className="animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Custom Workout Plan</CardTitle>
              <CardDescription>
                Here's your AI-generated workout. Always prioritize safety and proper form.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-stone dark:prose-invert max-w-none whitespace-pre-wrap">
                {workoutPlan}
              </div>
            </CardContent>
          </Card>
        )}
      </>
    );
}
