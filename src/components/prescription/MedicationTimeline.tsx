import { motion } from 'framer-motion';
import { Sunrise, Sun, Moon } from 'lucide-react';

interface Medicine {
  brand_name: string;
  generic_name?: string | null;
  strength?: string | null;
  dosage?: string;
  timing?: string;
  schedule: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
    sos?: boolean;
  };
}

interface TimeSlot {
  key: 'morning' | 'afternoon' | 'night';
  label: string;
  time: string;
  Icon: typeof Sunrise;
  iconColor: string;
  bg: string;
  border: string;
  headerBg: string;
}

const TIME_SLOTS: TimeSlot[] = [
  {
    key: 'morning',
    label: 'Morning',
    time: '8:00 AM',
    Icon: Sunrise,
    iconColor: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    headerBg: 'bg-amber-100',
  },
  {
    key: 'afternoon',
    label: 'Afternoon',
    time: '1:00 PM',
    Icon: Sun,
    iconColor: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    headerBg: 'bg-orange-100',
  },
  {
    key: 'night',
    label: 'Night',
    time: '8:00 PM',
    Icon: Moon,
    iconColor: 'text-[#1A3C2B]',
    bg: 'bg-[#1A3C2B]/5',
    border: 'border-[#1A3C2B]/20',
    headerBg: 'bg-[#1A3C2B]/10',
  },
];

function PillBadge({ medicine, index }: { medicine: Medicine; index: number }) {
  const isBeforeFood = medicine.timing?.toLowerCase().includes('before');
  const isAfterFood = medicine.timing?.toLowerCase().includes('after');

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-[#3A3A38]/15 rounded-[10px] px-3 py-2.5 shadow-xs"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-['Public_Sans'] text-xs font-bold text-[#111827] truncate leading-tight">
            {medicine.brand_name}
          </p>
          {medicine.generic_name && (
            <p className="font-['Public_Sans'] text-[10px] text-[#3A3A38] truncate leading-tight mt-0.5">
              {medicine.generic_name}
            </p>
          )}
        </div>
        {medicine.strength && (
          <span className="font-['JetBrains_Mono'] text-[9px] bg-[#1A3C2B]/10 text-[#1A3C2B] px-1.5 py-0.5 rounded-full shrink-0">
            {medicine.strength}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
        <span className="font-['JetBrains_Mono'] text-[9px] text-[#3A3A38]">
          {medicine.dosage || '1 tablet'}
        </span>
        {(isBeforeFood || isAfterFood) && (
          <span className={`font-['JetBrains_Mono'] text-[9px] px-1.5 py-0.5 rounded-full ${isBeforeFood ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
            {isBeforeFood ? '◈ Before Food' : '◈ After Food'}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function MedicationTimeline({ medicines }: { medicines: Medicine[] }) {
  const hasSos = medicines.some(m => m.schedule?.sos);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#1A3C2B]">
          📅 Daily Medication Schedule
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIME_SLOTS.map((slot, si) => {
          const slotMeds = medicines.filter(m => m.schedule?.[slot.key]);
          const Icon = slot.Icon;

          return (
            <motion.div
              key={slot.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`${slot.bg} ${slot.border} border rounded-[14px] overflow-hidden`}
            >
              {/* Header */}
              <div className={`${slot.headerBg} px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <Icon className={`h-4.5 w-4.5 ${slot.iconColor}`} />
                  <div>
                    <p className="font-['Space_Grotesk'] text-sm font-bold text-[#111827]">{slot.label}</p>
                    <p className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38]">{slot.time}</p>
                  </div>
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px] bg-white/70 px-2 py-0.5 rounded-full text-[#3A3A38]">
                  {slotMeds.length} med{slotMeds.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Pills */}
              <div className="p-3 space-y-2">
                {slotMeds.length > 0 ? (
                  slotMeds.map((m, i) => (
                    <PillBadge key={`${slot.key}-${i}`} medicine={m} index={i} />
                  ))
                ) : (
                  <p className="font-['Public_Sans'] text-xs text-[#3A3A38]/60 text-center py-3 italic">
                    No medicines scheduled
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SOS / As Needed medicines */}
      {hasSos && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="bg-purple-50 border border-purple-200 rounded-[12px] p-4"
        >
          <p className="font-['JetBrains_Mono'] text-xs font-bold text-purple-700 uppercase mb-2">SOS / As Needed</p>
          <div className="space-y-2">
            {medicines.filter(m => m.schedule?.sos).map((m, i) => (
              <PillBadge key={i} medicine={m} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
