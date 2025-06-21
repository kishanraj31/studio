import type { AnalyzePortfolioImageOutput } from "@/ai/flows/analyze-portfolio-image";
import type { GeneratePortfolioSummaryOutput } from "@/ai/flows/generate-portfolio-summary";

export type Holding = {
    ticker: string;
    weight: number;
    sector: string;
};

export type AnalysisResult = AnalyzePortfolioImageOutput;
export type SummaryResult = GeneratePortfolioSummaryOutput;

export type PortfolioAnalysis = {
    analysis: AnalysisResult;
    summary: SummaryResult;
    sectorAllocation: { sector: string; weight: number; fill: string }[];
    diversification: {
        totalHoldings: number;
        uniqueSectors: number;
    };
};
