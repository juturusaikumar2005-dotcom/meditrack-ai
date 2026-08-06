import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  LayoutDashboard,
  Upload,
  BrainCircuit,
  MessageSquare,
  History,
  Stethoscope,
  Bell,
  User,
  Settings,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const items = [
  { label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard, hint: 'Personal health overview' },
  { label: 'Upload Reports', to: '/app/upload', icon: Upload, hint: 'Ingest PDF, DICOM, blood test' },
  { label: 'AI Analysis', to: '/app/ai-analysis', icon: BrainCircuit, hint: 'Parsed lab findings' },
  { label: 'Health Timeline', to: '/app/history', icon: History, hint: 'Historical lab trends' },
  { label: 'Ask MediTrack AI', to: '/app/chat', icon: MessageSquare, hint: 'Clinical chat assistant' },
  { label: 'Specialist Recommendations', to: '/app/patients', icon: Stethoscope, hint: 'Find accredited doctors' },
  { label: 'Notifications', to: '/app/notifications', icon: Bell, hint: 'Vital alerts' },
  { label: 'Profile', to: '/app/profile', icon: User, hint: 'Account details' },
  { label: 'Settings', to: '/app/settings', icon: Settings, hint: 'Platform preferences' },
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const filtered = useMemo(
    () => items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === 'Enter' && filtered[active]) {
        navigate(filtered[active].to);
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, active, navigate, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-start justify-center pt-[15vh] p-4 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-[#111827]/40 backdrop-blur-xs" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, y: -10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -10, opacity: 0 }}
            className="bg-white border border-[#3A3A38]/20 relative w-full max-w-xl rounded-[16px] shadow-2xl overflow-hidden font-['Public_Sans']"
          >
            <div className="flex items-center gap-3 px-4 h-14 border-b border-[#3A3A38]/20 bg-[#F7F7F5]">
              <Search className="h-5 w-5 text-[#1A3C2B]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search reports, lab values, or specialists…"
                className="flex-1 bg-transparent outline-none text-sm text-[#111827] placeholder:text-[#3A3A38]/60"
              />
              <kbd className="text-[10px] font-['JetBrains_Mono'] text-[#3A3A38] bg-white px-1.5 py-0.5 rounded-[10px] border border-[#3A3A38]/20">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 && (
                <p className="p-6 text-center text-xs text-[#3A3A38]">No results found for "{query}"</p>
              )}
              {filtered.map((item, i) => (
                <button
                  key={item.to}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    navigate(item.to);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-left transition-colors cursor-pointer ${
                    i === active
                      ? 'bg-[#1A3C2B] text-white font-semibold'
                      : 'hover:bg-[#F7F7F5] text-[#111827]'
                  }`}
                >
                  <item.icon className={`h-4 w-4 shrink-0 ${i === active ? 'text-[#9EFFBF]' : 'text-[#1A3C2B]'}`} />
                  <span className="flex-1 text-xs font-semibold">{item.label}</span>
                  <span className={`text-[11px] font-['JetBrains_Mono'] ${i === active ? 'text-slate-300' : 'text-[#3A3A38]'}`}>
                    {item.hint}
                  </span>
                  <ArrowRight className={`h-3.5 w-3.5 ${i === active ? 'text-[#9EFFBF]' : 'text-transparent'}`} />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
