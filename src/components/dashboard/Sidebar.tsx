import { useState, useCallback, useRef, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
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
  Pill,
  TrendingUp,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { SignOutModal } from '@/components/auth/SignOutModal';

/* ─────────────────────────────────────────────
   Navigation Items
   ───────────────────────────────────────────── */
const publicNav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/upload', label: 'Upload Reports', icon: Upload },
  { to: '/app/prescription', label: 'Rx Engine', icon: Pill },
  { to: '/app/ai-analysis', label: 'AI Analysis', icon: BrainCircuit },
  { to: '/app/history', label: 'Report History', icon: History },
  { to: '/app/timeline', label: 'Health Timeline', icon: TrendingUp },
  { to: '/app/chat', label: 'AI Health Assistant', icon: MessageSquare },
];

const accountNav = [
  { to: '/app/profile', label: 'Profile', icon: User },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

/* ─────────────────────────────────────────────
   Cascade stagger variants for sidebar open/close
   ───────────────────────────────────────────── */
const cascadeContainer: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.04,
    },
  },
  hidden: {
    transition: {
      staggerChildren: 0.018,
      staggerDirection: -1,
    },
  },
};

const cascadeItem: Variants = {
  hidden: {
    opacity: 0,
    x: -12,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cascadeItemReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

/* ─────────────────────────────────────────────
   Main Sidebar Shell
   ───────────────────────────────────────────── */
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
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleConfirmSignOut = async () => {
    setSigningOut(true);
    await signOut();
    window.location.href = '/';
  };

  return (
    <>
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleConfirmSignOut}
        loading={signingOut}
      />

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-[#111827]/40 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 272 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 bg-white border-r border-[#3A3A38]/20 select-none shadow-xs"
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          profile={profile}
          onSignOut={() => setShowSignOutModal(true)}
        />
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white border-r border-[#3A3A38]/20 flex flex-col select-none shadow-xl"
          >
            <SidebarContent
              collapsed={false}
              setCollapsed={setMobileOpen}
              profile={profile}
              onSignOut={() => setShowSignOutModal(true)}
              mobile
              onClose={() => setMobileOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────────
   Sidebar Inner Content
   ───────────────────────────────────────────── */
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
  const prefersReduced = useReducedMotion();
  const itemVariant = prefersReduced ? cascadeItemReduced : cascadeItem;
  const isExpanded = !collapsed || !!mobile;

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
          <NavLink to="/app/dashboard" className="h-10 w-10 bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center rounded-[10px] border border-[#1A3C2B] hover:scale-105 transition-transform">
            <HeartHandshake className="h-6 w-6" />
          </NavLink>
        ) : (
          <div className="flex items-center justify-between flex-1">
            <NavLink to="/app/dashboard" className="flex items-center gap-3 group cursor-pointer">
              <div className="h-10 w-10 bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center rounded-[10px] shrink-0 border border-[#1A3C2B] group-hover:scale-105 transition-transform">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <span className="font-['Space_Grotesk'] text-xl font-bold text-[#111827] tracking-tight group-hover:text-[#1A3C2B] transition-colors">
                MEDITRACK
              </span>
            </NavLink>
            {mobile && (
              <button onClick={onClose} className="ml-auto p-1 text-[#3A3A38] hover:text-[#111827]">
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <LayoutGroup id="sidebar-nav">
        <nav className="flex-1 overflow-y-auto no-scrollbar py-5 px-3.5 space-y-1.5 font-['Public_Sans']">
          <motion.div
            variants={cascadeContainer}
            initial="hidden"
            animate="visible"
            key={`nav-${collapsed}`}
          >
            {isExpanded && (
              <motion.p
                variants={itemVariant}
                className="px-3.5 py-2 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#3A3A38]"
              >
                MY HEALTH PORTAL
              </motion.p>
            )}
            {publicNav.map((item, i) => (
              <motion.div variants={itemVariant} key={item.to}>
                <NavItem {...item} collapsed={collapsed && !mobile} index={i} />
              </motion.div>
            ))}

            {isExpanded && (
              <motion.p
                variants={itemVariant}
                className="px-3.5 py-2 mt-6 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#3A3A38]"
              >
                ACCOUNT & PREFERENCES
              </motion.p>
            )}
            {accountNav.map((item, i) => (
              <motion.div variants={itemVariant} key={item.to}>
                <NavItem {...item} collapsed={collapsed && !mobile} index={publicNav.length + i} />
              </motion.div>
            ))}
          </motion.div>
        </nav>
      </LayoutGroup>

      {/* Collapse Toggle */}
      {!mobile && (
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-20 h-7 w-7 rounded-full bg-white border border-[#3A3A38]/30 flex items-center justify-center text-[#1A3C2B] hover:bg-[#F7F7F5] transition-colors z-40 cursor-pointer shadow-xs"
          whileHover={{ scale: 1.12, boxShadow: '0 2px 12px rgba(26,60,43,0.15)' }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </motion.button>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Individual Nav Item — premium motion
   ───────────────────────────────────────────── */
function NavItem({
  to,
  label,
  icon: Icon,
  collapsed,
  index,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsed: boolean;
  index: number;
}) {
  const location = useLocation();
  const prefersReduced = useReducedMotion();
  const itemRef = useRef<HTMLDivElement>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const isActive = to === '/app/dashboard'
    ? location.pathname === to
    : location.pathname.startsWith(to);

  /* ── Click ripple handler ── */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (prefersReduced) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipple({ x, y });
      setTimeout(() => setRipple(null), 500);
    },
    [prefersReduced]
  );

  /* ── Memoized spring configs ── */
  const hoverTransition = useMemo(
    () => ({ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] as const }),
    []
  );
  const tapTransition = useMemo(
    () => ({ duration: 0.12, ease: 'easeOut' as const }),
    []
  );

  return (
    <motion.div
      ref={itemRef}
      whileHover={
        prefersReduced
          ? undefined
          : {
              y: -2,
              transition: hoverTransition,
            }
      }
      whileTap={
        prefersReduced
          ? undefined
          : {
              scale: 0.97,
              transition: tapTransition,
            }
      }
    >
      <NavLink
        to={to}
        end={to === '/app/dashboard'}
        onClick={handleClick}
        className={clsx(
          'relative flex items-center gap-3.5 px-3.5 py-3 rounded-[12px] text-sm sm:text-base font-semibold transition-colors group select-none overflow-hidden',
          isActive
            ? 'text-white font-bold'
            : 'text-[#3A3A38] hover:text-[#1A3C2B]'
        )}
      >
        {/* ── Active pill with shared layout animation ── */}
        {isActive && (
          <motion.div
            layoutId="active-sidebar-pill"
            className="absolute inset-0 bg-[#1A3C2B] rounded-[12px] z-0"
            style={{
              boxShadow: '0 1px 3px rgba(26,60,43,0.2), 0 0 20px rgba(158,255,191,0.08)',
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 32,
              mass: 0.8,
            }}
          />
        )}

        {/* ── Active left accent bar ── */}
        {isActive && (
          <motion.div
            layoutId="active-sidebar-accent"
            className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-full z-10"
            style={{
              background: 'linear-gradient(180deg, #9EFFBF 0%, #5AE68E 100%)',
              boxShadow: '0 0 8px rgba(158,255,191,0.5)',
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 32,
              mass: 0.8,
            }}
          />
        )}

        {/* ── Hover background glow (non-active items) ── */}
        {!isActive && (
          <motion.div
            className="absolute inset-0 rounded-[12px] z-0 opacity-0 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(26,60,43,0.07) 0%, transparent 70%)',
            }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          />
        )}

        {/* ── Hover glass highlight (non-active items) ── */}
        {!isActive && (
          <div
            className="absolute inset-0 rounded-[12px] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[220ms]"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 50%)',
            }}
          />
        )}

        {/* ── Active radial glow background ── */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-[12px] z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(158,255,191,0.6) 0%, transparent 60%)',
              filter: 'blur(12px)',
            }}
            transition={{ duration: 0.45 }}
          />
        )}

        {/* ── Click ripple ── */}
        <AnimatePresence>
          {ripple && (
            <motion.span
              initial={{ scale: 0, opacity: 0.35 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute z-[1] rounded-full pointer-events-none"
              style={{
                left: ripple.x - 20,
                top: ripple.y - 20,
                width: 40,
                height: 40,
                background: isActive
                  ? 'rgba(158,255,191,0.3)'
                  : 'rgba(26,60,43,0.12)',
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Icon ── */}
        <motion.div
          className="shrink-0 z-10"
          whileHover={
            prefersReduced
              ? undefined
              : {
                  scale: 1.08,
                  rotate: 3,
                  transition: { duration: 0.18, ease: 'easeOut' },
                }
          }
          whileTap={
            prefersReduced
              ? undefined
              : {
                  scale: 0.9,
                  transition: { type: 'spring', stiffness: 500, damping: 15 },
                }
          }
        >
          <Icon className="h-5 w-5" />
        </motion.div>

        {/* ── Label text ── */}
        {!collapsed && (
          <motion.span
            className="z-10 relative"
            initial={false}
            animate={
              isActive
                ? { opacity: 1, x: 0 }
                : { opacity: 0.95, x: 0 }
            }
            whileHover={
              prefersReduced
                ? undefined
                : { x: 2, opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } }
            }
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {label}
          </motion.span>
        )}

        {/* ── Collapsed tooltip ── */}
        {collapsed && (
          <span className="absolute left-full ml-3 px-3 py-1.5 rounded-[10px] bg-[#111827] text-white text-xs font-['Public_Sans'] font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
            {label}
          </span>
        )}

        {/* ── Hover shadow layer (non-active) ── */}
        {!isActive && (
          <div
            className="absolute inset-0 rounded-[12px] z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-[220ms]"
            style={{
              boxShadow: '0 1px 8px rgba(26,60,43,0.08)',
            }}
          />
        )}
      </NavLink>
    </motion.div>
  );
}
