import { motion } from 'framer-motion';
import {
  Brain, HeartPulse, FileText, Activity, Pill, Clock,
  Mic, TrendingUp, Lightbulb, BellRing, Building2, Shield,
} from 'lucide-react';

const features = [
  { icon: Brain, title: 'Agentic AI', desc: '9 autonomous agents orchestrate diagnosis, prescription & operations in real time.' },
  { icon: HeartPulse, title: 'Medical Intelligence', desc: 'Cross-references 3,200+ disease vectors with live vitals and patient history.' },
  { icon: FileText, title: 'Autonomous Reports', desc: 'Generate structured AI reports with confidence scores and severity grading.' },
  { icon: Activity, title: 'Real-Time Monitoring', desc: 'Stream vitals from bedside devices with anomaly detection and trend analysis.' },
  { icon: Pill, title: 'Drug Analysis', desc: 'Detect interactions, contraindications and optimize dosage automatically.' },
  { icon: Clock, title: 'Patient Timeline', desc: 'A unified chronological view of every event, scan, prescription and note.' },
  { icon: Mic, title: 'Voice Assistant', desc: 'Speak naturally to query records, draft notes and trigger agent workflows.' },
  { icon: TrendingUp, title: 'Predictive Analytics', desc: 'Forecast risk, readmission and resource demand before it happens.' },
  { icon: Lightbulb, title: 'AI Recommendations', desc: 'Evidence-based next-best-actions surfaced contextually to clinicians.' },
  { icon: BellRing, title: 'Smart Alerts', desc: 'Threshold-aware notifications routed to the right person at the right time.' },
  { icon: Building2, title: 'Hospital Dashboard', desc: 'Live bed capacity, staff load and department-level throughput metrics.' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Granular permissions for patients, doctors, labs and administrators.' },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionHeading
        eyebrow="Capabilities"
        title="Everything a modern hospital needs, autonomous by default"
        subtitle="Twelve production-grade modules working as one intelligent system."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="group glass rounded-2xl p-6 hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition-shadow"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <f.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center max-w-2xl mx-auto mb-14"
    >
      <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">{eyebrow}</span>
      <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</h2>
      {subtitle && <p className="mt-4 text-slate-600 dark:text-slate-300">{subtitle}</p>}
    </motion.div>
  );
}
