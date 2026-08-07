import { Pill, Clock, CheckCircle2 } from 'lucide-react';

export interface MedicineProps {
  medicine: {
    name: string;
    dosage: string;
    frequency: string;
    timing: string;
    duration?: string;
    purpose?: string;
    instructions?: string;
    schedule?: { morning: boolean; afternoon: boolean; night: boolean };
  };
}

export function MedicineCard({ medicine }: MedicineProps) {
  return (
    <div className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-5 space-y-3 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 bg-[#1A3C2B]/10 text-[#1A3C2B] rounded-[12px] flex items-center justify-center shrink-0 font-bold">
            <Pill className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-['Space_Grotesk'] text-base font-bold text-[#111827]">
              {medicine.name}
            </h4>
            <p className="font-['Public_Sans'] text-xs text-[#1A3C2B] font-semibold">
              {medicine.purpose || 'Prescribed Medication'}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-[#1A3C2B] text-[#9EFFBF] font-['Space_Grotesk'] font-bold text-xs rounded-full">
          {medicine.dosage}
        </span>
      </div>

      <div className="pt-2 border-t border-[#3A3A38]/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#3A3A38]">
        <div className="flex items-center gap-1.5 font-semibold text-[#111827]">
          <Clock className="h-3.5 w-3.5 text-[#1A3C2B]" />
          <span>{medicine.frequency} ({medicine.timing})</span>
        </div>

        {medicine.duration && (
          <span className="font-['JetBrains_Mono'] bg-[#F7F7F5] px-2 py-0.5 rounded-md border border-[#3A3A38]/15">
            {medicine.duration}
          </span>
        )}
      </div>

      {medicine.instructions && (
        <p className="text-xs text-[#3A3A38] bg-[#F7F7F5] p-2.5 rounded-[10px] border border-[#3A3A38]/10 leading-relaxed">
          {medicine.instructions}
        </p>
      )}
    </div>
  );
}
