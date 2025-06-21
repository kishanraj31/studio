'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating a portfolio summary.
 *
 * - generatePortfolioSummary - A function that generates a summary of the user's portfolio.
 * - GeneratePortfolioSummaryInput - The input type for the generatePortfolioSummary function.
 * - GeneratePortfolioSummaryOutput - The return type for the generatePortfolioSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePortfolioSummaryInputSchema = z.object({
  holdings: z
    .string()
    .describe('A list of holdings in the portfolio, including ticker symbol, sector, and weight.'),
  sectorAllocation: z
    .string()
    .describe('A summary of the portfolio sector allocation.'),
  diversificationInsights: z.string().describe('Insights into the portfolio diversification.'),
});
export type GeneratePortfolioSummaryInput = z.infer<typeof GeneratePortfolioSummaryInputSchema>;

const GeneratePortfolioSummaryOutputSchema = z.object({
  summary: z.string().describe('A readable summary of the portfolio, including what is working well, potential risks, and sectors/stocks to consider.'),
  recommendations: z.string().describe('AI-driven recommendations on whether to hold, sell, or consider buying specific assets.'),
  missingSectors: z.string().describe('Identification of potential missing or underexposed sectors within the user\u2019s portfolio.'),
});
export type GeneratePortfolioSummaryOutput = z.infer<typeof GeneratePortfolioSummaryOutputSchema>;

export async function generatePortfolioSummary(
  input: GeneratePortfolioSummaryInput
): Promise<GeneratePortfolioSummaryOutput> {
  return generatePortfolioSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePortfolioSummaryPrompt',
  input: {schema: GeneratePortfolioSummaryInputSchema},
  output: {schema: GeneratePortfolioSummaryOutputSchema},
  prompt: `You are an expert financial analyst providing insights on investment portfolios.

  Based on the following portfolio information, generate a readable summary highlighting what's working well, potential risks, and sectors/stocks to consider.
  Also, provide AI-driven recommendations on whether to hold, sell, or consider buying specific assets. Identify potential missing or underexposed sectors within the user’s portfolio.

Holdings: {{{holdings}}}
Sector Allocation: {{{sectorAllocation}}}
Diversification Insights: {{{diversificationInsights}}}

Summary:
Recommendations:
Missing Sectors:`,
});

const generatePortfolioSummaryFlow = ai.defineFlow(
  {
    name: 'generatePortfolioSummaryFlow',
    inputSchema: GeneratePortfolioSummaryInputSchema,
    outputSchema: GeneratePortfolioSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
