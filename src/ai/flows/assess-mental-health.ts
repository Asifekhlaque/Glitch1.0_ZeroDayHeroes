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
    suggestion: z.string().describe("A single, actionable suggestion for the user to try."),
    memeText: z.string().describe("A short, funny, encouraging meme-style caption to make the user smile. For example: 'Me trying to keep it together' or 'Hang in there, weekend is coming!'"),
    memeImageUrl: z.string().describe("The URL of the generated meme image."),
});

export type AssessMentalHealthOutput = z.infer<typeof AssessMentalHealthOutputSchema>;

// Exported function to call the flow
export async function assessMentalHealth(input: AssessMentalHealthInput): Promise<AssessMentalHealthOutput> {
  return assessMentalHealthFlow(input);
}

// Define the prompt for the mental health assessment text generation
const assessMentalHealthTextPrompt = ai.definePrompt({
  name: 'assessMentalHealthTextPrompt',
  input: {schema: AssessMentalHealthInputSchema},
  output: {schema: z.object({
    scores: z.array(z.object({
        name: z.string(),
        score: z.number(),
    })),
    primaryEmotion: z.string(),
    analysis: z.string(),
    suggestion: z.string(),
    memeText: z.string(),
  })},
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
5. Generate a 'memeText' that is a short, funny, encouraging, and SFW (safe for work) meme-style caption to make the user smile. For example: 'Me trying to keep it together' or 'Hang in there, the weekend is coming!'
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
    // Step 1: Generate the textual analysis and meme caption
    const {output: textOutput} = await assessMentalHealthTextPrompt(input);
    if (!textOutput) {
        throw new Error("Failed to generate mental health assessment text.");
    }
    
    // Step 2: Generate the meme image based on the caption
    const {media} = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `A cute and funny, safe-for-work meme image to go with the caption: "${textOutput.memeText}". The image should be lighthearted and encouraging. Photographic style.`
    });

    if (!media.url) {
        throw new Error("Failed to generate meme image.");
    }
    
    // Step 3: Combine results and return
    return {
        ...textOutput,
        memeImageUrl: media.url,
    };
  }
);
