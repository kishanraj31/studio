// src/ai/flows/analyze-portfolio-image.ts
'use server';

/**
 * @fileOverview Analyzes a portfolio image to extract stock holdings, weights, and sector allocations.
 *
 * - analyzePortfolioImage - A function that analyzes the portfolio image and extracts information.
 * - AnalyzePortfolioImageInput - The input type for the analyzePortfolioImage function.
 * - AnalyzePortfolioImageOutput - The return type for the analyzePortfolioImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePortfolioImageInputSchema = z.object({
  portfolioImageDataUri: z
    .string()
    .describe(
      "A photo of the user's portfolio, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePortfolioImageInput = z.infer<typeof AnalyzePortfolioImageInputSchema>;

const AnalyzePortfolioImageOutputSchema = z.object({
  holdings: z
    .array(z.object({
      ticker: z.string().describe('The ticker symbol of the stock.'),
      weight: z.number().describe('The weight of the stock in the portfolio (e.g., 0.10 for 10%).'),
      sector: z.string().describe('The sector of the stock.'),
    }))
    .describe('The extracted stock holdings, weights, and sectors.'),
  analysisComplete: z.boolean().describe('Whether the analysis was completed successfully.'),
  reason: z.string().optional().describe('Reason for failure, if analysis was not completed successfully.')
});
export type AnalyzePortfolioImageOutput = z.infer<typeof AnalyzePortfolioImageOutputSchema>;

export async function analyzePortfolioImage(input: AnalyzePortfolioImageInput): Promise<AnalyzePortfolioImageOutput> {
  return analyzePortfolioImageFlow(input);
}

const analyzePortfolioImagePrompt = ai.definePrompt({
  name: 'analyzePortfolioImagePrompt',
  input: {schema: AnalyzePortfolioImageInputSchema},
  output: {schema: AnalyzePortfolioImageOutputSchema},
  prompt: `You are an expert financial analyst.

You will receive an image of a stock portfolio. Your task is to extract the stock holdings, their weights, and their sector allocations from the image using OCR and AI analysis.

If you are unable to confidently extract the holdings, weights and sectors, set analysisComplete to false, and set the reason field with an explanation of why you failed. Otherwise, set analysisComplete to true, and the reason field should be omitted.

Here is the portfolio image:

{{media url=portfolioImageDataUri}}

Return the data in JSON format.
`,
});

const analyzePortfolioImageFlow = ai.defineFlow(
  {
    name: 'analyzePortfolioImageFlow',
    inputSchema: AnalyzePortfolioImageInputSchema,
    outputSchema: AnalyzePortfolioImageOutputSchema,
  },
  async input => {
    try {
      const {output} = await analyzePortfolioImagePrompt(input);
      return output!;
    } catch (e: any) {
      console.error("Error in analyzePortfolioImageFlow", e);
      return {
        holdings: [],
        analysisComplete: false,
        reason: e.message ?? 'Unknown error',
      };
    }
  }
);
