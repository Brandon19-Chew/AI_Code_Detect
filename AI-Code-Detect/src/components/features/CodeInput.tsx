import { useRef } from 'react';
import { Clipboard, Trash2, Play } from 'lucide-react';
import { toast } from 'sonner';

interface CodeInputProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const EXAMPLE_CODE = `function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

const numbers = [3, 6, 8, 10, 1, 2, 1];
console.log(quickSort(numbers));`;

const CodeInput = ({ value, onChange, onAnalyze, isAnalyzing }: CodeInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
      toast.success('Code pasted from clipboard');
    } catch {
      toast.error('Could not access clipboard');
    }
  };

  const handleClear = () => {
    onChange('');
    textareaRef.current?.focus();
  };

  const handleLoadExample = () => {
    onChange(EXAMPLE_CODE);
    toast.info('Example code loaded');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) onAnalyze();
    }
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = start + 2;
        textarea.selectionEnd = start + 2;
      });
    }
  };

  const lineCount = value ? value.split('\n').length : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/50">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
          <span className="ml-3 text-xs text-muted-foreground font-mono">
            {lineCount > 0 ? `${lineCount} lines` : 'untitled'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleLoadExample}
            className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
          >
            Example
          </button>
          <button
            onClick={handlePaste}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
            title="Clear"
            disabled={!value}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div className="select-none w-10 bg-background/30 border-r border-border flex-shrink-0 overflow-hidden py-4 px-2">
          {(value || '').split('\n').map((_, i) => (
            <div key={i} className="text-right text-xs font-mono text-muted-foreground/40 leading-6">
              {i + 1}
            </div>
          ))}
          {!value && (
            <div className="text-right text-xs font-mono text-muted-foreground/40 leading-6">1</div>
          )}
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Paste your code here...\n\nSupports: JavaScript, TypeScript, Python, Java, C++, Go, Rust, SQL and more.\n\nTip: Press Ctrl+Enter to analyze`}
          className="code-input flex-1 resize-none bg-transparent text-foreground text-sm leading-6 p-4 focus:outline-none placeholder:text-muted-foreground/30 scrollbar-thin"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Analyze button */}
      <div className="p-4 border-t border-border bg-card/30">
        <button
          onClick={onAnalyze}
          disabled={!value.trim() || isAnalyzing}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed glow-cyan-sm hover:glow-cyan"
        >
          {isAnalyzing ? (
            <>
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Analyze Code
              <kbd className="hidden sm:inline-flex items-center gap-0.5 text-xs opacity-60 font-mono bg-primary-foreground/20 px-1.5 py-0.5 rounded">
                ⌘↵
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeInput;
