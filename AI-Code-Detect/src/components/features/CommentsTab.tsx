import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CommentsTabProps {
  commentedCode: string;
}

const CommentsTab = ({ commentedCode }: CommentsTabProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commentedCode);
      setCopied(true);
      toast.success('Commented code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Auto-generated comments added to your code
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-accent" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1 rounded-lg bg-background/60 border border-border overflow-auto scrollbar-thin">
        <pre className="p-4 text-xs font-mono text-foreground/80 leading-6 whitespace-pre-wrap break-all">
          {commentedCode}
        </pre>
      </div>
    </div>
  );
};

export default CommentsTab;
