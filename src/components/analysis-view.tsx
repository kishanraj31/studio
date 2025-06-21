'use client';

import { BarChart, BookOpen, BrainCircuit, BotMessageSquare, GanttChartSquare, RefreshCw } from 'lucide-react';
import type { PortfolioAnalysis } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectorAllocationChart } from './sector-allocation-chart';
import { HoldingsTable } from './holdings-table';

interface AnalysisViewProps {
  results: PortfolioAnalysis;
  onReset: () => void;
}

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function AnalysisView({ results, onReset }: AnalysisViewProps) {
  const { analysis, summary, sectorAllocation, diversification } = results;

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Portfolio Analysis</h2>
        <Button onClick={onReset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Analyze Another
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Holdings" value={diversification.totalHoldings} icon={GanttChartSquare} />
        <StatCard title="Unique Sectors" value={diversification.uniqueSectors} icon={BarChart} />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen /> AI Summary</CardTitle>
            <CardDescription>A high-level overview of your portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary.summary}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BrainCircuit /> Sector Allocation</CardTitle>
            <CardDescription>How your portfolio is distributed across sectors.</CardDescription>
          </CardHeader>
          <CardContent>
            <SectorAllocationChart data={sectorAllocation} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BotMessageSquare /> AI Recommendations</CardTitle>
            <CardDescription>Suggestions for your current holdings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary.recommendations}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 1.5-1.5 2.5-3 3"/><path d="M12 17h.01"/></svg> Missing Sectors</CardTitle>
            <CardDescription>Potential areas for diversification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary.missingSectors}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Extracted Holdings</CardTitle>
          <CardDescription>The stocks identified from your uploaded image.</CardDescription>
        </CardHeader>
        <CardContent>
          <HoldingsTable holdings={analysis.holdings} />
        </CardContent>
      </Card>
    </div>
  );
}
