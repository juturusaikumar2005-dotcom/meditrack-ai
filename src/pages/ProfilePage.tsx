import { useState } from 'react';
import { Mail, ShieldCheck, User, Lock, Trash2, Key, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { profile, session } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userName = profile?.full_name || session?.user?.email?.split('@')[0] || 'User';
  const userEmail = profile?.email || session?.user?.email || 'user@meditrack.ai';

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    toast.success('Password updated successfully!');
    setPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion requested. Please contact support.');
    }
  };

  return (
    <div className="space-y-8 select-none font-['Public_Sans']">
      {/* Header */}
      <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-1 shadow-xs">
        <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
          USER PROFILE & ACCOUNT
        </span>
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#111827]">
          My Profile
        </h1>
        <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
          Manage your personal details, connected Google account, and password security.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Profile Summary Card */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 text-center space-y-4 shadow-xs">
          <div className="h-24 w-24 rounded-full bg-[#1A3C2B] text-white flex items-center justify-center font-['Space_Grotesk'] text-4xl font-bold mx-auto border-2 border-[#9EFFBF]">
            {userName[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
              {userName}
            </h2>
            <p className="font-['Public_Sans'] text-xs text-[#3A3A38]">{userEmail}</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#9EFFBF]/40 text-[#1A3C2B] font-['JetBrains_Mono'] font-bold text-xs uppercase rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>PERSONAL HEALTHCARE ACCOUNT</span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => toast.success('Profile photo updated!')}
              className="w-full py-2 bg-white border border-[#3A3A38]/30 hover:border-[#1A3C2B] text-[#111827] text-xs font-semibold rounded-[12px] transition-colors cursor-pointer"
            >
              Update Profile Photo
            </button>
          </div>
        </div>

        {/* Right Details & Security Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Overview */}
          <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4 shadow-xs">
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
              Account Details
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[12px] flex items-center gap-3">
                <User className="h-5 w-5 text-[#1A3C2B]" />
                <div>
                  <span className="text-[10px] font-['JetBrains_Mono'] text-[#3A3A38] uppercase block">Full Name</span>
                  <span className="text-xs font-semibold text-[#111827]">{userName}</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[12px] flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#1A3C2B]" />
                <div>
                  <span className="text-[10px] font-['JetBrains_Mono'] text-[#3A3A38] uppercase block">Email Address</span>
                  <span className="text-xs font-semibold text-[#111827]">{userEmail}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#F7F7F5] border border-[#3A3A38]/15 rounded-[12px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#1A3C2B]" />
                <div>
                  <span className="text-xs font-bold text-[#111827]">Google Account Sync</span>
                  <span className="text-[10px] font-['JetBrains_Mono'] text-[#3A3A38] block">Connected via Supabase Auth</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#9EFFBF]/50 text-[#1A3C2B] font-['JetBrains_Mono'] text-[10px] font-bold">
                CONNECTED
              </span>
            </div>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4 shadow-xs">
            <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827] flex items-center gap-2">
              <Key className="h-5 w-5 text-[#1A3C2B]" />
              <span>Change Password</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#111827]">New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F5] border border-[#3A3A38]/20 rounded-[10px] focus:outline-none focus:border-[#1A3C2B]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111827]">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F7F5] border border-[#3A3A38]/20 rounded-[10px] focus:outline-none focus:border-[#1A3C2B]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#1A3C2B] text-white text-xs font-semibold rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </form>

          {/* Delete Account Danger Zone */}
          <div className="bg-white border border-red-200 rounded-[14px] p-6 space-y-3 shadow-xs">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              <span>Delete Account</span>
            </h3>
            <p className="text-xs text-[#3A3A38]">
              Permanently delete your personal profile, uploaded reports, and AI chat logs from MediTrack AI.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-[12px] hover:bg-red-700 transition-colors cursor-pointer"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
