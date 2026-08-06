import { motion } from 'framer-motion';
import { AlertTriangle, PhoneCall, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface EmergencyAlertCardProps {
  matchedKeyword?: string;
}

export function EmergencyAlertCard({ matchedKeyword }: EmergencyAlertCardProps) {
  const handleCallEmergency = () => {
    toast('Simulating emergency call placement to 911 / Local EMS', {
      icon: '🚨',
      style: { borderRadius: '12px', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
    });
  };

  const handleLocateER = () => {
    toast('Locating nearest Urgent Care & Emergency Rooms...', {
      icon: '🏥',
      style: { borderRadius: '12px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="my-3 p-4 rounded-2xl bg-red-50/90 border border-red-200/90 shadow-sm text-red-900"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-red-100 text-red-600 shrink-0 mt-0.5">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm tracking-tight text-red-900 flex items-center gap-1.5">
              <span>Emergency Warning</span>
              {matchedKeyword && (
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-red-200/70 text-red-800">
                  {matchedKeyword}
                </span>
              )}
            </h4>
          </div>
          <p className="text-xs leading-relaxed text-red-800 font-medium">
            This may require immediate medical attention. Please contact your local emergency services or visit the nearest emergency department immediately.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCallEmergency}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white font-medium text-xs shadow-sm hover:bg-red-700 transition-colors active:scale-95"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Call Emergency (911/112)</span>
            </button>
            <button
              type="button"
              onClick={handleLocateER}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-red-200 text-red-700 font-medium text-xs hover:bg-red-50 transition-colors active:scale-95"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Find Nearest ER</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
