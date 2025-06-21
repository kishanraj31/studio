// This is a server-side file.
'use server';

/**
 * @fileOverview Provides AI-driven recommendations on whether to hold, sell, or consider buying specific assets in a portfolio.
 *
 * - getInvestmentRecommendations - A function that takes portfolio holdings as input and returns AI-driven recommendations.
 * - GetInvestmentRecommendationsInput - The input type for the getInvestmentRecommendations function.
 * - GetInvestmentRecommendationsOutput - The return type for the getInvestmentRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetInvestmentRecommendationsInputSchema = z.object({
  portfolioHoldings: z
    .string()
    .describe('A string containing the list of portfolio holdings, their sectors, and weights.'),
});
export type GetInvestmentRecommendationsInput = z.infer<typeof GetInvestmentRecommendationsInputSchema>;

const GetInvestmentRecommendationsOutputSchema = z.object({
  summary: z.string().describe('A summary of the portfolio, including what is working and potential risks.'),
  recommendations: z.string().describe('AI-driven recommendations on whether to hold, sell, or consider buying specific assets.'),
  missingSectors: z.string().describe('Identification of potential missing or underexposed sectors within the portfolio.'),
});
export type GetInvestmentRecommendationsOutput = z.infer<typeof GetInvestmentRecommendationsOutputSchema>;

export async function getInvestmentRecommendations(
  input: GetInvestmentRecommendationsInput
): Promise<GetInvestmentRecommendationsOutput> {
  return getInvestmentRecommendationsFlow(input);
}

const investmentRecommendationsPrompt = ai.definePrompt({
  name: 'investmentRecommendationsPrompt',
  input: {schema: GetInvestmentRecommendationsInputSchema},
  output: {schema: GetInvestmentRecommendationsOutputSchema},
  prompt: `You are an AI investment advisor. Analyze the user's portfolio holdings and provide recommendations.

Portfolio Holdings:
{{portfolioHoldings}}

Provide the following:
1.  A summary of the portfolio, including what is working and potential risks.
2.  AI-driven recommendations on whether to hold, sell, or consider buying specific assets.
3.  Identification of potential missing or underexposed sectors within the portfolio.
`,
});

const getInvestmentRecommendationsFlow = ai.defineFlow(
  {
    name: 'getInvestmentRecommendationsFlow',
    inputSchema: GetInvestmentRecommendationsInputSchema,
    outputSchema: GetInvestmentRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await investmentRecommendationsPrompt(input);
    return output!;
  }
);
