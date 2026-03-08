import type { Language } from '@/types';

interface LanguageBadgeProps {
  language: Language;
  confidence: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  TypeScript: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  Python: 'text-green-400 border-green-400/30 bg-green-400/10',
  Java: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  'C++': 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  C: 'text-gray-300 border-gray-300/30 bg-gray-300/10',
  'C#': 'text-indigo-400 border-indigo-400/30 bg-indigo-400/10',
  Go: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  Rust: 'text-orange-500 border-orange-500/30 bg-orange-500/10',
  PHP: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
  Ruby: 'text-red-400 border-red-400/30 bg-red-400/10',
  Swift: 'text-orange-300 border-orange-300/30 bg-orange-300/10',
  Kotlin: 'text-purple-300 border-purple-300/30 bg-purple-300/10',
  HTML: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  CSS: 'text-blue-300 border-blue-300/30 bg-blue-300/10',
  SQL: 'text-teal-400 border-teal-400/30 bg-teal-400/10',
  Shell: 'text-green-300 border-green-300/30 bg-green-300/10',
  JSON: 'text-yellow-300 border-yellow-300/30 bg-yellow-300/10',
  YAML: 'text-pink-300 border-pink-300/30 bg-pink-300/10',
  Markdown: 'text-gray-300 border-gray-300/30 bg-gray-300/10',
  Unknown: 'text-muted-foreground border-border bg-secondary',
};

const LanguageBadge = ({ language, confidence }: LanguageBadgeProps) => {
  const colorClass = LANGUAGE_COLORS[language] || LANGUAGE_COLORS['Unknown'];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-medium ${colorClass}`}>
      <span>{language}</span>
      {language !== 'Unknown' && (
        <>
          <span className="opacity-40">·</span>
          <span className="opacity-70">{confidence}% confidence</span>
        </>
      )}
    </div>
  );
};

export default LanguageBadge;
