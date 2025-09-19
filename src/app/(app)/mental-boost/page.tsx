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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  description: z
    .string()
    .min(10, 'Please describe your feelings in at least 10 characters.'),
});

type AssesmentResult = {
  isDistressed: boolean;
  primaryEmotion: string;
  analysis: string;
};

export default function MentalBoostPage() {
  const [assessment, setAssessment] = useState<AssesmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isKeyBlocked, setIsKeyBlocked] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
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

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Mental Boost"
        subtitle="A safe space to understand your feelings with AI."
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
                How are you feeling today?
              </CardTitle>
              <CardDescription>
                Describe your current emotional state. The AI will provide a supportive analysis. This is not a medical diagnosis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Feelings</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="For example: I've been feeling really anxious about work lately and it's hard to focus..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                Analyze My Feelings
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
            <CardDescription>Our AI is carefully reviewing what you've shared. Please wait.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
             <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
             <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
          </CardContent>
        </Card>
      )}

      {assessment && (
        <Card className="animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              AI-Powered Analysis
            </CardTitle>
            <CardDescription>
              Here's a gentle reflection on your feelings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Alert variant={assessment.isDistressed ? 'destructive' : 'default'}>
                <AlertTriangle className={`h-4 w-4 ${!assessment.isDistressed && 'hidden'}`} />
                <AlertTitle className="font-semibold">Primary Emotion: {assessment.primaryEmotion}</AlertTitle>
                <AlertDescription>
                  {assessment.isDistressed ? "It sounds like you're going through a tough time." : "It's okay to feel this way."}
                </AlertDescription>
            </Alert>
            <div className="prose prose-stone dark:prose-invert max-w-none">
                <p>{assessment.analysis}</p>
            </div>
            {assessment.isDistressed && (
                 <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Support is Available</AlertTitle>
                    <AlertDescription>
                        If you're struggling, talking to a qualified professional can make a big difference. Consider booking an appointment to talk things through.
                        <Button asChild variant="link" className="p-0 h-auto ml-1">
                            <Link href="/book-appointment">Book an Appointment</Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
