import { useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
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
  X,
  ChevronLeft,
  Pill,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SignOutModal } from '@/components/auth/SignOutModal';

// ────────────────────────────────────────────────────────────────
// NAV DATA
// ────────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────────
// SPRING CONFIGS
// ────────────────────────────────────────────────────────────────
const SPRING = { type: 'spring' as const, stiffness: 300, damping: 25, mass: 0.7 };
const SPRING_TIGHT = { type: 'spring' as const, stiffness: 400, damping: 28, mass: 0.6 };
const SPRING_PILL = { type: 'spring' as const, stiffness: 350, damping: 30, mass: 0.8 };

// ────────────────────────────────────────────────────────────────
// CASCADE VARIANTS – sidebar items enter/exit one by one
// ────────────────────────────────────────────────────────────────
const cascadeParent: Variants = {
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  hide: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const cascadeChild: Variants = {
  hide: { opacity: 0, x: -25, scale: 0.95, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { ...SPRING, duration: 0.4 },
  },
};

const cascadeChildReduced: Variants = {
  hide: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.12 } },
};

// ────────────────────────────────────────────────────────────────
// SIDEBAR SHELL
// ────────────────────────────────────────────────────────────────
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
    <MotionConfig reducedMotion="user">
      <>
        <SignOutModal
          isOpen={showSignOutModal}
          onClose={() => setShowSignOutModal(false)}
          onConfirm={handleConfirmSignOut}
          loading={signingOut}
        />

        {/* ── Mobile Backdrop ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-[#111827]/40 backdrop-blur-xs lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Desktop Sidebar ── */}
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 80 : 272 }}
          transition={SPRING}
          className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 bg-white border-r border-[#3A3A38]/20 select-none shadow-xs"
          style={{ willChange: 'width' }}
        >
          <SidebarInner
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            profile={profile}
            onSignOut={() => setShowSignOutModal(true)}
          />
        </motion.aside>

        {/* ── Mobile Sidebar ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={SPRING}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white border-r border-[#3A3A38]/20 flex flex-col select-none shadow-xl"
            >
              <SidebarInner
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
    </MotionConfig>
  );
}

// ────────────────────────────────────────────────────────────────
// SIDEBAR INNER CONTENT
// ────────────────────────────────────────────────────────────────
function SidebarInner({
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
  const reduced = useReducedMotion();
  const showLabels = !collapsed || !!mobile;
  const childVariant = reduced ? cascadeChildReduced : cascadeChild;

  return (
    <>
      {/* ── Brand Header ── */}
      <motion.div
        className="h-18 flex items-center border-b border-[#3A3A38]/20 shrink-0"
        style={{ paddingLeft: collapsed && !mobile ? 0 : 20, paddingRight: collapsed && !mobile ? 0 : 20, justifyContent: collapsed && !mobile ? 'center' : 'space-between' }}
      >
        {collapsed && !mobile ? (
          <motion.a
            href="/app/dashboard"
            className="h-10 w-10 bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center rounded-[10px] border border-[#1A3C2B] cursor-pointer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={SPRING_TIGHT}
          >
            <HeartHandshake className="h-6 w-6" />
          </motion.a>
        ) : (
          <div className="flex items-center justify-between flex-1">
            <motion.a
              href="/app/dashboard"
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING_TIGHT}
            >
              <div className="h-10 w-10 bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center rounded-[10px] shrink-0 border border-[#1A3C2B]">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <span className="font-['Space_Grotesk'] text-xl font-bold text-[#111827] tracking-tight">
                MEDITRACK
              </span>
            </motion.a>
            {mobile && (
              <motion.button
                onClick={onClose}
                className="ml-auto p-1 text-[#3A3A38] cursor-pointer"
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.85 }}
                transition={SPRING_TIGHT}
              >
                <X className="h-6 w-6" />
              </motion.button>
            )}
          </div>
        )}
      </motion.div>

      {/* ── Navigation ── */}
      <LayoutGroup id="sidebar-nav">
        <nav className="flex-1 overflow-y-auto no-scrollbar py-5 px-3.5 font-['Public_Sans']">
          <motion.div
            variants={cascadeParent}
            initial="hide"
            animate="show"
            key={`cascade-${collapsed}-${mobile}`}
            className="space-y-1.5"
          >
            {/* Section Label */}
            {showLabels && (
              <motion.p
                variants={childVariant}
                className="px-3.5 py-2 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#3A3A38]"
              >
                MY HEALTH PORTAL
              </motion.p>
            )}

            {/* Public Nav Items */}
            {publicNav.map((item) => (
              <motion.div variants={childVariant} key={item.to}>
                <SidebarButton {...item} collapsed={collapsed && !mobile} />
              </motion.div>
            ))}

            {/* Account Section Label */}
            {showLabels && (
              <motion.p
                variants={childVariant}
                className="px-3.5 py-2 mt-6 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#3A3A38]"
              >
                ACCOUNT & PREFERENCES
              </motion.p>
            )}

            {/* Account Nav Items */}
            {accountNav.map((item) => (
              <motion.div variants={childVariant} key={item.to}>
                <SidebarButton {...item} collapsed={collapsed && !mobile} />
              </motion.div>
            ))}
          </motion.div>
        </nav>
      </LayoutGroup>

      {/* ── Collapse Toggle ── */}
      {!mobile && (
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-20 h-7 w-7 rounded-full bg-white border border-[#3A3A38]/30 flex items-center justify-center text-[#1A3C2B] z-40 cursor-pointer shadow-xs"
          whileHover={{
            scale: 1.18,
            boxShadow: '0 4px 16px rgba(26,60,43,0.18)',
          }}
          whileTap={{ scale: 0.88 }}
          transition={SPRING_TIGHT}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={SPRING}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </motion.button>
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// INDIVIDUAL SIDEBAR BUTTON — 100% Framer Motion, zero CSS animation
// ────────────────────────────────────────────────────────────────
function SidebarButton({
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
  const navigate = useNavigate();
  const location = useLocation();
  const reduced = useReducedMotion();
  const btnRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const isActive = to === '/app/dashboard'
    ? location.pathname === to
    : location.pathname.startsWith(to);

  // ── Handle click with ripple ──
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!reduced && btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
        setTimeout(() => setRipple(null), 600);
      }
      // Navigate after a tiny delay for the click animation to register
      setTimeout(() => navigate(to), 80);
    },
    [to, navigate, reduced]
  );

  return (
    <motion.div
      ref={btnRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(to); } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex items-center gap-3.5 px-3.5 py-3 rounded-[12px] text-sm sm:text-base font-semibold select-none cursor-pointer overflow-hidden"
      style={{ color: isActive ? '#ffffff' : '#3A3A38', fontWeight: isActive ? 700 : 600 }}
      // ── HOVER: lift + scale + translateX ──
      whileHover={
        reduced
          ? undefined
          : {
              scale: 1.04,
              x: 8,
              transition: { ...SPRING, duration: 0.28 },
            }
      }
      // ── CLICK: spring depress ──
      whileTap={
        reduced
          ? undefined
          : {
              scale: 0.94,
              transition: { type: 'spring', stiffness: 500, damping: 20, mass: 0.5 },
            }
      }
      // ── FOCUS: animated ring ──
      whileFocus={{
        boxShadow: '0 0 0 2px rgba(158,255,191,0.6)',
        transition: { duration: 0.15 },
      }}
      transition={SPRING}
    >
      {/* ═══════ LAYER 1: Shared layout active pill ═══════ */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute inset-0 rounded-[12px]"
          style={{
            backgroundColor: '#1A3C2B',
            boxShadow: '0 2px 8px rgba(26,60,43,0.25), 0 0 24px rgba(158,255,191,0.06)',
          }}
          transition={SPRING_PILL}
        />
      )}

      {/* ═══════ LAYER 2: Active left accent bar ═══════ */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-accent"
          className="absolute left-0 rounded-full"
          style={{
            top: '18%',
            bottom: '18%',
            width: 3,
            background: 'linear-gradient(180deg, #9EFFBF 0%, #5AE68E 100%)',
            boxShadow: '0 0 10px rgba(158,255,191,0.6)',
          }}
          transition={SPRING_PILL}
        />
      )}

      {/* ═══════ LAYER 3: Active radial glow ═══════ */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="active-glow"
            className="absolute inset-0 rounded-[12px] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              background: 'radial-gradient(ellipse at 25% 50%, rgba(158,255,191,0.2) 0%, transparent 65%)',
              filter: 'blur(12px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ═══════ LAYER 4: Hover background glow ═══════ */}
      <AnimatePresence>
        {isHovered && !isActive && (
          <motion.div
            key="hover-glow"
            className="absolute inset-0 rounded-[12px] pointer-events-none"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ...SPRING, duration: 0.28 }}
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(26,60,43,0.08) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ═══════ LAYER 5: Hover glass highlight ═══════ */}
      <AnimatePresence>
        {isHovered && !isActive && (
          <motion.div
            key="hover-glass"
            className="absolute inset-0 rounded-[12px] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 50%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ═══════ LAYER 6: Hover shadow ═══════ */}
      <motion.div
        className="absolute inset-0 rounded-[12px] pointer-events-none"
        animate={{
          boxShadow: isHovered && !isActive
            ? '0 2px 12px rgba(26,60,43,0.1)'
            : '0 0px 0px rgba(26,60,43,0)',
        }}
        transition={{ duration: 0.28 }}
      />

      {/* ═══════ LAYER 7: Click ripple ═══════ */}
      <AnimatePresence>
        {ripple && (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              left: ripple.x - 24,
              top: ripple.y - 24,
              width: 48,
              height: 48,
              background: isActive ? 'rgba(158,255,191,0.35)' : 'rgba(26,60,43,0.15)',
              zIndex: 1,
            }}
          />
        )}
      </AnimatePresence>

      {/* ═══════ ICON ═══════ */}
      <motion.div
        className="shrink-0 relative"
        style={{ zIndex: 10 }}
        animate={{
          scale: isHovered && !reduced ? 1.15 : 1,
          rotate: isHovered && !reduced ? 6 : 0,
          filter: isHovered && !reduced ? 'brightness(1.15)' : 'brightness(1)',
        }}
        whileTap={
          reduced
            ? undefined
            : { scale: 0.85, transition: { type: 'spring', stiffness: 600, damping: 12 } }
        }
        transition={SPRING_TIGHT}
      >
        <Icon className="h-5 w-5" />
      </motion.div>

      {/* ═══════ LABEL TEXT ═══════ */}
      {!collapsed && (
        <motion.span
          className="relative"
          style={{ zIndex: 10 }}
          animate={{
            x: isHovered && !reduced ? 6 : 0,
            opacity: isActive ? 1 : isHovered ? 1 : 0.92,
            filter: isActive ? 'blur(0px)' : 'blur(0px)',
          }}
          transition={{ ...SPRING, duration: 0.28 }}
        >
          {label}
        </motion.span>
      )}

      {/* ═══════ COLLAPSED TOOLTIP ═══════ */}
      <AnimatePresence>
        {collapsed && isHovered && (
          <motion.span
            key="tooltip"
            initial={{ opacity: 0, x: -4, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -4, scale: 0.95 }}
            transition={{ ...SPRING_TIGHT, duration: 0.18 }}
            className="absolute left-full ml-3 px-3 py-1.5 rounded-[10px] bg-[#111827] text-white text-xs font-['Public_Sans'] font-semibold pointer-events-none whitespace-nowrap shadow-md"
            style={{ zIndex: 50 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
