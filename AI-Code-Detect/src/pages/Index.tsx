import { useState } from 'react';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import CodeInput from '@/components/features/CodeInput';
import ResultPanel from '@/components/features/ResultPanel';
import HeroBanner from '@/components/features/HeroBanner';
import { analyzeCode } from '@/lib/codeAnalyzer';
import type { AnalysisResult } from '@/types';

const Index = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!code.trim()) {
      toast.error('Please paste some code first');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI processing delay
    const delay = Math.random() * 600 + 800;
    setTimeout(() => {
      try {
        const analysis = analyzeCode(code);
        setResult(analysis);
        toast.success(`Analyzed ${analysis.linesOfCode} lines of ${analysis.language}`);
      } catch (err) {
        console.error('Analysis error:', err);
        toast.error('Failed to analyze code. Please try again.');
      } finally {
        setIsAnalyzing(false);
      }
    }, delay);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Hero banner — shown only when no result yet */}
        {!result && !isAnalyzing && <HeroBanner />}

        {/* Main workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-280px)] min-h-[500px]">
          {/* Code Input Panel */}
          <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col glow-cyan-sm">
            <CodeInput
              value={code}
              onChange={setCode}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Results Panel */}
          <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
            <ResultPanel result={result} isAnalyzing={isAnalyzing} />
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground/40 mt-4">
          Supports 35+ programming languages · Analysis runs locally · No code is stored
        </p>
      </main>
    </div>
  );
};

export default Index;
