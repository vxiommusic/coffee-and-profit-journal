'use server';

/**
 * @fileOverview An AI-powered pattern recognition agent for trading.
 *
 * - analyzeTrades - A function that analyzes past trades for recurring patterns.
 * - AnalyzeTradesInput - The input type for the analyzeTrades function.
 * - AnalyzeTradesOutput - The return type for the analyzeTrades function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTradesInputSchema = z.object({
  tradeData: z.string().describe('A JSON string containing an array of past trade objects. Each trade object should include entry price, exit price, timestamp, and instrument.'),
});
export type AnalyzeTradesInput = z.infer<typeof AnalyzeTradesInputSchema>;

const AnalyzeTradesOutputSchema = z.object({
  patterns: z.array(
    z.object({
      patternDescription: z.string().describe('A description of the identified trading pattern.'),
      potentialOpportunities: z.string().describe('Potential trading opportunities based on the identified pattern.'),
      risks: z.string().describe('Potential risks associated with the identified pattern.'),
    })
  ).describe('An array of identified trading patterns, their potential opportunities, and risks.'),
});
export type AnalyzeTradesOutput = z.infer<typeof AnalyzeTradesOutputSchema>;

export async function analyzeTrades(input: AnalyzeTradesInput): Promise<AnalyzeTradesOutput> {
  return analyzeTradesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTradesPrompt',
  input: {schema: AnalyzeTradesInputSchema},
  output: {schema: AnalyzeTradesOutputSchema},
  prompt: `You are an expert trading pattern analyst. Analyze the following trade data to identify recurring patterns, potential opportunities, and risks.

Trade Data: {{{tradeData}}}

Identify at least 3 patterns if possible. If there are less than 3, identify as many as possible.

Ensure that patternDescription, potentialOpportunities, and risks are populated for each identified pattern.

Return your analysis in JSON format.`,
});

const analyzeTradesFlow = ai.defineFlow(
  {
    name: 'analyzeTradesFlow',
    inputSchema: AnalyzeTradesInputSchema,
    outputSchema: AnalyzeTradesOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (e) {
      console.error("Error during prompt execution:", e);
      throw e;
    }
  }
);
