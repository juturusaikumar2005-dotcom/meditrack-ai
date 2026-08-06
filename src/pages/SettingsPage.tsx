import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Languages, ShieldCheck, Sun, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { profile, session, signOut } = useAuth();
  const navigate = useNavigate();

  const [language, setLanguage] = useState('English');
  const userEmail = profile?.email || session?.user?.email || 'user@meditrack.ai';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="space-y-8 select-none font-['Public_Sans']">
      {/* Header */}
      <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-1 shadow-xs">
        <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
          SYSTEM PREFERENCES
        </span>
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#111827]">
          Platform Settings
        </h1>
        <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
          Configure theme mode, language preferences, account overview, and privacy controls.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 1. Theme Preferences */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-[#3A3A38]/15">
            <div className="h-9 w-9 rounded-[10px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">Interface Theme</h3>
              <p className="text-xs text-[#3A3A38]">Theme appearance for MediTrack AI</p>
            </div>
          </div>
          <div className="p-3 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[12px] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#111827]">Active Theme Mode</span>
            <span className="font-['JetBrains_Mono'] font-bold text-[#1A3C2B] bg-[#9EFFBF]/50 px-2.5 py-0.5 rounded-full">
              PAPER TONE (#F7F7F5)
            </span>
          </div>
        </div>

        {/* 2. Language Selection */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-[#3A3A38]/15">
            <div className="h-9 w-9 rounded-[10px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">Language & Locale</h3>
              <p className="text-xs text-[#3A3A38]">Multi-language clinical translation support</p>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              toast.success(`Language set to ${e.target.value}`);
            }}
            className="w-full h-11 rounded-[12px] bg-[#F7F7F5] border border-[#3A3A38]/20 px-4 text-xs text-[#111827] outline-none focus:border-[#1A3C2B]"
          >
            {['English', 'Spanish', 'French', 'German', 'Hindi', 'Arabic'].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* 3. Account Information */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-[#3A3A38]/15">
            <div className="h-9 w-9 rounded-[10px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">Account Information</h3>
              <p className="text-xs text-[#3A3A38]">Active user session details</p>
            </div>
          </div>
          <div className="p-3 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[12px] text-xs space-y-1">
            <p className="font-bold text-[#111827]">Signed in as: {userEmail}</p>
            <p className="text-[#3A3A38] font-['JetBrains_Mono'] text-[10px]">Session Status: Authenticated</p>
          </div>
        </div>

        {/* 4. Privacy & Sign Out */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#3A3A38]/15">
              <div className="h-9 w-9 rounded-[10px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">Privacy & Security</h3>
                <p className="text-xs text-[#3A3A38]">Data encryption & session management</p>
              </div>
            </div>
            <p className="text-xs text-[#3A3A38] leading-relaxed">
              Your health data is encrypted using 256-bit AES standards. You maintain 100% control over your uploaded diagnostic files and chat logs.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full py-2.5 bg-red-50 text-red-600 border border-red-200 font-bold text-xs rounded-[12px] hover:bg-red-100 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
