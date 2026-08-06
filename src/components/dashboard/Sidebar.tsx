import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  BrainCircuit,
  MessageSquare,
  History,
  User,
  Settings,
  HeartHandshake,
  LogOut,
  X,
  ChevronLeft,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';

const publicNav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/upload', label: 'Upload Reports', icon: Upload },
  { to: '/app/ai-analysis', label: 'AI Analysis', icon: BrainCircuit },
  { to: '/app/history', label: 'Report History', icon: History },
  { to: '/app/chat', label: 'AI Health Assistant', icon: MessageSquare },
];

const accountNav = [
  { to: '/app/profile', label: 'Profile', icon: User },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#111827]/40 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 272 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 bg-white border-r border-[#3A3A38]/20 select-none shadow-xs"
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          profile={profile}
          onSignOut={handleSignOut}
        />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white border-r border-[#3A3A38]/20 flex flex-col select-none shadow-xl"
          >
            <SidebarContent
              collapsed={false}
              setCollapsed={setMobileOpen}
              profile={profile}
              onSignOut={handleSignOut}
              mobile
              onClose={() => setMobileOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  collapsed,
  setCollapsed,
  profile,
  onSignOut,
  mobile,
  onClose,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  profile: any;
  onSignOut: () => void;
  mobile?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Brand Header */}
      <div
        className={clsx(
          'h-18 flex items-center px-5 border-b border-[#3A3A38]/20 shrink-0 justify-between',
          collapsed && 'justify-center px-0'
        )}
      >
        {collapsed && !mobile ? (
          <div className="h-10 w-10 bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center rounded-[10px] border border-[#1A3C2B]">
            <HeartHandshake className="h-6 w-6" />
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-1">
            <div className="h-10 w-10 bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center rounded-[10px] shrink-0 border border-[#1A3C2B]">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <span className="font-['Space_Grotesk'] text-xl font-bold text-[#111827] tracking-tight">
              MEDITRACK <span className="text-[#1A3C2B]">AI</span>
            </span>
            {mobile && (
              <button onClick={onClose} className="ml-auto p-1 text-[#3A3A38] hover:text-[#111827]">
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-5 px-3.5 space-y-1.5 font-['Public_Sans']">
        {!collapsed && (
          <p className="px-3.5 py-2 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#3A3A38]">
            MY HEALTH PORTAL
          </p>
        )}
        {publicNav.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed && !mobile} />
        ))}

        {!collapsed && (
          <p className="px-3.5 py-2 mt-6 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#3A3A38]">
            ACCOUNT & PREFERENCES
          </p>
        )}
        {accountNav.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed && !mobile} />
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-3.5 border-t border-[#3A3A38]/20 shrink-0">
        <div
          className={clsx(
            'flex items-center gap-3 rounded-[12px] p-2.5 bg-[#F7F7F5] border border-[#3A3A38]/15',
            collapsed && 'justify-center p-2'
          )}
        >
          <div className="h-9 w-9 rounded-full bg-[#1A3C2B] text-white flex items-center justify-center text-sm font-bold shrink-0">
            {typeof profile?.full_name === 'string' && profile.full_name.trim().length > 0
              ? profile.full_name.trim()[0].toUpperCase()
              : 'U'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#111827] truncate font-['Space_Grotesk']">
                  {typeof profile?.full_name === 'string' && profile.full_name.trim().length > 0
                    ? profile.full_name
                    : 'User'}
                </div>
                <div className="text-[11px] font-['JetBrains_Mono'] text-[#1A3C2B] font-semibold">
                  PERSONAL ACCOUNT
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="p-1 text-[#3A3A38] hover:text-red-600 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      {!mobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-20 h-7 w-7 rounded-full bg-white border border-[#3A3A38]/30 flex items-center justify-center text-[#1A3C2B] hover:bg-[#F7F7F5] transition-colors z-40 cursor-pointer shadow-xs"
        >
          <ChevronLeft className={clsx('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      )}
    </>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  collapsed,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsed: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={to === '/app/dashboard'}
      className={({ isActive }) =>
        clsx(
          'relative flex items-center gap-3.5 px-3.5 py-3 rounded-[12px] text-sm sm:text-base font-semibold transition-colors group select-none',
          isActive
            ? 'bg-[#1A3C2B] text-white font-bold shadow-xs'
            : 'text-[#3A3A38] hover:bg-[#1A3C2B]/10 hover:text-[#1A3C2B]'
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
      {collapsed && (
        <span className="absolute left-full ml-3 px-3 py-1.5 rounded-[10px] bg-[#111827] text-white text-xs font-['Public_Sans'] font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
          {label}
        </span>
      )}
    </NavLink>
  );
}
