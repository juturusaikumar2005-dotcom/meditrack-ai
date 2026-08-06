import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { GoogleIcon } from '@/pages/SignInPage';

export function GoogleAccountModal({
  isOpen,
  onClose,
  onSelectAccount,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (fullName: string, email: string) => void;
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid Google email address');
      return;
    }
    const finalName = fullName.trim() || email.split('@')[0].replace(/[._-]/g, ' ');
    onSelectAccount(finalName, email.trim());
  };

  const handleQuickSelect = (name: string, mail: string) => {
    onSelectAccount(name, mail);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-['Public_Sans']">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111827]/50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="relative w-full max-w-md bg-white border border-[#3A3A38]/20 rounded-[24px] shadow-2xl overflow-hidden z-10"
          >
            {/* Top Bar */}
            <div className="p-6 bg-[#F7F7F5] border-b border-[#3A3A38]/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white border border-[#3A3A38]/20 flex items-center justify-center shadow-xs">
                  <GoogleIcon />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#111827]">
                    Sign in with Google
                  </h3>
                  <p className="text-xs text-[#3A3A38]">Choose an account for MediTrack AI</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#3A3A38] hover:bg-[#3A3A38]/10 hover:text-[#111827] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Form */}
            <div className="p-6 space-y-6">
              {/* Quick Account Suggestions */}
              <div className="space-y-2">
                <p className="font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-wider text-[#3A3A38]">
                  Or Select Account:
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleQuickSelect('Saikumar Juturu', 'juturusaikumar2005@gmail.com')}
                    className="w-full p-3 rounded-[14px] bg-[#F7F7F5] border border-[#3A3A38]/20 hover:border-[#1A3C2B] hover:bg-[#1A3C2B]/5 flex items-center gap-3 transition-colors text-left cursor-pointer group"
                  >
                    <div className="h-9 w-9 rounded-full bg-[#1A3C2B] text-[#9EFFBF] font-['Space_Grotesk'] font-bold text-sm flex items-center justify-center shrink-0">
                      SJ
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#111827] group-hover:text-[#1A3C2B]">
                        Saikumar Juturu
                      </p>
                      <p className="text-[11px] text-[#3A3A38] truncate">juturusaikumar2005@gmail.com</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center py-1">
                <div className="w-full border-t border-[#3A3A38]/15" />
                <span className="absolute bg-white px-3 font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase">
                  ENTER CUSTOM GOOGLE ACCOUNT
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Your Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 h-4 w-4 text-[#3A3A38]" />
                    <input
                      type="text"
                      placeholder="e.g. Saikumar Juturu"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setError('');
                      }}
                      className="w-full h-11 pl-10 pr-3.5 rounded-[12px] bg-[#F7F7F5] border border-[#3A3A38]/20 text-xs sm:text-sm text-[#111827] placeholder:text-[#3A3A38]/50 outline-none focus:border-[#1A3C2B] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    Google Email Address *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 h-4 w-4 text-[#3A3A38]" />
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      className="w-full h-11 pl-10 pr-3.5 rounded-[12px] bg-[#F7F7F5] border border-[#3A3A38]/20 text-xs sm:text-sm text-[#111827] placeholder:text-[#3A3A38]/50 outline-none focus:border-[#1A3C2B] focus:bg-white transition-colors"
                    />
                  </div>
                  {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full h-11 rounded-[12px] bg-[#1A3C2B] text-white text-xs sm:text-sm font-semibold hover:bg-[#1A3C2B]/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Continue with Google Account</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-[#F7F7F5] border-t border-[#3A3A38]/15 text-center text-[10px] font-['JetBrains_Mono'] text-[#3A3A38] flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1A3C2B]" />
              <span>To continue, Google will share your name and email with MediTrack AI.</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
