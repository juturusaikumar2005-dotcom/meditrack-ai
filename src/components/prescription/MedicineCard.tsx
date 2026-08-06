import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill,
  ChevronDown,
  Clock,
  Calendar,
  AlertTriangle,
  Info,
  Package,
  Droplets,
  CheckCircle2,
} from 'lucide-react';

interface SideEffects {
  common: string[];
  rare: string[];
  emergency: string[];
}

interface Medicine {
  brand_name: string;
  generic_name?: string | null;
  strength?: string | null;
  dosage?: string;
  frequency?: string;
  frequency_decoded?: string;
  timing?: string;
  duration?: string | null;
  start_date?: string;
  end_date?: string | null;
  purpose?: string | null;
  precautions?: string[];
  side_effects?: SideEffects;
  drug_interactions?: string[];
  food_interactions?: string[];
  missed_dose?: string;
  storage?: string;
  water_recommendation?: string;
  alcohol_warning?: boolean;
  driving_warning?: boolean;
  pregnancy_warning?: string | null;
  fda_validated?: boolean;
  overall_confidence?: number;
  low_confidence_warning?: boolean;
}

const CONFIDENCE_STYLE = (c: number) => {
  if (c >= 0.92) return { bar: 'bg-emerald-500', label: 'text-emerald-700', text: 'High' };
  if (c >= 0.85) return { bar: 'bg-[#1A3C2B]', label: 'text-[#1A3C2B]', text: 'Good' };
  if (c >= 0.70) return { bar: 'bg-amber-500', label: 'text-amber-700', text: 'Moderate' };
  return { bar: 'bg-red-500', label: 'text-red-700', text: 'Low — verify' };
};

