import { WalletCards } from 'lucide-react';
import PortfolioAnalyzer from '@/components/portfolio-analyzer';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
        <nav className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <a
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <WalletCards className="h-6 w-6 text-primary" />
            <span className="font-bold">PortFI</span>
          </a>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-start p-4 md:p-6">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-6">
                Instant AI Portfolio Analysis
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground mt-4 text-lg">
                Upload a screenshot of your portfolio. Our AI will analyze your holdings, diversification, and provide actionable insights in seconds.
            </p>
        </div>
        <PortfolioAnalyzer />
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Powered by Gemini. For informational purposes only. Not financial advice.</p>
      </footer>
    </div>
  );
}
