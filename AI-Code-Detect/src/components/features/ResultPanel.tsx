import { useState } from 'react';
import { BookOpen, Lightbulb, MessageSquare, Sparkles } from 'lucide-react';
import type { AnalysisResult, ResultTab } from '@/types';
import LanguageBadge from './LanguageBadge';
import ExplanationTab from './ExplanationTab';
import ImprovementsTab from './ImprovementsTab';
import CommentsTab from './CommentsTab';

interface ResultPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

const TABS: Array<{ id: ResultTab; label: string; Icon: React.ElementType }> = [
  { id: 'explanation', label: 'Explain', Icon: BookOpen },
  { id: 'improvements', label: 'Improve', Icon: Lightbulb },
  { id: 'comments', label: 'Comment', Icon: MessageSquare },
];

const ResultPanel = ({ result, isAnalyzing }: ResultPanelProps) => {
  const [activeTab, setActiveTab] = useState<ResultTab>('explanation');

  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-8">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border-2 border-primary/40 animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute inset-4 rounded-full border-2 border-primary animate-spin"></div>
          <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Analyzing your code...</p>
          <p className="text-xs text-muted-foreground mt-1">Detecting language, parsing structure</p>
        </div>
        <div className="flex gap-2 mt-2">
          {['Detecting language', 'Parsing structure', 'Generating insights'].map((step, i) => (
            <div
              key={step}
              className="text-xs text-primary/60 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {step}
              {i < 2 && <span className="mx-2 text-border">·</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary/40" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground/60">Results will appear here</p>
          <p className="text-xs text-muted-foreground mt-1">
            Paste code on the left and click Analyze
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-xs">
          {[
            { icon: BookOpen, label: 'Explanation' },
            { icon: Lightbulb, label: 'Improvements' },
            { icon: MessageSquare, label: 'Comments' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-secondary/50 border border-border/50">
              <Icon className="w-4 h-4 text-muted-foreground/50" />
              <span className="text-xs text-muted-foreground/50">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-card/50 flex items-center justify-between gap-3 flex-wrap">
        <LanguageBadge language={result.language} confidence={result.confidence} />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>Analysis complete</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-4 bg-card/30">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px ${
              activeTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {id === 'improvements' && (
              <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center font-mono ${
                result.improvements.some(i => i.severity === 'error')
                  ? 'bg-red-400/20 text-red-400'
                  : result.improvements.some(i => i.severity === 'warning')
                  ? 'bg-yellow-400/20 text-yellow-400'
                  : 'bg-accent/20 text-accent'
              }`}>
                {result.improvements.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto scrollbar-thin p-4">
        {activeTab === 'explanation' && (
          <ExplanationTab
            sections={result.explanation}
            linesOfCode={result.linesOfCode}
            complexity={result.complexity}
          />
        )}
        {activeTab === 'improvements' && (
          <ImprovementsTab improvements={result.improvements} />
        )}
        {activeTab === 'comments' && (
          <CommentsTab commentedCode={result.comments} />
        )}
      </div>
    </div>
  );
};

export default ResultPanel;
