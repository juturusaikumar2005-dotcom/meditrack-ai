import { motion } from 'framer-motion';
import { Wine, Car, Baby, HeartPulse, Sun, Droplets, Dumbbell, Moon, Pill, Thermometer } from 'lucide-react';

interface PrecautionData {
  alcohol_warning?: boolean;
  driving_warning?: boolean;
  pregnancy_warning?: string | null;
  storage?: string;
  water_recommendation?: string;
  food_interactions?: string[];
  precautions?: string[];
}

const PRECAUTION_TYPES = [
  {
    key: 'alcohol',
    icon: Wine,
    label: 'Alcohol',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    defaultMsg: 'Avoid alcohol during treatment — may increase side effects or reduce effectiveness.',
  },
  {
    key: 'driving',
    icon: Car,
    label: 'Driving',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    defaultMsg: 'This medication may impair concentration or cause drowsiness. Avoid driving or operating heavy machinery.',
  },
  {
    key: 'pregnancy',
    icon: Baby,
    label: 'Pregnancy',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    defaultMsg: 'Consult your doctor before use during pregnancy or while breastfeeding.',
  },
  {
    key: 'storage',
    icon: Thermometer,
    label: 'Storage',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    defaultMsg: 'Store at room temperature, away from heat, moisture, and direct sunlight.',
  },
  {
    key: 'water',
    icon: Droplets,
    label: 'Water Intake',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    defaultMsg: 'Take with a full glass of water. Stay well hydrated during treatment.',
  },
  {
    key: 'sun',
    icon: Sun,
    label: 'Sun Exposure',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    defaultMsg: 'Some medications increase photosensitivity. Use sunscreen and limit direct sun exposure.',
  },
];

export function PrecautionGrid({ data }: { data: PrecautionData }) {
  const cards = PRECAUTION_TYPES.map(type => {
    let message = '';
    let show = false;

    if (type.key === 'alcohol' && data.alcohol_warning) { show = true; message = type.defaultMsg; }
    if (type.key === 'driving' && data.driving_warning) { show = true; message = type.defaultMsg; }
    if (type.key === 'pregnancy' && data.pregnancy_warning) { show = true; message = data.pregnancy_warning; }
    if (type.key === 'storage' && data.storage) { show = true; message = data.storage; }
    if (type.key === 'water' && data.water_recommendation) { show = true; message = data.water_recommendation; }

    return { ...type, message, show };
  }).filter(c => c.show);

  // Also add any raw precautions
  const rawPrecautions = data.precautions?.filter(p => p?.length > 0) || [];

  if (cards.length === 0 && rawPrecautions.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#1A3C2B]">
          ⚠ Precautions & Warnings
        </span>
      </div>

      {cards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={`${card.bg} ${card.border} border rounded-[12px] p-4 space-y-2`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${card.color} shrink-0`} />
                  <span className={`font-['JetBrains_Mono'] text-xs font-bold uppercase ${card.color}`}>
                    {card.label}
                  </span>
                </div>
                <p className="font-['Public_Sans'] text-xs text-[#3A3A38] leading-relaxed">
                  {card.message}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {rawPrecautions.length > 0 && (
        <ul className="space-y-2">
          {rawPrecautions.map((p, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2.5 font-['Public_Sans'] text-xs text-[#111827]"
            >
              <span className="mt-0.5 h-4 w-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-[10px]">!</span>
              <span>{p}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
