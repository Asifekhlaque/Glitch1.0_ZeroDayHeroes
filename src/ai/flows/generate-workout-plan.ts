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
  workoutPlan: z
    .string()
    .describe('A personalized workout plan based on the user inputs.'),
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
  prompt: `You are a personal trainer. Generate a workout plan based on the user's experience level, height, weight, and fitness goal.

Experience Level: {{{experienceLevel}}}
Height: {{{height}}} cm
Weight: {{{weight}}} kg
Fitness Goal: {{{goal}}}

Present the workout plan in a clear, easy-to-understand point-based format.
Workout Plan:`,
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
