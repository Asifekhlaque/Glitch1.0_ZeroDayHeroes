'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getMentalHealthAssessment } from '@/lib/actions';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Sparkles, AlertTriangle, Lightbulb, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const questions = {
    mood: {
        question: "How have you been feeling emotionally lately?",
        options: ["Overwhelmed or very sad", "Generally down or anxious", "Neutral", "Mostly positive", "Very happy and calm"],
    },
    sleep: {
        question: "How would you rate your sleep quality recently?",
        options: ["Very poor", "Fair, but restless", "Average", "Good", "Excellent"],
    },
    energy: {
        question: "How have your energy levels been?",
        options: ["Very low, constantly fatigued", "Low, I tire easily", "Moderate, some ups and downs", "Good, mostly energetic", "High, I feel very active"],
    },
    interest: {
        question: "Have you been enjoying your usual activities?",
        options: ["Not at all", "Only a little", "Some of the time", "Most of the time", "Definitely"],
    },
    stress: {
        question: "How would you describe your current stress level?",
        options: ["Extremely high", "High", "Moderate", "Low", "Very low"],
    }
} as const;

const formSchema = z.object({
  mood: z.string({ required_error: "Please select an option for your mood." }),
  sleep: z.string({ required_error: "Please select an option for your sleep." }),
  energy: z.string({ required_error: "Please select an option for your energy." }),
  interest: z.string({ required_error: "Please select an option for your interest." }),
  stress: z.string({ required_error: "Please select an option for your stress." }),
});

type AssesmentResult = {
  scores: { name: string; score: number }[];
  primaryEmotion: string;
  analysis: string;
  suggestion: string;
  funnyMessage: string;
};

export default function MentalBoostPage() {
  const [assessment, setAssessment] = useState<AssesmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isKeyBlocked, setIsKeyBlocked] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAssessment(null);
    setApiError(null);
    setIsKeyBlocked(false);

    try {
      const result = await getMentalHealthAssessment(values);
      setAssessment(result);
    } catch (error: any) {
       if (error.message && error.message.includes('SERVICE_DISABLED')) {
        const projectIdMatch = error.message.match(/project\/(\d+)/);
        const projectId = projectIdMatch ? projectIdMatch[1] : null;
        setApiError(projectId);
      } else if (error.message && error.message.includes('API_KEY_SERVICE_BLOCKED')) {
        setIsKeyBlocked(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Generating Assessment',
          description:
            'There was an issue analyzing your feelings. Please try again.',
        });
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  
  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Mental Boost"
        subtitle="Answer a few questions for a snapshot of your well-being."
      />

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
              <CardTitle className="font-headline text-2xl">
                Wellness Questionnaire
              </CardTitle>
              <CardDescription>
                Your answers are private and used to generate a personal analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {(Object.keys(questions) as Array<keyof typeof questions>).map((key) => (
                 <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel className="font-semibold text-base">{questions[key].question}</FormLabel>
                        <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                        >
                            {questions[key].options.map((option) => (
                                <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={option} />
                                    </FormControl>
                                    <FormLabel className="font-normal">{option}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              ))}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Analyze My Well-being
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

       {isLoading && (
        <Card>
          <CardHeader>
             <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Sparkles className="text-primary" /> Analyzing...
            </CardTitle>
            <CardDescription>Our AI is carefully reviewing your answers. Please wait.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="h-48 bg-muted rounded w-full animate-pulse"></div>
             <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
             <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
          </CardContent>
        </Card>
      )}

      {assessment && (
        <Card className="animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Your Wellness Report
            </CardTitle>
            <CardDescription>
              Here's a snapshot of your well-being based on your answers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2">Self-Assessment Overview</h3>
                 <ChartContainer config={chartConfig} className="h-64 w-full">
                    <ResponsiveContainer>
                        <BarChart data={assessment.scores} margin={{top: 20, right: 20, bottom: 5, left: -20}}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis domain={[0, 10]} tickLine={false} axisLine={false} ticks={[0, 5, 10]} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="score" fill="var(--color-score)" radius={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
            
            <Alert>
                <AlertTitle className="font-semibold">Primary Emotion: {assessment.primaryEmotion}</AlertTitle>
                <AlertDescription>
                  {assessment.analysis}
                </AlertDescription>
            </Alert>
            
            <Alert variant="default" className="bg-primary/10 border-primary/50">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertTitle className="font-semibold text-primary">Actionable Suggestion</AlertTitle>
                <AlertDescription>
                    {assessment.suggestion}
                </AlertDescription>
            </Alert>
            
            <Alert variant="default" className="bg-green-500/10 border-green-500/50">
                <Gift className="h-4 w-4 text-green-500" />
                <AlertTitle className="font-semibold text-green-600">A Little Something to Make You Smile</AlertTitle>
                <AlertDescription>
                    {assessment.funnyMessage}
                </AlertDescription>
            </Alert>

             <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Support is Available</AlertTitle>
                <AlertDescription>
                    This is not a diagnosis. If you're struggling, talking to a qualified professional can make a big difference.
                    <Button asChild variant="link" className="p-0 h-auto ml-1">
                        <Link href="/book-appointment">Book an Appointment</Link>
                    </Button>
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
