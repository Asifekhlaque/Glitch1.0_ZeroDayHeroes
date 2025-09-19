'use server';

/**
 * @fileOverview This file defines a Genkit flow for assessing mental health.
 * It takes a user's description of their feelings and provides an analysis.
 *
 * - assessMentalHealth - A function that calls the mental health assessment flow.
 * - AssessMentalHealthInput - The input type for the assessMentalHealth function.
 * - AssessMentalHealthOutput - The return type for the assessMentalHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the mental health assessment
const AssessMentalHealthInputSchema = z.object({
  description: z.string().describe('A description of how the user is feeling.'),
});

export type AssessMentalHealthInput = z.infer<typeof AssessMentalHealthInputSchema>;

// Define the output schema for the mental health assessment
const AssessMentalHealthOutputSchema = z.object({
  isDistressed: z.boolean().describe('Whether the user seems to be in mental distress.'),
  primaryEmotion: z.string().describe('The primary emotion detected (e.g., Sadness, Anxiety, Anger, Joy).'),
  analysis: z.string().describe('A supportive analysis of the user\'s feelings and potential next steps.'),
});

export type AssessMentalHealthOutput = z.infer<typeof AssessMentalHealthOutputSchema>;

// Exported function to call the flow
export async function assessMentalHealth(input: AssessMentalHealthInput): Promise<AssessMentalHealthOutput> {
  return assessMentalHealthFlow(input);
}

// Define the prompt for the mental health assessment
const assessMentalHealthPrompt = ai.definePrompt({
  name: 'assessMentalHealthPrompt',
  input: {schema: AssessMentalHealthInputSchema},
  output: {schema: AssessMentalHealthOutputSchema},
  prompt: `You are a compassionate mental health assistant. Analyze the user's description of their feelings.

User's description: {{{description}}}

Based on the description, determine if the user appears to be in mental distress. Identify the primary emotion they are expressing. Provide a brief, supportive analysis. Your response should be empathetic and encouraging. If the user seems distressed, gently suggest that talking to a professional might be helpful. Do not provide a medical diagnosis.

- Set 'isDistressed' to true if the language suggests significant emotional pain, anxiety, depression, or crisis.
- Identify the 'primaryEmotion' from the text.
- Write a gentle 'analysis' of the situation.
`,
});

// Define the Genkit flow for assessing mental health
const assessMentalHealthFlow = ai.defineFlow(
  {
    name: 'assessMentalHealthFlow',
    inputSchema: AssessMentalHealthInputSchema,
    outputSchema: AssessMentalHealthOutputSchema,
  },
  async input => {
    const {output} = await assessMentalHealthPrompt(input);
    return output!;
  }
);
