'use server';

import { analyzePortfolioImage } from '@/ai/flows/analyze-portfolio-image';
import { generatePortfolioSummary } from '@/ai/flows/generate-portfolio-summary';
import type { PortfolioAnalysis } from '@/types';

export async function analyzeAndSummarizePortfolio(
  portfolioImageDataUri: string
): Promise<PortfolioAnalysis> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Google AI API key is not configured. Please set the GOOGLE_API_KEY in your .env file and restart the server.');
  }

  try {
    const analysis = await analyzePortfolioImage({ portfolioImageDataUri });

    if (!analysis.analysisComplete || analysis.holdings.length === 0) {
      throw new Error(analysis.reason || 'Could not analyze portfolio from image.');
    }

    // Calculate sector allocation
    const sectorMap = new Map<string, number>();
    analysis.holdings.forEach(holding => {
      const currentWeight = sectorMap.get(holding.sector) || 0;
      sectorMap.set(holding.sector, currentWeight + holding.weight);
    });
    
    // Define a color palette for charts
    const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

    const sectorAllocation = Array.from(sectorMap.entries()).map(([sector, weight], index) => ({
      sector,
      weight: parseFloat((weight * 100).toFixed(2)),
      fill: chartColors[index % chartColors.length],
    }));
    
    const sectorAllocationString = sectorAllocation
      .map(s => `${s.sector}: ${s.weight.toFixed(2)}%`)
      .join(', ');

    // Diversification insights
    const totalHoldings = analysis.holdings.length;
    const uniqueSectors = sectorAllocation.length;
    const diversification = { totalHoldings, uniqueSectors };
    const diversificationInsights = `The portfolio consists of ${totalHoldings} holdings across ${uniqueSectors} unique sectors.`;

    // Holdings string for the next prompt
    const holdingsString = analysis.holdings
      .map(h => `${h.ticker} (${h.sector}): ${(h.weight * 100).toFixed(2)}%`)
      .join('\n');

    // Generate summary and recommendations
    const summary = await generatePortfolioSummary({
      holdings: holdingsString,
      sectorAllocation: sectorAllocationString,
      diversificationInsights,
    });

    return {
      analysis,
      summary,
      sectorAllocation,
      diversification,
    };
  } catch (error) {
    console.error('Error in analyzeAndSummarizePortfolio:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    // Re-throwing is important so the client-side .catch() block can handle it.
    throw new Error(message);
  }
}
