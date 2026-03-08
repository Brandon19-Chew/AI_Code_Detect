import { BookOpen } from 'lucide-react';
import type { ExplanationSection } from '@/types';

interface ExplanationTabProps {
  sections: ExplanationSection[];
  linesOfCode: number;
  complexity: 'Low' | 'Medium' | 'High';
}

const COMPLEXITY_COLORS = {
  Low: 'text-accent border-accent/30 bg-accent/10',
  Medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  High: 'text-red-400 border-red-400/30 bg-red-400/10',
};

const ExplanationTab = ({ sections, linesOfCode, complexity }: ExplanationTabProps) => {
  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-1.5">
          <span className="font-mono">{linesOfCode}</span>
          <span>lines of code</span>
        </div>
        <div className={`text-xs rounded-lg px-3 py-1.5 border font-medium ${COMPLEXITY_COLORS[complexity]}`}>
          {complexity} complexity
        </div>
      </div>

      {/* Explanation sections */}
      {sections.map((section, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-5.5">
            {section.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ExplanationTab;
