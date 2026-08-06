import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  User,
  Sparkles,
  Upload,
  Pill,
  MessageSquare,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SignOutModal } from '@/components/auth/SignOutModal';
import { AIAssistantLogo } from '@/components/common/AIAssistantLogo';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function WelcomeLandingPage() {
  const navigate = useNavigate();
  const { profile, session, signOut } = useAuth();
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleConfirmSignOut = async () => {
    setSigningOut(true);
    await signOut();
    window.location.href = '/';
  };

  // User details fallback
  const fullName =
    profile?.full_name ||
    session?.user?.user_metadata?.full_name ||
    session?.user?.email?.split('@')[0] ||
    'Alex Morgan';

  const userEmail = session?.user?.email || profile?.email || 'patient@meditrack.ai';

  const avatarUrl =
    profile?.avatar_url ||
    session?.user?.user_metadata?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`;

  return (
    <div className="min-h-screen bg-[#F7F7F5] mosaic-bg text-[#111827] flex flex-col justify-between select-none font-['Public_Sans'] relative overflow-hidden">
      {/* Animated Medical Background */}
      <AnimatedBackground dense />

      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleConfirmSignOut}
        loading={signingOut}
      />

      {/* Top Header */}
      <header className="px-6 sm:px-12 py-6 flex items-center justify-between z-20 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="h-11 w-11 bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center rounded-[12px] border border-[#1A3C2B] shadow-xs group-hover:scale-105 transition-transform">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <span className="font-[#111827] font-['Space_Grotesk'] text-2xl font-bold tracking-tight group-hover:text-[#1A3C2B] transition-colors">
            MEDITRACK<span className="text-[#1A3C2B]"> AI</span>
          </span>
        </div>

        {/* Live Session Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-[#1A3C2B]/10 border border-[#1A3C2B]/20 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#5AE68E] animate-pulse" />
          <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#1A3C2B] uppercase tracking-wider">
            Clinical Session Active
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-10 z-20 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full space-y-8"
        >
          {/* Welcome Card Banner */}
          <div className="bg-white border border-[#3A3A38]/20 rounded-[24px] p-6 sm:p-10 shadow-xs relative overflow-hidden">
            {/* Soft decorative background pulse */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#9EFFBF]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-full text-xs font-semibold text-[#1A3C2B]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#1A3C2B]" />
                  <span>Authenticated Healthcare Portal</span>
                </div>
                <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight">
                  Welcome back, <span className="text-[#1A3C2B] capitalize">{fullName}</span> 👋
                </h1>
                <p className="font-['Public_Sans'] text-base sm:text-lg text-[#3A3A38] max-w-xl">
                  Your AI health intelligence portal is ready. Select an action below to proceed into your clinical dashboard or exit your session.
                </p>
              </div>

              {/* User Identity Chip */}
              <div className="flex items-center gap-3.5 bg-[#F7F7F5] border border-[#3A3A38]/20 px-4 py-3 rounded-[16px] shrink-0 w-full sm:w-auto">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="h-12 w-12 rounded-full border-2 border-[#1A3C2B] bg-[#1A3C2B]/10 object-cover"
                />
                <div className="text-left overflow-hidden">
                  <p className="font-['Public_Sans'] text-sm font-bold text-[#111827] truncate">
                    {fullName}
                  </p>
                  <p className="font-['JetBrains_Mono'] text-xs text-[#3A3A38] truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TWO MAIN OPTIONS CARDS */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* OPTION 1: GO TO DASHBOARD */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 24 }}
              onClick={() => navigate('/app/dashboard')}
              className="bg-[#1A3C2B] text-white border border-[#1A3C2B] rounded-[24px] p-7 sm:p-8 flex flex-col justify-between cursor-pointer shadow-md group relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-radial from-[#9EFFBF]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 bg-white/10 text-[#9EFFBF] border border-white/20 flex items-center justify-center rounded-[16px]">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <span className="px-3 py-1 bg-[#9EFFBF]/20 text-[#9EFFBF] text-xs font-['JetBrains_Mono'] font-semibold rounded-full border border-[#9EFFBF]/30">
                    PRIMARY OPTION
                  </span>
                </div>

                <div>
                  <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-white group-hover:text-[#9EFFBF] transition-colors">
                    Go to Dashboard
                  </h2>
                  <p className="font-['Public_Sans'] text-sm text-slate-300 mt-2 leading-relaxed">
                    Access your complete medical command center — report history, AI lab analysis, organ health scores, and prescription engine.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/15 flex items-center justify-between text-[#9EFFBF] font-semibold text-base relative z-10">
                <span>Enter Healthcare Dashboard</span>
                <div className="h-9 w-9 bg-white/10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </motion.div>

            {/* OPTION 2: SIGN OUT */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 24 }}
              onClick={() => setShowSignOutModal(true)}
              className="bg-white text-[#111827] border border-[#3A3A38]/20 rounded-[24px] p-7 sm:p-8 flex flex-col justify-between cursor-pointer shadow-xs hover:border-[#FF8C69] group relative overflow-hidden"
            >
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 bg-[#FF8C69]/10 text-[#FF8C69] border border-[#FF8C69]/20 flex items-center justify-center rounded-[16px]">
                    <LogOut className="h-6 w-6" />
                  </div>
                  <span className="px-3 py-1 bg-[#3A3A38]/10 text-[#3A3A38] text-xs font-['JetBrains_Mono'] font-semibold rounded-full border border-[#3A3A38]/15">
                    SECURE EXIT
                  </span>
                </div>

                <div>
                  <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#111827] group-hover:text-[#FF8C69] transition-colors">
                    Sign Out
                  </h2>
                  <p className="font-['Public_Sans'] text-sm text-[#3A3A38] mt-2 leading-relaxed">
                    End your active session securely. Clears local credentials and returns to the main public landing page.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#3A3A38]/15 flex items-center justify-between text-[#FF8C69] font-semibold text-base relative z-10">
                <span>Sign Out & Exit Session</span>
                <div className="h-9 w-9 bg-[#FF8C69]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LogOut className="h-4 w-4 text-[#FF8C69]" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Portal Direct Shortcuts */}
          <div className="bg-white/80 backdrop-blur-xs border border-[#3A3A38]/15 rounded-[20px] p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#1A3C2B]" />
              <span className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider text-[#1A3C2B]">
                Quick Shortcuts:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/app/upload')}
                className="px-3.5 py-1.5 bg-[#F7F7F5] border border-[#3A3A38]/20 hover:border-[#1A3C2B] text-[#1A3C2B] text-xs font-semibold rounded-[10px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Report</span>
              </button>
              <button
                onClick={() => navigate('/app/prescription')}
                className="px-3.5 py-1.5 bg-[#F7F7F5] border border-[#3A3A38]/20 hover:border-[#1A3C2B] text-[#1A3C2B] text-xs font-semibold rounded-[10px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Pill className="h-3.5 w-3.5 text-[#FF8C69]" />
                <span>Rx Engine</span>
              </button>
              <button
                onClick={() => navigate('/app/chat')}
                className="px-3.5 py-1.5 bg-[#F7F7F5] border border-[#3A3A38]/20 hover:border-[#1A3C2B] text-[#1A3C2B] text-xs font-semibold rounded-[10px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5 text-[#5AE68E]" />
                <span>AI Health Assistant</span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center z-20 border-t border-[#3A3A38]/15 bg-white/60">
        <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">
          MediTrack AI Medical Portal • 256-Bit SSL Encrypted Session • HIPAA Compliant Infrastructure
        </p>
      </footer>
    </div>
  );
}