export function MedicineCard({ medicine, index }: { medicine: Medicine; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const conf = medicine.overall_confidence ?? 0.9;
  const cs = CONFIDENCE_STYLE(conf);
  const pct = Math.round(conf * 100);
  const isBeforeFood = medicine.timing?.toLowerCase().includes('before');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, ease: [0.22, 1, 0.36, 1], duration: 0.55 }}
      className="bg-white border border-[#3A3A38]/20 rounded-[16px] overflow-hidden shadow-xs hover:shadow-md transition-shadow"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[#1A3C2B] to-[#1A3C2B]/80 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 bg-[#9EFFBF]/20 rounded-[10px] flex items-center justify-center shrink-0 border border-[#9EFFBF]/30">
              <Pill className="h-5 w-5 text-[#9EFFBF]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-white truncate">
                {medicine.brand_name}
              </h3>
              {medicine.generic_name && (
                <p className="font-['Public_Sans'] text-xs text-[#9EFFBF]/80 truncate">
                  {medicine.generic_name}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {medicine.strength && (
              <span className="font-['JetBrains_Mono'] text-xs bg-[#9EFFBF]/20 text-[#9EFFBF] border border-[#9EFFBF]/30 px-2 py-1 rounded-full">
                {medicine.strength}
              </span>
            )}
            {medicine.fda_validated && (
              <span className="font-['JetBrains_Mono'] text-[9px] bg-white/10 text-white border border-white/20 px-2 py-1 rounded-full">
                FDA ✓
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Low Confidence Warning */}
      {medicine.low_confidence_warning && (
        <div className="bg-red-50 border-b border-red-200 px-5 py-2.5 flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
          <p className="font-['Public_Sans'] text-[11px] text-red-700 font-semibold">
            Low confidence ({pct}%) — Please verify this medicine against the original prescription.
          </p>
        </div>
      )}

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#3A3A38]/10 border-b border-[#3A3A38]/10">
        {[
          { label: 'Dosage', value: medicine.dosage || '1 tablet' },
          { label: 'Frequency', value: medicine.frequency_decoded || medicine.frequency || 'OD' },
          { label: 'Duration', value: medicine.duration || 'As directed' },
          { label: 'Timing', value: isBeforeFood !== undefined ? (isBeforeFood ? 'Before Food' : 'After Food') : (medicine.timing || 'As directed') },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3">
            <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase tracking-wider mb-1">{label}</p>
            <p className="font-['Public_Sans'] text-xs font-semibold text-[#111827] leading-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Purpose */}
        {medicine.purpose && (
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-[#1A3C2B] mt-0.5 shrink-0" />
            <div>
              <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase tracking-wider mb-0.5">Purpose</p>
              <p className="font-['Public_Sans'] text-xs text-[#111827]">{medicine.purpose}</p>
            </div>
          </div>
        )}

        {/* Confidence Meter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase tracking-wider">
              Identification Confidence
            </span>
            <span className={`font-['JetBrains_Mono'] text-[9px] font-bold ${cs.label}`}>
              {pct}% — {cs.text}
            </span>
          </div>
          <div className="h-1.5 bg-[#F7F7F5] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 + index * 0.1 }}
              className={`h-full ${cs.bar} rounded-full`}
            />
          </div>
        </div>

        {/* Dates */}
        {(medicine.start_date || medicine.end_date) && (
          <div className="flex items-center gap-4">
            {medicine.start_date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#1A3C2B]" />
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38]">
                  Start: <span className="text-[#111827] font-bold">{medicine.start_date}</span>
                </span>
              </div>
            )}
            {medicine.end_date && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#1A3C2B]" />
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38]">
                  End: <span className="text-[#111827] font-bold">{medicine.end_date}</span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expand / Collapse Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3 bg-[#F7F7F5] border-t border-[#3A3A38]/10 hover:bg-[#1A3C2B]/5 transition-colors group"
      >
        <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-[#1A3C2B] uppercase tracking-wider">
          {expanded ? 'Show Less' : 'View Side Effects, Storage & More'}
        </span>
        <ChevronDown className={`h-4 w-4 text-[#1A3C2B] transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-4 space-y-5 border-t border-[#3A3A38]/10">
              {/* Side Effects */}
              {medicine.side_effects && (
                <div className="space-y-3">
                  <p className="font-['JetBrains_Mono'] text-[9px] font-bold text-[#111827] uppercase tracking-wider">Side Effects</p>
                  {medicine.side_effects.common?.length > 0 && (
                    <div>
                      <p className="font-['JetBrains_Mono'] text-[9px] text-emerald-600 uppercase mb-1">Common</p>
                      <div className="flex flex-wrap gap-1.5">
                        {medicine.side_effects.common.map((s, i) => (
                          <span key={i} className="font-['Public_Sans'] text-[10px] bg-gray-100 text-[#3A3A38] px-2 py-1 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {medicine.side_effects.rare?.length > 0 && (
                    <div>
                      <p className="font-['JetBrains_Mono'] text-[9px] text-amber-600 uppercase mb-1">Rare</p>
                      <div className="flex flex-wrap gap-1.5">
                        {medicine.side_effects.rare.map((s, i) => (
                          <span key={i} className="font-['Public_Sans'] text-[10px] bg-amber-50 text-amber-700 px-2 py-1 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {medicine.side_effects.emergency?.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-[10px] p-3">
                      <p className="font-['JetBrains_Mono'] text-[9px] text-red-600 uppercase mb-1.5 font-bold">⚠ Seek Emergency Care If:</p>
                      <ul className="space-y-1">
                        {medicine.side_effects.emergency.map((s, i) => (
                          <li key={i} className="font-['Public_Sans'] text-[10px] text-red-700 flex items-start gap-1.5">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Missed Dose */}
              {medicine.missed_dose && (
                <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-3.5">
                  <p className="font-['JetBrains_Mono'] text-[9px] font-bold text-blue-700 uppercase mb-1.5">Missed Dose</p>
                  <p className="font-['Public_Sans'] text-xs text-blue-700">{medicine.missed_dose}</p>
                </div>
              )}

              {/* Storage */}
              {medicine.storage && (
                <div className="flex items-start gap-2.5">
                  <Package className="h-4 w-4 text-[#3A3A38] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase tracking-wider mb-0.5">Storage</p>
                    <p className="font-['Public_Sans'] text-xs text-[#111827]">{medicine.storage}</p>
                  </div>
                </div>
              )}

              {/* Water */}
              {medicine.water_recommendation && (
                <div className="flex items-start gap-2.5">
                  <Droplets className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
                  <p className="font-['Public_Sans'] text-xs text-[#111827]">{medicine.water_recommendation}</p>
                </div>
              )}

              {/* Food Interactions */}
              {medicine.food_interactions && medicine.food_interactions.length > 0 && (
                <div>
                  <p className="font-['JetBrains_Mono'] text-[9px] font-bold text-[#111827] uppercase tracking-wider mb-2">Food Interactions</p>
                  <ul className="space-y-1">
                    {medicine.food_interactions.map((f, i) => (
                      <li key={i} className="font-['Public_Sans'] text-xs text-[#3A3A38] flex items-start gap-1.5">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
