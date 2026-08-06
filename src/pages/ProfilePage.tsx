import { motion } from 'framer-motion';
import { Mail, Phone, ShieldCheck, User, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { profile } = useAuth();

  return (
    <div className="space-y-8 select-none font-['Public_Sans']">
      {/* Header */}
      <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-1">
        <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
          USER MANAGEMENT
        </span>
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#111827]">
          My Profile & Account
        </h1>
        <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
          Manage your personal healthcare profile, contact preferences, and security settings.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Profile Summary Card */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-[#1A3C2B] text-white flex items-center justify-center font-['Space_Grotesk'] text-4xl font-bold mx-auto border border-[#1A3C2B]">
            {profile?.full_name?.[0]?.toUpperCase() ?? 'M'}
          </div>
          <div>
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
              {profile?.full_name ?? 'Marcus Vance'}
            </h2>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">{profile?.email ?? 'marcus.vance@example.com'}</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#9EFFBF]/40 text-[#1A3C2B] font-['JetBrains_Mono'] font-bold text-xs uppercase rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>PUBLIC HEALTHCARE ACCOUNT</span>
          </div>
          <div className="pt-2">
            <button
              onClick={() => toast('Profile photo upload placeholder')}
              className="w-full py-2 bg-white border border-[#3A3A38]/30 hover:border-[#1A3C2B] text-[#111827] text-xs font-semibold rounded-[12px] transition-colors cursor-pointer"
            >
              Update Profile Photo
            </button>
          </div>
        </div>

        {/* Right Personal Details Form Card */}
        <div className="lg:col-span-2 bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-6">
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
            Personal Account Details
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoItem icon={User} label="Full Name" value={profile?.full_name ?? 'Marcus Vance'} />
            <InfoItem icon={Mail} label="Email Address" value={profile?.email ?? 'marcus.vance@example.com'} />
            <InfoItem icon={Phone} label="Phone Number" value="+1 (555) 234-5678" />
            <InfoItem icon={Calendar} label="Member Since" value="January 2026" />
          </div>

          <div className="p-4 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[12px] text-xs text-[#3A3A38] flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[#1A3C2B] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#111827] font-['Space_Grotesk']">HIPAA Compliant Data Protection</p>
              <p className="mt-0.5">
                Your medical files and chat logs are stored with 256-bit AES encryption. You maintain 100% control over your diagnostic data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-[2px] bg-[#F7F7F5] border border-[#3A3A38]/15">
      <div className="p-2 bg-white rounded-[2px] border border-[#3A3A38]/15 text-[#1A3C2B] shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <span className="text-[10px] font-['JetBrains_Mono'] text-[#3A3A38] uppercase block">{label}</span>
        <span className="text-xs font-semibold text-[#111827] font-['Public_Sans'] truncate block">{value}</span>
      </div>
    </div>
  );
}
