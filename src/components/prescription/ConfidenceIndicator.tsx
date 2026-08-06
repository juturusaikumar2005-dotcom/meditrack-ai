import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, CheckCircle2, Database } from 'lucide-react';

interface ConfidenceIndicatorProps {
  ocrConfidence: number;
  aiConfidence: number;
  fdaValidated: boolean;
  overall: number;
}

function CircleMeter({ value, label, color }: { value: number; label: string; color: string }) {
  const pct = Math.round(value * 100);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="6" />
          <motion.circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#111827]">{pct}%</span>
        </div>
      </div>
      <span className="font-['Public_Sans'] text-xs text-[#3A3A38] text-center leading-tight">{label}</span>
    </div>
  );
}

export function ConfidenceIndicator({ ocrConfidence, aiConfidence, fdaValidated, overall }: ConfidenceIndicatorProps) {
  const pct = Math.round(overall * 100);
  const isLow = overall < 0.85;
  const isGood = overall >= 0.92;

  const overallColor = isGood ? '#1A3C2B' : isLow ? '#EF4444' : '#F59E0B';
  const ocrColor = ocrConfidence >= 0.9 ? '#1A3C2B' : ocrConfidence >= 0.7 ? '#F59E0B' : '#EF4444';
  const aiColor = aiConfidence >= 0.9 ? '#1A3C2B' : aiConfidence >= 0.7 ? '#F59E0B' : '#EF4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-5 shadow-xs"
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-[#1A3C2B]" />
        <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#1A3C2B]">
          Confidence Report
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 justify-items-center">
        <CircleMeter value={ocrConfidence} label="OCR Accuracy" color={ocrColor} />
        <CircleMeter value={aiConfidence} label="AI Confidence" color={aiColor} />
        <CircleMeter value={overall} label="Overall Score" color={overallColor} />
      </div>

      {/* FDA Validation Badge */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#3A3A38]/10">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-['JetBrains_Mono'] font-bold ${fdaValidated ? 'bg-[#9EFFBF]/40 text-[#1A3C2B]' : 'bg-amber-50 text-amber-700'}`}>
          <Database className="h-3.5 w-3.5" />
          <span>FDA DATABASE: {fdaValidated ? 'VALIDATED ✓' : 'NOT FOUND — VERIFY MANUALLY'}</span>
        </div>
      </div>

      {/* Low confidence warning */}
      {isLow && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-[10px] p-3.5"
        >
          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-['Public_Sans'] text-xs font-bold text-red-700">Low Confidence ({pct}%)</p>
            <p className="font-['Public_Sans'] text-xs text-red-600 mt-0.5">
              This medicine could not be identified confidently. Please verify all details against the original prescription manually.
            </p>
          </div>
        </motion.div>
      )}

      {isGood && (
        <div className="flex items-center gap-2 bg-[#9EFFBF]/20 border border-[#9EFFBF]/40 rounded-[10px] px-3.5 py-2.5">
          <CheckCircle2 className="h-4 w-4 text-[#1A3C2B] shrink-0" />
          <p className="font-['Public_Sans'] text-xs text-[#1A3C2B] font-semibold">
            High confidence identification — cross-validated against clinical drug database.
          </p>
        </div>
      )}
    </motion.div>
  );
}
