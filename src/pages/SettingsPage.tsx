import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Languages, Wifi, Keyboard, HelpCircle, Globe, MessageSquare, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [notif, setNotif] = useState({ alerts: true, reports: true, appointments: true, tips: true });
  const [language, setLanguage] = useState('English');
  const [offline, setOffline] = useState(true);

  return (
    <div className="space-y-8 select-none font-['Public_Sans']">
      {/* Header */}
      <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-1">
        <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
          PLATFORM PREFERENCES
        </span>
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#111827]">
          Platform Settings
        </h1>
        <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
          Configure notification alerts, language options, offline caching, and platform shortcuts.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Notifications Settings Card */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#3A3A38]/15">
            <div className="h-9 w-9 rounded-[10px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">Health Alerts & Notifications</h3>
              <p className="text-xs text-[#3A3A38]">Manage your diagnostic notification preferences</p>
            </div>
          </div>
          <div className="space-y-1">
            <Toggle label="Critical Biomarker Alerts" checked={notif.alerts} onChange={(v) => setNotif((n) => ({ ...n, alerts: v }))} />
            <Toggle label="Lab Analysis Summaries" checked={notif.reports} onChange={(v) => setNotif((n) => ({ ...n, reports: v }))} />
            <Toggle label="Specialist Appointment Reminders" checked={notif.appointments} onChange={(v) => setNotif((n) => ({ ...n, appointments: v }))} />
            <Toggle label="Personalized Health Tips" checked={notif.tips} onChange={(v) => setNotif((n) => ({ ...n, tips: v }))} />
          </div>
        </div>

        {/* Language Selection Card */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4">
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
              toast.success(`Language set to ${e.target.value}`, {
                style: { borderRadius: '12px', background: '#1A3C2B', color: '#FFFFFF' },
              });
            }}
            className="w-full h-11 rounded-[12px] bg-[#F7F7F5] border border-[#3A3A38]/20 px-4 text-xs sm:text-sm text-[#111827] outline-none focus:border-[#1A3C2B] font-['Public_Sans']"
          >
            {['English', 'Spanish', 'French', 'German', 'Hindi', 'Arabic', 'Chinese'].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Offline Mode Card */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#3A3A38]/15">
            <div className="h-9 w-9 rounded-[10px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center">
              <Wifi className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">Offline Health Caching</h3>
              <p className="text-xs text-[#3A3A38]">Cache diagnostic records for offline viewing</p>
            </div>
          </div>
          <Toggle label="Enable offline cache" checked={offline} onChange={setOffline} />
          <p className="text-xs text-[#3A3A38]">
            When enabled, your recent lab reports and timeline metrics are cached encrypted on your device.
          </p>
        </div>

        {/* Keyboard Shortcuts Card */}
        <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#3A3A38]/15">
            <div className="h-9 w-9 rounded-[10px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center">
              <Keyboard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#111827]">Platform Shortcuts</h3>
              <p className="text-xs text-[#3A3A38]">Quick navigation key combinations</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            {[
              ['Command palette search', '⌘ K'],
              ['Upload new report', '⌘ U'],
              ['Launch AI Assistant', '⌘ Shift A'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-2 border-b border-[#3A3A38]/10 last:border-0">
                <span className="text-[#111827] font-semibold">{k}</span>
                <kbd className="text-[10px] bg-[#F7F7F5] border border-[#3A3A38]/20 px-2 py-0.5 rounded-[10px] font-['JetBrains_Mono'] text-[#3A3A38]">
                  {v}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="w-full flex items-center justify-between py-2.5 cursor-pointer">
      <span className="text-xs font-semibold text-[#111827] font-['Public_Sans']">{label}</span>
      <span className={`relative h-5 w-10 rounded-full transition-colors ${checked ? 'bg-[#1A3C2B]' : 'bg-slate-300'}`}>
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-none ${checked ? 'left-[1.3rem]' : 'left-0.5'}`}
        />
      </span>
    </button>
  );
}
