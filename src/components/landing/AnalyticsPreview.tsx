import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from './Features';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { analyticsData } from '@/lib/dummyData';

export function AnalyticsPreview() {
  return (
    <section id="analytics" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionHeading eyebrow="Analytics" title="See your hospital think in real time" subtitle="Interactive dashboards turn raw clinical signals into decisions." />
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Weekly scan volume</h3>
          <p className="text-xs text-slate-500 mb-4">Critical cases highlighted in red</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analyticsData.weeklyScans}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
              <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
              <Tooltip cursor={{ fill: 'rgba(148,163,184,0.1)' }} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(15,23,42,0.12)' }} />
              <Bar dataKey="scans" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="critical" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Department load</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={analyticsData.departmentLoad} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {analyticsData.departmentLoad.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {analyticsData.departmentLoad.map((d) => (
              <span key={d.name} className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} /> {d.name}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6 lg:col-span-3">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">AI diagnostic accuracy trend</h3>
          <p className="text-xs text-slate-500 mb-4">Rolling 7-month accuracy across all agents</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData.aiAccuracy}>
              <defs>
                <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
              <YAxis domain={[80, 100]} axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Area type="monotone" dataKey="accuracy" stroke="#06b6d4" strokeWidth={3} fill="url(#acc)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  );
}

export function CTA() {
  const navigate = useNavigate();
  return (
    <section className="relative py-24 px-4 sm:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden p-12 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <motion.div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ready to deploy autonomous healthcare?</h2>
          <p className="mt-3 text-blue-50 max-w-xl mx-auto">Join the agentic AI era. Spin up your dashboard in under a minute.</p>
          <Button size="lg" variant="secondary" className="mt-8" onClick={() => navigate('/signup')} rightIcon={<ArrowRight className="h-5 w-5" />}>
            Get Started Free
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
