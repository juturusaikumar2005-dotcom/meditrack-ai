import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, Command, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CommandPalette } from './CommandPalette';

const seedNotifications = [
  { id: 'n-1', title: 'Blood Panel Analyzed', message: 'Ferritin level flagged at 14 ng/mL (Low bound).', time: '10m ago', read: false },
  { id: 'n-2', title: 'Specialist Match Ready', message: 'Dr. Sarah Jenkins (Hematologist) available tomorrow.', time: '1h ago', read: false },
  { id: 'n-3', title: 'Report Backup Complete', message: '256-bit encrypted archival of 4 diagnostic files.', time: '1d ago', read: true },
];

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifs, setNotifs] = useState(seedNotifications);
  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));

  return (
    <>
      <header className="sticky top-0 z-20 h-18 px-4 sm:px-6 flex items-center gap-3 bg-white/92 backdrop-blur-md border-b border-[#3A3A38]/20 shadow-xs select-none">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-[10px] text-[#1A3C2B] hover:bg-[#1A3C2B]/10 transition-colors"
          aria-label="Toggle Sidebar Menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Global Search Bar */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2.5 h-11 px-4 rounded-[12px] bg-[#F7F7F5]/90 border border-[#3A3A38]/20 text-sm font-['Public_Sans'] text-[#3A3A38] hover:border-[#1A3C2B] transition-colors w-full max-w-md cursor-pointer shadow-xs"
        >
          <Search className="h-4 w-4 text-[#1A3C2B]" />
          <span className="flex-1 text-left text-sm sm:text-base">Search reports, lab values, or specialists…</span>
          <kbd className="hidden sm:flex items-center gap-0.5 text-xs font-['JetBrains_Mono'] bg-white px-2 py-0.5 rounded-[8px] border border-[#3A3A38]/20 text-[#3A3A38]">
            <Command className="h-3.5 w-3.5" />K
          </kbd>
        </button>

        <div className="flex-1" />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-[10px] hover:bg-[#F7F7F5] border border-transparent hover:border-[#3A3A38]/20 transition-colors relative text-[#1A3C2B]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#FF8C69]" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  className="absolute right-0 top-12 z-40 w-80 sm:w-96 bg-white border border-[#3A3A38]/20 rounded-[10px] shadow-xl overflow-hidden"
                >
                  <div className="p-3.5 bg-[#F7F7F5] border-b border-[#3A3A38]/15 flex items-center justify-between font-['Space_Grotesk'] font-bold text-sm text-[#111827]">
                    <span>Health Notifications</span>
                    <button
                      onClick={markAllRead}
                      className="text-xs font-['Public_Sans'] text-[#1A3C2B] hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#3A3A38]/10 font-['Public_Sans'] text-xs">
                    {notifs.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 hover:bg-[#F7F7F5] transition-colors ${
                          !n.read ? 'bg-[#9EFFBF]/10' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-[#1A3C2B] shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#111827]">{n.title}</p>
                            <p className="text-[#3A3A38] text-xs mt-0.5">{n.message}</p>
                            <p className="text-[10px] font-['JetBrains_Mono'] text-[#3A3A38] mt-1">
                              {n.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar Pill */}
        <div className="h-8 w-8 rounded-full bg-[#1A3C2B] text-white font-['Space_Grotesk'] text-xs font-bold flex items-center justify-center shrink-0">
          {profile?.full_name?.[0]?.toUpperCase() ?? 'M'}
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
