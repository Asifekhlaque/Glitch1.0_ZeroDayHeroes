'use server';

/**
 * @fileOverview A conversational AI assistant flow.
 *
 * - chatWithAssistant - A function that handles the chat interaction.
 * - ChatWithAssistantInput - The input type for the chat function.
 * - ChatWithAssistantOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {Message, Part} from 'genkit';

const ChatWithAssistantInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({
      text: z.string(),
    })),
  })).describe('The conversation history.'),
});
export type ChatWithAssistantInput = z.infer<typeof ChatWithAssistantInputSchema>;

const ChatWithAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s response.'),
});
export type ChatWithAssistantOutput = z.infer<typeof ChatWithAssistantOutputSchema>;

export async function chatWithAssistant(input: ChatWithAssistantInput): Promise<ChatWithAssistantOutput> {
  return chatAssistantFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatAssistantPrompt',
  input: {schema: ChatWithAssistantInputSchema},
  output: {schema: ChatWithAssistantOutputSchema},
  system: `You are a friendly and compassionate AI assistant for an app called Mental Boost. Your purpose is to provide support to users who may be feeling sad, lonely, or need someone to talk to.

Your tone should be:
- Empathetic and understanding.
- Positive and encouraging.
- Calm and patient.

What you should do:
- Acknowledge the user's feelings and validate their emotions (e.g., "It sounds like you're going through a tough time," or "I'm here to listen.").
- Ask open-ended questions to encourage them to share more if they're comfortable (e.g., "What's been on your mind?").
- Offer general, safe, and positive suggestions for well-being, such as mindfulness, taking a short walk, listening to music, or journaling.
- If the user's messages are very short, try to gently engage them with a simple, kind question.
- If the user expresses gratitude, respond warmly.

What you should NOT do:
- Do NOT provide medical advice or therapy. You are not a doctor or a therapist.
- If the user seems to be in serious distress or mentions self-harm, you MUST strongly but gently recommend they speak to a crisis hotline or a mental health professional immediately. Provide a message like: "I'm very concerned about what you've shared. It's really important to talk to someone who can provide you with the support you need. You can connect with people who can support you by calling or texting 988 anytime in the US and Canada. In the UK, you can call 111."
- Do not make promises you can't keep or pretend to be human.
- Do not engage in arguments or negative conversations. Keep the focus on positive support.
`,
   prompt: `{{#each history}}
{{this.role}}: {{this.parts.0.text}}
{{/each}}
model:
`,
});


const chatAssistantFlow = ai.defineFlow(
  {
    name: 'chatAssistantFlow',
    inputSchema: ChatWithAssistantInputSchema,
    outputSchema: ChatWithAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await chatPrompt({
      history: input.history.map(m => ({role: m.role === 'model' ? 'model' : 'user', parts: m.parts}))
    });
    return { response: output!.response };
  }
);
