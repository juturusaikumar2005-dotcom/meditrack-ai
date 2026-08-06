import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TourStep {
  target: string; // CSS selector for the element to highlight
  title: string;
  description: string;
  placement?: 'bottom' | 'top' | 'right' | 'left';
}

const TOUR_STEPS: TourStep[] = [
  { target: '[data-tour="sidebar-dashboard"]', title: 'Dashboard', description: 'Get a real-time overview of your blood tests, vitals, and AI health interpretations.', placement: 'right' },
  { target: '[data-tour="sidebar-upload"]', title: 'Upload Reports', description: 'Drag and drop medical scans, blood lab reports, and prescriptions for instant AI analysis.', placement: 'right' },
  { target: '[data-tour="sidebar-ai-analysis"]', title: 'AI Analysis', description: 'View parsed biomarker data, clinical thresholds, and key diagnostic findings.', placement: 'right' },
  { target: '[data-tour="sidebar-history"]', title: 'Health Timeline', description: 'Track your vital trends and diagnostic history across months.', placement: 'right' },
  { target: '[data-tour="sidebar-patients"]', title: 'Specialist Recommendations', description: 'Find nearby accredited specialists matched to your diagnostic findings.', placement: 'right' },
];

const STORAGE_KEY = 'meditrack_onboarding_complete';

export function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateRect = useCallback(() => {
    if (!visible) return;
    const el = document.querySelector(TOUR_STEPS[step].target);
    if (el) {
      setRect(el.getBoundingClientRect());
    } else {
      // If target not found, default to center
      setRect(null);
    }
  }, [visible, step]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [updateRect]);

  const finish = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  }, []);

  const skip = useCallback(() => finish(), [finish]);
  const next = useCallback(() => {
    if (step < TOUR_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }, [step, finish]);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  if (!visible) return null;

  const current = TOUR_STEPS[step];
  const hasTarget = rect !== null;

  // Tooltip position calculation
  let tooltipStyle: React.CSSProperties = {};
  if (hasTarget && rect) {
    const spacing = 16;
    switch (current.placement) {
      case 'right':
        tooltipStyle = { left: rect.right + spacing, top: rect.top };
        break;
      case 'left':
        tooltipStyle = { left: rect.left - 320 - spacing, top: rect.top };
        break;
      case 'bottom':
        tooltipStyle = { left: rect.left, top: rect.bottom + spacing };
        break;
      case 'top':
        tooltipStyle = { left: rect.left, top: rect.top - 220 - spacing };
        break;
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop with spotlight cutout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-auto"
            style={{
              backgroundColor: 'rgba(17, 24, 39, 0.45)',
              maskImage: hasTarget && rect
                ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><rect width='100%' height='100%' fill='black'/><rect x='${rect.left - 6}' y='${rect.top - 6}' width='${rect.width + 12}' height='${rect.height + 12}' rx='12' fill='white'/></svg>")`
                : undefined,
              WebkitMaskImage: hasTarget && rect
                ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><rect width='100%' height='100%' fill='black'/><rect x='${rect.left - 6}' y='${rect.top - 6}' width='${rect.width + 12}' height='${rect.height + 12}' rx='12' fill='white'/></svg>")`
                : undefined,
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }}
          />

          {/* Highlight ring around target */}
          {hasTarget && rect && (
            <motion.div
              initial={false}
              animate={{
                left: rect.left - 6,
                top: rect.top - 6,
                width: rect.width + 12,
                height: rect.height + 12,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="fixed z-[101] rounded-xl ring-2 ring-blue-500 pointer-events-none"
            />
          )}

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            style={hasTarget ? tooltipStyle : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            className="fixed z-[102] w-[300px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.15)] p-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                    {step + 1} of {TOUR_STEPS.length}
                  </span>
                </div>
              </div>
              <button onClick={skip} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <h3 className="text-base font-bold text-slate-900">{current.title}</h3>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{current.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-5">
              {/* Dots */}
              <div className="flex gap-1.5">
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${i === step ? 'w-5 bg-blue-600' : 'w-1.5 bg-slate-200'}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <Button variant="ghost" size="sm" onClick={prev} leftIcon={<ChevronLeft className="h-4 w-4" />}>
                    Back
                  </Button>
                )}
                <Button size="sm" onClick={next} rightIcon={<ChevronRight className="h-4 w-4" />}>
                  {step === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>

            {/* Skip link */}
            <button
              onClick={skip}
              className="absolute -bottom-7 right-0 text-xs text-slate-400 hover:text-slate-600"
            >
              Skip tour
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
