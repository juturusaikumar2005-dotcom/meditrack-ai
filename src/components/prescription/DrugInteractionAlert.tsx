import { ShieldAlert } from 'lucide-react';

export function DrugInteractionAlert({ warnings }: { warnings?: string[] }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-5 space-y-3 shadow-xs">
      <div className="flex items-center gap-2 font-['Space_Grotesk'] text-base font-bold text-amber-900">
        <ShieldAlert className="h-5 w-5 text-amber-600" />
        <span>Clinical Precautions & Interaction Warnings</span>
      </div>

      <ul className="space-y-1.5 text-xs text-amber-800 list-disc pl-5 font-['Public_Sans'] leading-relaxed">
        {warnings.map((w, idx) => (
          <li key={idx}>{w}</li>
        ))}
      </ul>
    </div>
  );
}
