import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, LayoutDashboard, Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Agents', href: '#agents' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function LandingNav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl"
    >
      <nav className="glass rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
        <Link to="/app/dashboard" className="flex items-center gap-2 font-extrabold text-lg">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="gradient-text">MEDITRACK</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-white/50 dark:hover:bg-white/5">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={toggle} className="p-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors" aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/signin')}>Sign In</Button>
          <Button size="sm" rightIcon={<LayoutDashboard className="h-4 w-4" />} onClick={() => navigate('/signup')}>Get Started</Button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-white/60 dark:hover:bg-white/10">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-white/60 dark:hover:bg-white/10">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-strong rounded-2xl mt-2 p-4 space-y-1"
        >
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 font-medium">
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/signin')}>Sign In</Button>
            <Button size="sm" fullWidth onClick={() => navigate('/signup')}>Get Started</Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
