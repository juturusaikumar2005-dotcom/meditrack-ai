import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Heart, Droplets, Flame, Zap, AlertCircle } from 'lucide-react';

export interface HealthScoresData {
  overallScore?: number;
  bloodHealth?: { status: string; score: number; details: string };
  kidneyHealth?: { status: string; score: number; details: string };
  liverHealth?: { status: string; score: number; details: string };
  heartHealth?: { status: string; score: number; details: string };
  diabetesRisk?: { status: string; score: number; details: string };
  vitaminDeficiency?: { status: string; score: number; details: string };
  infectionIndicators?: { status: string; score: number; details: string };
  hydrationElectrolytes?: { status: string; score: number; details: string };
}

interface OrganHealthScoresProps {
  scores?: HealthScoresData;
}

const CATEGORY_META = [
  { key: 'bloodHealth', label: 'Blood Health', icon: '🩸', defaultStatus: 'Optimal', defaultScore: 92, desc: 'Hemoglobin, RBC, WBC, Platelets' },
  { key: 'kidneyHealth', label: 'Kidney Health', icon: '🫘', defaultStatus: 'Optimal', defaultScore: 95, desc: 'Creatinine, eGFR, BUN, Uric Acid' },
  { key: 'liverHealth', label: 'Liver Health', icon: '🫀', defaultStatus: 'Optimal', defaultScore: 90, desc: 'SGPT, SGOT, Bilirubin, Albumin' },
  { key: 'heartHealth', label: 'Heart & Lipid', icon: '❤️', defaultStatus: 'Optimal', defaultScore: 88, desc: 'Troponin, Cholesterol, LDL, HDL' },
  { key: 'diabetesRisk', label: 'Diabetes Control', icon: '🍬', defaultStatus: 'Low Risk', defaultScore: 94, desc: 'HbA1c, Fasting & Postprandial Sugar' },
  { key: 'vitaminDeficiency', label: 'Vitamin Levels', icon: '☀️', defaultStatus: 'Borderline', defaultScore: 78, desc: 'Vitamin D3, B12, Folate, Iron' },
  { key: 'infectionIndicators', label: 'Immune & Infection', icon: '🛡️', defaultStatus: 'Normal', defaultScore: 96, desc: 'WBC, Neutrophils, CRP, ESR' },
  { key: 'hydrationElectrolytes', label: 'Hydration & Electrolytes', icon: '⚡', defaultStatus: 'Optimal', defaultScore: 94, desc: 'Sodium, Potassium, Hematocrit' },
];

function getScoreColor(score: number) {
  if (score >= 90) return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' };
  if (score >= 75) return { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' };
  return { bar: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' };
}

export function OrganHealthScores({ scores }: OrganHealthScoresProps) {
  const overall = scores?.overallScore ?? 91;
  const overallColor = getScoreColor(overall);

  return (
    <div className="bg-white border border-[#3A3A38]/20 rounded-[18px] p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#3A3A38]/10">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#1A3C2B]" />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#111827]">
              Organ Health & Risk Breakdown
            </h3>
          </div>
          <p className="font-['Public_Sans'] text-xs text-[#3A3A38] mt-0.5">
            Aggregated health indicators derived from extracted biomarkers and clinical ranges.
          </p>
        </div>

        {/* Overall Health Ring */}
        <div className="flex items-center gap-3 bg-[#F7F7F5] border border-[#3A3A38]/15 px-4 py-2 rounded-[12px]">
          <div className="text-right">
            <p className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38] uppercase tracking-wider">
              Overall Score
            </p>
            <p className={`font-['JetBrains_Mono'] text-xl font-black ${overallColor.text}`}>
              {overall} <span className="text-xs text-[#3A3A38] font-normal">/ 100</span>
            </p>
          </div>
          <div className={`h-10 w-10 rounded-full border-2 border-[#1A3C2B] ${overallColor.bg} flex items-center justify-center`}>
            <ShieldCheck className={`h-5 w-5 ${overallColor.text}`} />
          </div>
        </div>
      </div>

      {/* Grid of 8 organ categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {CATEGORY_META.map((cat, idx) => {
          const itemData = (scores as any)?.[cat.key];
          const score = itemData?.score ?? cat.defaultScore;
          const status = itemData?.status ?? cat.defaultStatus;
          const details = itemData?.details ?? cat.desc;
          const c = getScoreColor(score);

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#F7F7F5]/80 border border-[#3A3A38]/15 rounded-[14px] p-3.5 space-y-2.5 hover:bg-white hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg">{cat.icon}</span>
                <span className={`font-['JetBrains_Mono'] text-[9px] font-bold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
                  {status}
                </span>
              </div>

              <div>
                <p className="font-['Space_Grotesk'] text-xs font-bold text-[#111827] truncate">
                  {cat.label}
                </p>
                <p className="font-['Public_Sans'] text-[10px] text-[#3A3A38] line-clamp-1 mt-0.5">
                  {details}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${c.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + idx * 0.05 }}
                  />
                </div>
                <div className="flex justify-between items-center font-['JetBrains_Mono'] text-[9px] text-[#3A3A38]">
                  <span>Score</span>
                  <span className="font-bold">{score}%</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
