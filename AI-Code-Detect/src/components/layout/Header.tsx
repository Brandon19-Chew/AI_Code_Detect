import { Code2, Zap } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center glow-cyan-sm">
            <Code2 className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">
            Code<span className="text-gradient-cyan">Lens</span>
          </span>
        </div>

        {/* Tagline */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
          <Zap className="w-3 h-3 text-primary" />
          <span>AI-powered code analysis</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
          <span className="text-muted-foreground hidden sm:inline">Ready</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
