import { Code2, Zap, MessageSquare, Lightbulb } from 'lucide-react';
import heroImg from '@/assets/hero.jpg';

const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border mb-6">
      {/* Background image */}
      <img
        src={heroImg}
        alt="CodeLens AI Code Analysis"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>

      {/* Content */}
      <div className="relative px-6 py-8 sm:px-10">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono text-primary uppercase tracking-widest">AI-Powered</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
            Understand any code <br />
            <span className="text-gradient-cyan">instantly</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-md">
            Paste code in any language. Get plain-English explanations, improvement suggestions, and auto-generated comments — in seconds.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Zap, label: 'Language detection' },
              { icon: MessageSquare, label: 'Plain-English explanation' },
              { icon: Lightbulb, label: 'Smart suggestions' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 border border-border/60 rounded-full px-3 py-1">
                <Icon className="w-3 h-3 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
