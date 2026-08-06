import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TrendingDown, TrendingUp, Minus, AlertTriangle } from 'lucide-react';

interface LabValueCardProps {
  name: string;
  value: string;
  numericValue?: number | null;
  unit?: string;
  normalRange?: string;
  status: string;
  severity: 'optimal' | 'warning' | 'attention' | 'critical';
  category?: string;
  explanation?: string;
  recommendation?: string;
  index?: number;
}

const STATUS_CONFIG = {
  Normal: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'NORMAL', icon: Minus },
  'Borderline Low': { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'BORDERLINE LOW', icon: TrendingDown },
  'Borderline High': { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'BORDERLINE HIGH', icon: TrendingUp },
  Low: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', label: 'LOW ▼', icon: TrendingDown },
  High: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500', label: 'HIGH ▲', icon: TrendingUp },
  'Critical Low': { bg: 'bg-red-100', border: 'border-red-400', badge: 'bg-red-600 text-white', dot: 'bg-red-700', label: '⚠ CRITICAL LOW', icon: TrendingDown },
  'Critical High': { bg: 'bg-red-100', border: 'border-red-400', badge: 'bg-red-600 text-white', dot: 'bg-red-700', label: '⚠ CRITICAL HIGH', icon: TrendingUp },
  'Active Rx': { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', label: 'ACTIVE Rx', icon: Minus },
  Attention: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', label: 'ATTENTION', icon: AlertTriangle },
};

function RangeBar({ value, range }: { value: number | null | undefined; range: string }) {
  if (!value || !range) return null;

  // Parse "12.0-15.5" or "12.0–15.5"
  const match = range.match(/([\d.]+)\s*[-–]\s*([\d.]+)/);
  if (!match) return null;

  const min = parseFloat(match[1]);
  const max = parseFloat(match[2]);
  const span = max - min;
  if (span <= 0) return null;

  // Clamp position within extended range (50% below min to 50% above max)
  const extMin = min - span * 0.5;
  const extMax = max + span * 0.5;
  const extSpan = extMax - extMin;

  const normalStart = ((min - extMin) / extSpan) * 100;
  const normalWidth = (span / extSpan) * 100;
  const markerPos = Math.max(2, Math.min(98, ((value - extMin) / extSpan) * 100));

  const isNormal = value >= min && value <= max;
  const isLow = value < min;

  return (
    <div className="mt-3 space-y-1.5">
      <div className="relative h-3 bg-[#F7F7F5] rounded-full overflow-visible">
        {/* Normal range zone */}
        <div
          className="absolute h-full bg-emerald-200/70 rounded-full"
          style={{ left: `${normalStart}%`, width: `${normalWidth}%` }}
        />
        {/* Value marker */}
        <motion.div
          initial={{ left: '50%' }}
          animate={{ left: `${markerPos}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-2 border-white shadow-md z-10 ${isNormal ? 'bg-emerald-500' : isLow ? 'bg-orange-500' : 'bg-red-500'}`}
        />
      </div>
      <div className="flex justify-between items-center font-['JetBrains_Mono'] text-[9px] text-[#3A3A38]">
        <span>Low</span>
        <span className="text-emerald-600 font-bold">Normal: {range}</span>
        <span>High</span>
      </div>
    </div>
  );
}

export function LabValueCard({
  name, value, numericValue, unit, normalRange, status, severity,
  category, explanation, recommendation, index = 0,
}: LabValueCardProps) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.Normal;
  const StatusIcon = cfg.icon;
  const isCritical = status.startsWith('Critical');
  const isAbnormal = !['Normal', 'Active Rx'].includes(status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
      className={`${cfg.bg} ${cfg.border} border rounded-[14px] overflow-hidden transition-shadow hover:shadow-md`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 space-y-3"
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`h-2.5 w-2.5 rounded-full ${cfg.dot} shrink-0 mt-0.5`} />
            <div className="min-w-0">
              <p className="font-['Space_Grotesk'] text-sm font-bold text-[#111827] leading-tight truncate">
                {name}
              </p>
              {category && (
                <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase tracking-wide mt-0.5">
                  {category}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <p className="font-['JetBrains_Mono'] text-lg font-black text-[#111827] leading-tight">
                {value || '—'}
              </p>
              {unit && (
                <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38]">{unit}</p>
              )}
            </div>
            <span className={`font-['JetBrains_Mono'] text-[9px] font-bold px-2 py-1 rounded-full ${cfg.badge} flex items-center gap-1 whitespace-nowrap`}>
              <StatusIcon className="h-2.5 w-2.5" />
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Normal range */}
        {normalRange && (
          <div className="flex items-center gap-2">
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase">Normal Range:</span>
            <span className="font-['JetBrains_Mono'] text-[9px] font-bold text-emerald-700">{normalRange} {unit || ''}</span>
          </div>
        )}

        {/* Range bar */}
        {numericValue != null && normalRange && (
          <RangeBar value={numericValue} range={normalRange} />
        )}

        {/* Explanation preview */}
        {explanation && (
          <div className={`flex items-start gap-2 pt-2 border-t ${cfg.border}`}>
            <div className="space-y-1 text-left w-full">
              {isAbnormal && (
                <p className="font-['JetBrains_Mono'] text-[9px] font-bold text-[#3A3A38] uppercase">
                  {status.includes('Low') ? '📉 Meaning:' : '📈 Meaning:'}
                </p>
              )}
              <p className="font-['Public_Sans'] text-xs text-[#111827] leading-relaxed line-clamp-2">
                {explanation}
              </p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-[#3A3A38] shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        )}
      </button>

      {/* Expanded: Recommendation */}
      <AnimatePresence>
        {open && recommendation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className={`px-4 pb-4 pt-2 border-t ${cfg.border} space-y-2`}>
              <p className="font-['JetBrains_Mono'] text-[9px] font-bold text-[#3A3A38] uppercase">📋 Recommendation:</p>
              <p className="font-['Public_Sans'] text-xs text-[#111827] leading-relaxed">{recommendation}</p>
              {isCritical && (
                <div className="flex items-start gap-2 bg-red-600 text-white rounded-[8px] px-3 py-2">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <p className="font-['Public_Sans'] text-[10px] font-bold">
                    This value is critically abnormal. Seek immediate medical attention.
                  </p>
                </div>
              )}
              <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38]/60 italic border-t border-current/10 pt-2">
                ⚕ AI analysis only. Not a medical diagnosis. Consult your doctor.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
