import { motion } from 'framer-motion';
import {
  UploadCloud,
  BrainCircuit,
  Target,
  ShieldAlert,
  Pill,
  Stethoscope,
  FileCheck2,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface TimelineEvent {
  id: string;
  label: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'active' | 'pending';
  icon: LucideIcon;
}

export const DEFAULT_TIMELINE: TimelineEvent[] = [
  { id: '1', label: 'Report Uploaded', description: 'MRI scan uploaded to the AI pipeline', timestamp: '08:14 AM', status: 'completed', icon: UploadCloud },
  { id: '2', label: 'AI Analysis Started', description: 'Case Coordinator began autonomous processing', timestamp: '08:15 AM', status: 'completed', icon: BrainCircuit },
  { id: '3', label: 'Condition Identified', description: 'Ischemic stroke detected with 94.2% confidence', timestamp: '08:17 AM', status: 'completed', icon: Target },
  { id: '4', label: 'Risk Assessment', description: 'Risk level classified as High — immediate attention required', timestamp: '08:18 AM', status: 'completed', icon: ShieldAlert },
  { id: '5', label: 'Treatment Recommendation', description: 'Antiplatelet therapy and follow-up MRI suggested', timestamp: '08:19 AM', status: 'completed', icon: Pill },
  { id: '6', label: 'Doctor Review', description: 'Awaiting Dr. Reyes clinical review and sign-off', timestamp: 'Pending', status: 'active', icon: Stethoscope },
  { id: '7', label: 'Final Report Generated', description: 'Signed report dispatched to patient record', timestamp: 'Pending', status: 'pending', icon: FileCheck2 },
];

const statusConfig = {
  completed: { tone: 'success' as const, dotColor: 'bg-emerald-500', ringColor: 'ring-emerald-200', textColor: 'text-emerald-600', label: 'Completed' },
  active: { tone: 'primary' as const, dotColor: 'bg-blue-500', ringColor: 'ring-blue-200', textColor: 'text-blue-600', label: 'In Progress' },
  pending: { tone: 'neutral' as const, dotColor: 'bg-slate-300', ringColor: 'ring-slate-200', textColor: 'text-slate-400', label: 'Pending' },
};

export function ClinicalDecisionTimeline({ events = DEFAULT_TIMELINE }: { events?: TimelineEvent[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <FileCheck2 className="h-4.5 w-4.5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Clinical Decision Timeline</h3>
          <p className="text-xs text-slate-500">Complete patient workflow from upload to final report</p>
        </div>
      </div>

      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-200" />

        <div className="space-y-6">
          {events.map((event, i) => {
            const cfg = statusConfig[event.status];
            const Icon = event.icon;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="relative"
              >
                {/* Dot */}
                <div className={`absolute -left-[1.45rem] mt-0.5 h-3 w-3 rounded-full ${cfg.dotColor} ring-4 ring-white`} />

                {/* Content */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      event.status === 'completed'
                        ? 'bg-emerald-50'
                        : event.status === 'active'
                          ? 'bg-blue-50'
                          : 'bg-slate-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        event.status === 'completed'
                          ? 'text-emerald-600'
                          : event.status === 'active'
                            ? 'text-blue-600'
                            : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900">{event.label}</span>
                        <Badge tone={cfg.tone}>{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{event.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 sm:text-right flex-shrink-0 sm:w-24">
                    {event.timestamp}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
