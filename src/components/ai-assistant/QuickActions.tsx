import { QUICK_ACTIONS, type QuickActionItem } from '@/data/quickActions';
import {
  FileText,
  HeartPulse,
  Activity,
  Thermometer,
  Flame,
  Stethoscope,
  Pill,
  UserCheck,
  Sparkles,
  Apple,
} from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (prompt: string) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  HeartPulse,
  Activity,
  Thermometer,
  Flame,
  Stethoscope,
  Pill,
  UserCheck,
  Sparkles,
  Apple,
};

export function QuickActions({ onSelectAction }: QuickActionsProps) {
  return (
    <div className="px-4 py-2.5 bg-white border-t border-slate-100">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
        {QUICK_ACTIONS.map((item: QuickActionItem) => {
          const IconComp = ICON_MAP[item.iconName] || Sparkles;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectAction(item.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 text-slate-700 hover:text-blue-700 text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95 shrink-0"
            >
              <IconComp className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
