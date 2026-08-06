import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Command, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CommandPalette } from './CommandPalette';
import { SignOutModal } from '@/components/auth/SignOutModal';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile, session, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

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

  const handleConfirmSignOut = async () => {
    setSignOutLoading(true);
    try {
      await signOut();
      setSignOutModalOpen(false);
      setMenuOpen(false);
      navigate('/signin', { replace: true });
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setSignOutLoading(false);
    }
  };

  const userInitial = (
    profile?.full_name?.[0] ||
    session?.user?.email?.[0] ||
    'U'
  ).toUpperCase();

  const userName = profile?.full_name || 'Patient Account';
  const userEmail = session?.user?.email || profile?.email || 'patient@meditrack.ai';

  return (
    <>
      <header className="sticky top-0 z-30 h-18 px-4 sm:px-6 flex items-center gap-3 bg-white border-b border-[#3A3A38]/20 shadow-xs select-none">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-[10px] text-[#1A3C2B] hover:bg-[#1A3C2B]/10 transition-colors cursor-pointer"
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

        {/* User Account Avatar & Dropdown Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-10 w-10 rounded-full bg-[#1A3C2B] text-[#9EFFBF] font-['Space_Grotesk'] text-base font-bold flex items-center justify-center shrink-0 border-2 border-[#1A3C2B] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs ring-2 ring-emerald-50"
            aria-label="User Account Menu"
          >
            {userInitial}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                {/* Backdrop to close menu on outside click */}
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />

                {/* Account Dropdown Card */}
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 top-13 z-40 w-72 bg-white border border-[#3A3A38]/20 rounded-[16px] shadow-xl overflow-hidden font-['Public_Sans'] select-none"
                >
                  {/* Account Header */}
                  <div className="p-4 bg-[#F7F7F5] border-b border-[#3A3A38]/15 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#1A3C2B] text-[#9EFFBF] font-['Space_Grotesk'] font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                      {userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-['Space_Grotesk'] text-sm font-bold text-[#111827] truncate">
                        {userName}
                      </h4>
                      <p className="text-xs text-[#3A3A38] truncate">{userEmail}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 space-y-1 text-sm text-[#111827]">
                    <Link
                      to="/app/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] hover:bg-[#1A3C2B]/10 hover:text-[#1A3C2B] font-medium transition-colors cursor-pointer"
                    >
                      <User className="h-4 w-4 text-[#1A3C2B]" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/app/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] hover:bg-[#1A3C2B]/10 hover:text-[#1A3C2B] font-medium transition-colors cursor-pointer"
                    >
                      <Settings className="h-4 w-4 text-[#1A3C2B]" />
                      <span>Account Settings</span>
                    </Link>

                    <div className="my-1 border-t border-[#3A3A38]/15" />

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setSignOutModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-red-600 hover:bg-red-50 font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-red-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <SignOutModal
        isOpen={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={handleConfirmSignOut}
        loading={signOutLoading}
      />
    </>
  );
}
