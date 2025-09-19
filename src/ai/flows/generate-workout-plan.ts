'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized workout plans.
 *
 * The flow takes user's experience level, height, and weight as input and generates a workout plan.
 * It exports:
 * - `generateWorkoutPlan`: The main function to trigger the workout plan generation flow.
 * - `GenerateWorkoutPlanInput`: The TypeScript type for the input schema.
 * - `GenerateWorkoutPlanOutput`: The TypeScript type for the output schema.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorkoutPlanInputSchema = z.object({
  experienceLevel: z
    .string()
    .describe('Experience level: Beginner, Intermediate, or Advanced.'),
  height: z.number().describe('Height in centimeters.'),
  weight: z.number().describe('Weight in kilograms.'),
  goal: z.string().describe('Fitness Goal: Lose Weight, Gain Muscle, Maintain Fitness'),
});
export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const GenerateWorkoutPlanOutputSchema = z.object({
  planTitle: z.string().describe('A catchy and motivational title for the workout plan.'),
  planSummary: z.string().describe('A brief (2-3 sentences) summary of the workout plan, its focus, and expected outcomes.'),
  weeklySchedule: z.array(z.object({
    day: z.string().describe('The day of the week for this workout (e.g., "Monday", "Wednesday"). Use "Rest Day" for non-workout days.'),
    title: z.string().describe('The title for the day\'s session (e.g., "Full Body Strength", "Cardio & Core", "Active Recovery").'),
    exercises: z.array(z.object({
      name: z.string().describe('The name of the exercise.'),
      sets: z.string().describe('The number of sets to perform (e.g., "3", "3-4").'),
      reps: z.string().describe('The number of repetitions per set (e.g., "8-12", "45 seconds").'),
      rest: z.string().describe('The rest time between sets (e.g., "60-90 seconds").'),
    })).describe('A list of exercises for the day. This should be an empty array for Rest Days.')
  })).describe('A 7-day schedule outlining the workout plan for the entire week.')
});
export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(
  input: GenerateWorkoutPlanInput
): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are a world-class personal trainer. Your task is to generate a comprehensive, structured 7-day workout plan based on the user's profile.

User Profile:
- Experience Level: {{{experienceLevel}}}
- Height: {{{height}}} cm
- Weight: {{{weight}}} kg
- Fitness Goal: {{{goal}}}

Instructions:
1.  Create a motivational 'planTitle' for the workout plan.
2.  Write a brief 'planSummary' explaining the plan's focus.
3.  Design a 'weeklySchedule' for 7 days. It must include a mix of workout days and rest days.
4.  For each workout day, provide a clear 'title' and a list of 'exercises'.
5.  Each exercise must specify the 'name', 'sets', 'reps', and 'rest' period.
6.  For rest days, the 'title' should be "Rest Day" or "Active Recovery", and the 'exercises' array should be empty.
7.  The plan should be logical and tailored to the user's goal and experience level. For example, a beginner plan should have fewer complex exercises and more rest days.

Generate the output in the required structured format.
`,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
