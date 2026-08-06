import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown, Zap, Shield, Wine, Baby, Car } from 'lucide-react';

interface Interaction {
  type: 'drug-drug' | 'drug-alcohol' | 'drug-activity' | 'drug-food' | 'drug-pregnancy';
  severity: 'Safe' | 'Moderate' | 'Severe' | 'Critical';
  medicines: string[];
  effect: string;
}

const SEVERITY_CONFIG = {
  Safe: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'SAFE' },
  Moderate: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', label: 'MODERATE' },
  Severe: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500', label: 'SEVERE' },
  Critical: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300', dot: 'bg-red-600', label: 'CRITICAL' },
};

const TYPE_ICON = {
  'drug-drug': Zap,
  'drug-alcohol': Wine,
  'drug-activity': Car,
  'drug-food': AlertTriangle,
  'drug-pregnancy': Baby,
};

function InteractionRow({ interaction, index }: { interaction: Interaction; index: number }) {
  const [open, setOpen] = useState(false);
  const cfg = SEVERITY_CONFIG[interaction.severity] || SEVERITY_CONFIG.Moderate;
  const Icon = TYPE_ICON[interaction.type] || AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={`${cfg.bg} ${cfg.border} border rounded-[12px] overflow-hidden`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:brightness-95 transition-all"
      >
        <span className={`h-2 w-2 rounded-full ${cfg.dot} shrink-0`} />
        <Icon className={`h-4 w-4 ${cfg.color} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
              {cfg.label}
            </span>
            <span className="font-['Public_Sans'] text-xs font-semibold text-[#111827] truncate">
              {interaction.medicines.join(' + ')}
            </span>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 ${cfg.color} shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-current/10"
          >
            <div className="px-4 py-3">
              <p className={`font-['Public_Sans'] text-xs ${cfg.color} leading-relaxed`}>
                {interaction.effect}
              </p>
              {interaction.severity === 'Critical' && (
                <p className="font-['Public_Sans'] text-xs text-red-700 font-bold mt-2">
                  ⚠ Seek immediate medical advice before taking these together.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function DrugInteractionAlert({ interactions }: { interactions: Interaction[] }) {
  if (!interactions || interactions.length === 0) {
    return (
      <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-[12px] px-4 py-3">
        <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
        <p className="font-['Public_Sans'] text-xs text-emerald-700 font-semibold">
          No significant drug interactions detected for this prescription.
        </p>
      </div>
    );
  }

  const critical = interactions.filter(i => i.severity === 'Critical');
  const severe = interactions.filter(i => i.severity === 'Severe');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#1A3C2B]">
          Drug Interaction Analysis
        </span>
        <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38]">
          {interactions.length} interaction{interactions.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {critical.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-[12px] px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
          <p className="font-['Public_Sans'] text-xs text-red-700 font-bold">
            {critical.length} CRITICAL interaction{critical.length > 1 ? 's' : ''} found — consult your doctor immediately.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {interactions.map((interaction, i) => (
          <InteractionRow key={i} interaction={interaction} index={i} />
        ))}
      </div>
    </div>
  );
}
