import { Sun, Sunset, Moon } from 'lucide-react';

export function MedicationTimeline({ medicines }: { medicines: any[] }) {
  const morningList = medicines?.filter((m) => m.schedule?.morning) || [];
  const afternoonList = medicines?.filter((m) => m.schedule?.afternoon) || [];
  const nightList = medicines?.filter((m) => m.schedule?.night) || [];

  return (
    <div className="bg-white border border-[#3A3A38]/20 rounded-[20px] p-6 space-y-4 shadow-xs">
      <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#111827]">
        Daily Medication Schedule
      </h3>

      <div className="grid sm:grid-cols-3 gap-4 text-xs font-['Public_Sans']">
        {/* Morning Slot */}
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-[16px] p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold font-['Space_Grotesk']">
            <Sun className="h-4 w-4 text-amber-600" />
            <span>Morning (Breakfast)</span>
          </div>
          {morningList.length === 0 ? (
            <p className="text-slate-400 text-[11px]">No morning doses</p>
          ) : (
            <ul className="space-y-1 text-amber-900 font-semibold">
              {morningList.map((m, idx) => (
                <li key={idx} className="truncate">• {m.name} ({m.dosage})</li>
              ))}
            </ul>
          )}
        </div>

        {/* Afternoon Slot */}
        <div className="bg-orange-50/60 border border-orange-200/60 rounded-[16px] p-4 space-y-2">
          <div className="flex items-center gap-2 text-orange-800 font-bold font-['Space_Grotesk']">
            <Sunset className="h-4 w-4 text-orange-600" />
            <span>Afternoon (Lunch)</span>
          </div>
          {afternoonList.length === 0 ? (
            <p className="text-slate-400 text-[11px]">No afternoon doses</p>
          ) : (
            <ul className="space-y-1 text-orange-900 font-semibold">
              {afternoonList.map((m, idx) => (
                <li key={idx} className="truncate">• {m.name} ({m.dosage})</li>
              ))}
            </ul>
          )}
        </div>

        {/* Night Slot */}
        <div className="bg-indigo-50/60 border border-indigo-200/60 rounded-[16px] p-4 space-y-2">
          <div className="flex items-center gap-2 text-indigo-800 font-bold font-['Space_Grotesk']">
            <Moon className="h-4 w-4 text-indigo-600" />
            <span>Night (Bedtime)</span>
          </div>
          {nightList.length === 0 ? (
            <p className="text-slate-400 text-[11px]">No night doses</p>
          ) : (
            <ul className="space-y-1 text-indigo-900 font-semibold">
              {nightList.map((m, idx) => (
                <li key={idx} className="truncate">• {m.name} ({m.dosage})</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
