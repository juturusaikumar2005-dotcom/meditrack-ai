import { motion } from 'framer-motion';
import {
  Brain,
  ShieldAlert,
  Target,
  FileSearch,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ExplainableAIPanelProps {
  confidence: number;
  condition: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  keyFindings: { label: string; detail: string; confidence: number }[];
  evidenceHighlights: { text: string; source: string }[];
  reasoningSummary: string;
  nextSteps: string[];
}

const riskConfig: Record<string, { tone: 'success' | 'warning' | 'error'; color: string; bg: string }> = {
  Low: { tone: 'success', color: 'text-emerald-700', bg: 'bg-emerald-500' },
  Moderate: { tone: 'warning', color: 'text-amber-700', bg: 'bg-amber-500' },
  High: { tone: 'error', color: 'text-orange-700', bg: 'bg-orange-500' },
  Critical: { tone: 'error', color: 'text-red-700', bg: 'bg-red-500' },
};

export function ExplainableAIPanel({
  confidence,
  condition,
  riskLevel,
  keyFindings,
  evidenceHighlights,
  reasoningSummary,
  nextSteps,
}: ExplainableAIPanelProps) {
  const risk = riskConfig[riskLevel];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <Brain className="h-4.5 w-4.5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Explainable AI</h3>
          <p className="text-xs text-slate-500">Transparent reasoning behind the AI diagnosis</p>
        </div>
      </div>

      {/* Top metrics row */}
      <div className="grid sm:grid-cols-3 gap-3">
        {/* Confidence */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">AI Confidence</span>
            </div>
          </div>
          <div className="flex items-end gap-1.5">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-slate-900"
            >
              {confidence}%
            </motion.span>
            <span className="text-xs text-slate-400 mb-1">model certainty</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className={`h-full ${confidence >= 85 ? 'bg-emerald-500' : confidence >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${confidence}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Condition */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06 }}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileSearch className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Possible Condition</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 leading-snug">{condition}</p>
        </motion.div>

        {/* Risk level */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Risk Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {['Low', 'Moderate', 'High', 'Critical'].map((lvl, i) => {
                const activeIndex = ['Low', 'Moderate', 'High', 'Critical'].indexOf(riskLevel);
                return (
                  <div
                    key={lvl}
                    className={`h-2 w-6 rounded-full ${i <= activeIndex ? risk.bg : 'bg-slate-100'}`}
                  />
                );
              })}
            </div>
            <Badge tone={risk.tone}>{riskLevel}</Badge>
          </div>
        </motion.div>
      </div>

      {/* Key Findings */}
      <Card title="Key Findings" icon={CheckCircle2}>
        <div className="space-y-3">
          {keyFindings.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-800">{f.label}</span>
                  <span className="text-xs font-semibold text-slate-500 flex-shrink-0">{f.confidence}%</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{f.detail}</p>
                <div className="mt-1.5 h-1 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${f.confidence}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.08 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Evidence Highlights */}
      <Card title="Evidence Highlights" icon={FileSearch}>
        <div className="space-y-2.5">
          {evidenceHighlights.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
            >
              <div className="flex-1">
                <p className="text-sm text-slate-700">{e.text}</p>
                <p className="text-xs text-slate-400 mt-1">Source: {e.source}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* AI Reasoning Summary */}
      <Card title="AI Reasoning Summary" icon={Brain}>
        <p className="text-sm text-slate-600 leading-relaxed">{reasoningSummary}</p>
      </Card>

      {/* Recommended Next Steps */}
      <Card title="Recommended Next Steps" icon={Lightbulb}>
        <div className="space-y-2.5">
          {nextSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <div className="mt-0.5 h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-blue-600">{i + 1}</span>
              </div>
              <span className="text-sm text-slate-700">{step}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-slate-400" />
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      </div>
      {children}
    </motion.div>
  );
}
