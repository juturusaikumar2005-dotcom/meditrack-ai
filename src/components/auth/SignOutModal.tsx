import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, ShieldAlert } from 'lucide-react';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function SignOutModal({ isOpen, onClose, onConfirm, loading }: SignOutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111827]/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md bg-white border border-[#3A3A38]/20 rounded-[20px] p-6 sm:p-8 shadow-2xl space-y-6 font-['Public_Sans']"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1 text-[#3A3A38] hover:text-[#111827] hover:bg-[#F7F7F5] rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon & Title */}
            <div className="space-y-4">
              <div className="h-14 w-14 rounded-[16px] bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
                <LogOut className="h-7 w-7" />
              </div>

              <div className="space-y-1.5">
                <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                  SESSION TERMINATION
                </span>
                <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-[#111827]">
                  Sign Out Confirmation
                </h3>
              </div>

              <p className="text-sm sm:text-base text-[#3A3A38] leading-relaxed">
                Are you sure you want to sign out of your MediTrack AI health portal? You will need to log in again to access your medical reports and AI assistant.
              </p>
            </div>

            {/* 2 Action Buttons: Cancel and Sign Out */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-[#F7F7F5] border border-[#3A3A38]/20 text-[#111827] font-semibold text-sm sm:text-base rounded-[12px] hover:bg-slate-200 hover:border-[#3A3A38]/40 transition-all cursor-pointer text-center"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base rounded-[12px] transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
