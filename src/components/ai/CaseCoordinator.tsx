import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ScanSearch,
  BrainCircuit,
  Stethoscope,
  ClipboardList,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type StepStatus = 'waiting' | 'running' | 'completed';

interface CoordinatorStep {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: CoordinatorStep[] = [
  { id: 'extract', label: 'Extract Medical Data', description: 'OCR & entity recognition on uploaded document', icon: ScanSearch },
  { id: 'analyze', label: 'Analyze Report', description: 'Cross-reference with clinical knowledge base', icon: FileText },
  { id: 'detect', label: 'Detect Possible Conditions', description: 'Differential diagnosis with confidence scoring', icon: BrainCircuit },
  { id: 'summarize', label: 'Generate Medical Summary', description: 'Structured findings & key observations', icon: ClipboardList },
  { id: 'recommend', label: 'Recommend Next Actions', description: 'Treatment suggestions & follow-up plan', icon: Lightbulb },
  { id: 'complete', label: 'Complete', description: 'Case ready for doctor review', icon: CheckCircle2 },
];

const STEP_DURATION = 1400;

interface CaseCoordinatorProps {
  /** Trigger the pipeline — increments to re-run */
  runToken: number;
  onComplete?: () => void;
  patientName?: string;
}

export function CaseCoordinator({ runToken, onComplete, patientName }: CaseCoordinatorProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [statuses, setStatuses] = useState<StepStatus[]>(STEPS.map(() => 'waiting'));
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const run = useCallback(() => {
    setRunning(true);
    setDone(false);
    setActiveStep(0);
    setStatuses(STEPS.map(() => 'waiting'));

    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setStatuses((prev) => {
          const next = [...prev];
          if (i > 0) next[i - 1] = 'completed';
          if (i < STEPS.length) next[i] = 'running';
          return next;
        });
        setActiveStep(i);
      }, i * STEP_DURATION);
    });

    setTimeout(() => {
      setStatuses((prev) => {
        const next = [...prev];
        next[STEPS.length - 1] = 'completed';
        return next;
      });
      setActiveStep(STEPS.length);
      setRunning(false);
      setDone(true);
      onComplete?.();
    }, STEPS.length * STEP_DURATION);
  }, [onComplete]);

  useEffect(() => {
    if (runToken > 0) run();
  }, [runToken, run]);

  const progress = Math.round(
    (statuses.filter((s) => s === 'completed').length / STEPS.length) * 100,
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">AI Case Coordinator</h3>
            <p className="text-xs text-slate-500">
              {patientName ? `${patientName} · ` : ''}Autonomous analysis pipeline
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">{progress}%</span>
          {done && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
            >
              <CheckCircle2 className="h-3 w-3" /> Case Ready
            </motion.span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <motion.div
          className="h-full bg-blue-600"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Steps */}
      <div className="p-5 space-y-1">
        {STEPS.map((step, i) => {
          const status = statuses[i];
          const Icon = step.icon;
          return (
            <motion.div
              key={step.id}
              initial={false}
              animate={{
                backgroundColor:
                  status === 'running'
                    ? 'rgba(37,99,235,0.03)'
                    : 'rgba(255,255,255,0)',
              }}
              className="flex items-center gap-4 rounded-xl px-3 py-3"
            >
              {/* Icon / status circle */}
              <div className="relative flex-shrink-0">
                <motion.div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
                    status === 'completed'
                      ? 'bg-emerald-500'
                      : status === 'running'
                        ? 'bg-blue-600'
                        : 'bg-slate-100'
                  }`}
                  animate={status === 'running' ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                  transition={{ duration: 1.2, repeat: status === 'running' ? Infinity : 0 }}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-white" />
                  ) : status === 'running' ? (
                    <Icon className="h-4.5 w-4.5 text-white" />
                  ) : (
                    <Icon className="h-4.5 w-4.5 text-slate-400" />
                  )}
                </motion.div>
                {status === 'running' && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-blue-500"
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </div>

              {/* Label & description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      status === 'completed'
                        ? 'text-slate-500 line-through decoration-emerald-400'
                        : status === 'running'
                          ? 'text-slate-900'
                          : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {status === 'running' && (
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-[10px] font-semibold uppercase tracking-wide text-blue-600"
                    >
                      Running
                    </motion.span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
              </div>

              {/* Status badge */}
              <div className="flex-shrink-0 hidden sm:block">
                {status === 'completed' && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs font-semibold text-emerald-600">
                    Done
                  </motion.span>
                )}
                {status === 'running' && (
                  <div className="flex gap-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="h-1.5 w-1.5 rounded-full bg-blue-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.15 }}
                      />
                    ))}
                  </div>
                )}
                {status === 'waiting' && (
                  <span className="text-xs font-medium text-slate-300">Waiting</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Success footer */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center"
                >
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Case Ready for Review</p>
                  <p className="text-xs text-slate-500">AI analysis complete — view the full report in AI Analysis</p>
                </div>
              </div>
              <Button
                size="sm"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => onComplete?.()}
              >
                View Analysis
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
