'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2, Upload, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { analyzeAndSummarizePortfolio } from '@/app/actions';
import type { PortfolioAnalysis } from '@/types';
import AnalysisView from './analysis-view';

export default function PortfolioAnalyzer() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PortfolioAnalysis | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResults(null);
      setError(null);
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageDataUrl) {
      toast({
        title: 'No Image Selected',
        description: 'Please upload an image of your portfolio first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const analysisResults = await analyzeAndSummarizePortfolio(imageDataUrl);
      setResults(analysisResults);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      toast({
        title: 'Analysis Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageDataUrl(null);
    setImageFile(null);
    setResults(null);
    setError(null);
    setIsLoading(false);
  };

  if (results) {
    return <AnalysisView results={results} onReset={handleReset} />;
  }

  return (
    <div className="w-full max-w-2xl mt-10 p-4">
      <Card className="shadow-xl">
        <CardContent className="p-8 flex flex-col items-center justify-center gap-6">
          <label
            htmlFor="portfolio-upload"
            className="w-full cursor-pointer border-2 border-dashed border-muted-foreground/50 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-accent/50 transition-colors"
          >
            {imageDataUrl && imageFile ? (
              <div className="relative w-full max-w-sm">
                <Image
                  src={imageDataUrl}
                  alt="Portfolio preview"
                  width={400}
                  height={300}
                  data-ai-hint="portfolio screenshot"
                  className="rounded-md object-contain"
                />
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">Click to upload or drag and drop</h3>
                <p className="mt-1 text-sm text-muted-foreground">PNG, JPG, or WEBP</p>
              </>
            )}
            <input
              id="portfolio-upload"
              type="file"
              className="sr-only"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </label>
          
          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleAnalyze} disabled={isLoading || !imageDataUrl} size="lg" className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Portfolio'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
