import { AlertCircle, ShieldCheck } from 'lucide-react';

export function PrecautionGrid({
  details,
}: {
  details: {
    alcohol_warning?: boolean;
    driving_warning?: boolean;
    pregnancy_warning?: string | null;
    storage?: string;
    water_recommendation?: string;
    food_interactions?: string[];
    precautions?: string[];
  };
}) {
  return (
    <div className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-5 space-y-4 shadow-xs font-['Public_Sans'] text-xs">
      <div className="flex items-center gap-2 font-['Space_Grotesk'] text-base font-bold text-[#111827]">
        <ShieldCheck className="h-5 w-5 text-[#1A3C2B]" />
        <span>General Medication Storage & Guidance</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {details.storage && (
          <div className="bg-[#F7F7F5] p-3 rounded-[12px] border border-[#3A3A38]/15">
            <span className="font-bold text-[#111827] block mb-0.5">Storage Advice:</span>
            <p className="text-[#3A3A38]">{details.storage}</p>
          </div>
        )}

        {details.water_recommendation && (
          <div className="bg-[#F7F7F5] p-3 rounded-[12px] border border-[#3A3A38]/15">
            <span className="font-bold text-[#111827] block mb-0.5">Hydration Advice:</span>
            <p className="text-[#3A3A38]">{details.water_recommendation}</p>
          </div>
        )}
      </div>

      {details.precautions && details.precautions.length > 0 && (
        <div className="space-y-1">
          <span className="font-bold text-[#111827] block">Key Safety Rules:</span>
          <ul className="list-disc pl-5 text-[#3A3A38] space-y-1">
            {details.precautions.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
