// src/ai/flows/identify-missing-sectors.ts
'use server';

/**
 * @fileOverview Identifies potential missing or underexposed sectors in a user's portfolio.
 *
 * - identifyMissingSectors - A function that analyzes a portfolio and identifies missing sectors.
 * - IdentifyMissingSectorsInput - The input type for the identifyMissingSectors function.
 * - IdentifyMissingSectorsOutput - The return type for the identifyMissingSectors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyMissingSectorsInputSchema = z.object({
  portfolioHoldings: z
    .string()
    .describe('A list of the user provided holdings, sectors, and weights of their portfolio.'),
});
export type IdentifyMissingSectorsInput = z.infer<
  typeof IdentifyMissingSectorsInputSchema
>;

const IdentifyMissingSectorsOutputSchema = z.object({
  missingSectors: z
    .string()
    .describe(
      'A list of sectors that are missing or underexposed in the portfolio, along with a brief explanation of why they might be beneficial to include.'
    ),
});
export type IdentifyMissingSectorsOutput = z.infer<
  typeof IdentifyMissingSectorsOutputSchema
>;

export async function identifyMissingSectors(
  input: IdentifyMissingSectorsInput
): Promise<IdentifyMissingSectorsOutput> {
  return identifyMissingSectorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyMissingSectorsPrompt',
  input: {schema: IdentifyMissingSectorsInputSchema},
  output: {schema: IdentifyMissingSectorsOutputSchema},
  prompt: `You are a financial advisor who specializes in portfolio diversification.

  Based on the user's current portfolio holdings, identify any sectors that are missing or underexposed.

  Consider the overall market conditions and the user's stated investment goals (if available).

  Portfolio Holdings: {{{portfolioHoldings}}}

  Provide a list of missing or underexposed sectors, along with a brief explanation of why they might be beneficial to include in the portfolio.
  `,
});

const identifyMissingSectorsFlow = ai.defineFlow(
  {
    name: 'identifyMissingSectorsFlow',
    inputSchema: IdentifyMissingSectorsInputSchema,
    outputSchema: IdentifyMissingSectorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
