import { AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';
import type { Improvement } from '@/types';

interface ImprovementsTabProps {
  improvements: Improvement[];
}

const SEVERITY_CONFIG = {
  info: {
    icon: Info,
    color: 'text-blue-400',
    bg: 'bg-blue-400/8 border-blue-400/20',
    label: 'Info',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/8 border-yellow-400/20',
    label: 'Warning',
  },
  error: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-400/8 border-red-400/20',
    label: 'Issue',
  },
};

const CATEGORY_BADGES: Record<string, string> = {
  Performance: 'text-orange-400 bg-orange-400/10',
  Readability: 'text-blue-300 bg-blue-300/10',
  Security: 'text-red-400 bg-red-400/10',
  'Best Practice': 'text-primary bg-primary/10',
  'Error Handling': 'text-yellow-400 bg-yellow-400/10',
};

const ImprovementsTab = ({ improvements }: ImprovementsTabProps) => {
  const errorCount = improvements.filter(i => i.severity === 'error').length;
  const warningCount = improvements.filter(i => i.severity === 'warning').length;
  const infoCount = improvements.filter(i => i.severity === 'info').length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-3 flex-wrap">
        {errorCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-1.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>{errorCount} issue{errorCount > 1 ? 's' : ''}</span>
          </div>
        )}
        {warningCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-400/10 rounded-lg px-3 py-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{warningCount} warning{warningCount > 1 ? 's' : ''}</span>
          </div>
        )}
        {infoCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-400/10 rounded-lg px-3 py-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>{infoCount} suggestion{infoCount > 1 ? 's' : ''}</span>
          </div>
        )}
        {errorCount === 0 && warningCount === 0 && (
          <div className="flex items-center gap-1.5 text-xs text-accent bg-accent/10 rounded-lg px-3 py-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Looking good!</span>
          </div>
        )}
      </div>

      {/* Improvement cards */}
      {improvements.map((item, i) => {
        const config = SEVERITY_CONFIG[item.severity];
        const Icon = config.icon;
        const badgeClass = CATEGORY_BADGES[item.category] || 'text-muted-foreground bg-secondary';

        return (
          <div key={i} className={`rounded-lg border p-4 space-y-2.5 ${config.bg}`}>
            <div className="flex items-start gap-3">
              <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-medium text-foreground">{item.description}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.suggestion}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImprovementsTab;
