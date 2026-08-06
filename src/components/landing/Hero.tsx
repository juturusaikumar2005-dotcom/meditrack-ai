import { motion } from 'framer-motion';
import { Activity, Brain, HeartPulse, Shield, Sparkles, TrendingUp, Play, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-36 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Agentic AI · 9 Autonomous Agents · 97% Diagnostic Accuracy
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
            <span className="gradient-text">MEDITRACK</span>
            <br />
            <span className="text-slate-900 dark:text-white">AI Platform</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            The AI-powered autonomous healthcare decision platform. Diagnose, prescribe, monitor and orchestrate hospital workflows with a multi-agent intelligence layer.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate('/signup')} rightIcon={<ArrowRight className="h-5 w-5" />}>
              Get Started
            </Button>
            <Button size="lg" variant="glass" leftIcon={<Play className="h-4 w-4" />}>
              Watch Demo
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { label: 'Patients managed', value: '240K+' },
              { label: 'AI accuracy', value: '97%' },
              { label: 'Avg response', value: '0.8s' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <div className="text-2xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <HeroDashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}

function HeroDashboardPreview() {
  return (
    <div className="relative">
      <motion.div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 blur-2xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <div className="relative glass-strong rounded-3xl p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="text-xs font-semibold text-slate-400">meditrack.ai/dashboard</div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: HeartPulse, label: 'Patients', value: '12,480', tone: 'from-blue-500 to-blue-600' },
            { icon: Activity, label: "Today's Scans", value: '318', tone: 'from-cyan-500 to-cyan-600' },
            { icon: Brain, label: 'AI Accuracy', value: '97.2%', tone: 'from-emerald-500 to-emerald-600' },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              className="rounded-xl bg-white/70 dark:bg-white/5 p-3 border border-white/40 dark:border-white/5"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
            >
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${c.tone} flex items-center justify-center mb-2`}>
                <c.icon className="h-4 w-4 text-white" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{c.value}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{c.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl bg-white/70 dark:bg-white/5 p-4 border border-white/40 dark:border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Agent Orchestration</span>
            <span className="text-[10px] text-emerald-600 font-semibold">● Live</span>
          </div>
          <div className="space-y-2.5">
            {[
              { name: 'Diagnosis Agent', pct: 100, status: 'Completed' },
              { name: 'Prescription Agent', pct: 64, status: 'Executing' },
              { name: 'Drug Interaction Agent', pct: 22, status: 'Thinking' },
            ].map((a, i) => (
              <div key={a.name}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{a.name}</span>
                  <span className="text-slate-400">{a.status}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${a.pct}%` }}
                    transition={{ duration: 1.2, delay: 0.5 + i * 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="absolute -bottom-5 -right-5 glass-strong rounded-2xl p-3 shadow-xl flex items-center gap-2"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Shield className="h-5 w-5 text-emerald-600" />
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Risk Alert</div>
            <div className="text-[10px] text-slate-500">Elena V. · SpO₂ 92%</div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -top-5 -left-5 glass-strong rounded-2xl p-3 shadow-xl flex items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity }}
        >
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">+24%</div>
            <div className="text-[10px] text-slate-500">Throughput</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
