'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized diet plans.
 * It takes user inputs like age, weight, height, and dietary preferences to generate a tailored diet plan.
 *
 * - generateDietPlan - A function that calls the diet plan generation flow.
 * - GenerateDietPlanInput - The input type for the generateDietPlan function.
 * - GenerateDietPlanOutput - The return type for the generateDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the diet plan generation
const GenerateDietPlanInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  age: z.number().describe('The age of the user in years.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  height: z.number().describe('The height of the user in centimeters.'),
  vegetarian: z.boolean().describe('Whether the user is vegetarian or not.'),
  goal: z
    .enum(['Gain', 'Lose', 'Maintain'])
    .describe('The goal of the user (Gain, Lose, or Maintain weight).'),
});

export type GenerateDietPlanInput = z.infer<typeof GenerateDietPlanInputSchema>;

// Define the output schema for the diet plan generation
const GenerateDietPlanOutputSchema = z.object({
  dietPlan: z.string().describe('The generated personalized diet plan.'),
});

export type GenerateDietPlanOutput = z.infer<typeof GenerateDietPlanOutputSchema>;

// Exported function to call the flow
export async function generateDietPlan(input: GenerateDietPlanInput): Promise<GenerateDietPlanOutput> {
  return generateDietPlanFlow(input);
}

// Define the prompt for generating the diet plan
const generateDietPlanPrompt = ai.definePrompt({
  name: 'generateDietPlanPrompt',
  input: {schema: GenerateDietPlanInputSchema},
  output: {schema: GenerateDietPlanOutputSchema},
  prompt: `You are a personal nutritionist. Generate a personalized diet plan based on the user's information.

  Name: {{{name}}}
  Age: {{{age}}}
  Weight: {{{weight}}} kg
  Height: {{{height}}} cm
  Vegetarian: {{#if vegetarian}}Yes{{else}}No{{/if}}
  Goal: {{{goal}}}

  Provide a diet plan that is tailored to their specific needs and goals.  The diet plan should be realistic and easy to follow. It should include a variety of foods from all food groups, and it should be sustainable over the long term. Present the diet plan in a clear, easy-to-understand point-based format.
`,
});

// Define the Genkit flow for generating the diet plan
const generateDietPlanFlow = ai.defineFlow(
  {
    name: 'generateDietPlanFlow',
    inputSchema: GenerateDietPlanInputSchema,
    outputSchema: GenerateDietPlanOutputSchema,
  },
  async input => {
    const {output} = await generateDietPlanPrompt(input);
    return output!;
  }
);
