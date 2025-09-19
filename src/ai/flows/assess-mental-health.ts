'use server';

/**
 * @fileOverview This file defines a Genkit flow for assessing mental health based on a questionnaire.
 * It takes a user's answers and provides a scored analysis, a primary emotion, and suggestions.
 *
 * - assessMentalHealth - A function that calls the mental health assessment flow.
 * - AssessMentalHealthInput - The input type for the assessMentalHealth function.
 * - AssessMentalHealthOutput - The return type for the assessMentalHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the mental health assessment questionnaire
const AssessMentalHealthInputSchema = z.object({
  mood: z.string().describe("The user's response to: How have you been feeling emotionally lately?"),
  sleep: z.string().describe("The user's response to: How would you rate your sleep quality recently?"),
  energy: z.string().describe("The user's response to: How have your energy levels been?"),
  interest: z.string().describe("The user's response to: Have you been enjoying your usual activities?"),
  stress: z.string().describe("The user's response to: How would you describe your current stress level?"),
});

export type AssessMentalHealthInput = z.infer<typeof AssessMentalHealthInputSchema>;

// Define the output schema for the mental health assessment
const AssessMentalHealthOutputSchema = z.object({
    scores: z.array(z.object({
        name: z.string().describe("The category of well-being (e.g., Mood, Sleep, Energy)."),
        score: z.number().describe("A score from 1 (negative) to 10 (positive) for that category."),
    })).describe("An array of scores for different aspects of mental well-being."),
    primaryEmotion: z.string().describe('The primary emotion detected (e.g., Sadness, Anxiety, Calm, Joy).'),
    analysis: z.string().describe("A supportive analysis of the user's feelings and potential patterns."),
    suggestion: z.string().describe("A single, actionable suggestion for the user to try.")
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
  prompt: `You are a compassionate mental health assistant. Analyze the user's answers to the questionnaire.

User's Answers:
- How have you been feeling emotionally lately? {{{mood}}}
- How would you rate your sleep quality recently? {{{sleep}}}
- How have your energy levels been? {{{energy}}}
- Have you been enjoying your usual activities? {{{interest}}}
- How would you describe your current stress level? {{{stress}}}

Based on the answers, do the following:
1. For each of the five categories (Mood, Sleep, Energy, Interest, Stress), provide a score from 1 (very negative) to 10 (very positive). For Stress, a high score means low stress.
2. Identify the 'primaryEmotion' from the user's mood description.
3. Write a brief, supportive 'analysis' of the situation, highlighting potential connections between the answers (e.g., "It seems like high stress might be impacting your sleep...").
4. Provide one clear, actionable 'suggestion' the user could take to potentially improve their well-being.
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
