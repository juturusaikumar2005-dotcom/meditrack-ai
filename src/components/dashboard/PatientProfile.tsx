import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Activity, Pill, Calendar, FlaskConical, Stethoscope, Download } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RiskBar } from '@/pages/DashboardPage';
import type { Patient } from '@/lib/types';
import toast from 'react-hot-toast';

const timeline = [
  { date: 'Aug 5, 2026', title: 'CT Scan analyzed', desc: 'AI flagged renal morphology irregularity · 91% confidence', icon: Activity, tone: 'bg-blue-500' },
  { date: 'Aug 2, 2026', title: 'Prescription updated', desc: 'Metformin dose adjusted based on glucose trend', icon: Pill, tone: 'bg-emerald-500' },
  { date: 'Jul 28, 2026', title: 'Lab test — blood panel', desc: 'Hemoglobin low; iron deficiency flagged', icon: FlaskConical, tone: 'bg-amber-500' },
  { date: 'Jul 20, 2026', title: 'Consultation', desc: 'Dr. Reyes — reviewed treatment plan', icon: Stethoscope, tone: 'bg-cyan-500' },
  { date: 'Jul 10, 2026', title: 'Admitted', desc: 'Initial intake & vitals captured', icon: FileText, tone: 'bg-slate-500' },
];

export function PatientProfile({ patient }: { patient: Patient }) {
  const aiSummary = `${patient.name} is a ${patient.age}-year-old ${patient.gender.toLowerCase()} with ${patient.conditions.join(', ').toLowerCase()}. Current risk score is ${patient.riskScore}/100, classified as ${patient.status.toLowerCase()}. The Diagnosis Agent recommends continued monitoring of vitals with weekly lab tests. The Prescription Agent has flagged no active drug interactions.`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">{patient.avatar}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{patient.name}</h3>
            <Badge tone={patient.status === 'Critical' ? 'error' : 'success'} dot>{patient.status}</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">{patient.age} years · {patient.gender} · Blood {patient.bloodGroup}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {patient.conditions.map((c) => <Badge key={c} tone="primary">{c}</Badge>)}
          </div>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />} onClick={() => toast('Exporting patient record…')}>Export</Button>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        {[
          { label: 'Heart Rate', value: `${patient.vitals.heartRate}`, unit: 'bpm', tone: 'text-blue-600' },
          { label: 'Blood Pressure', value: patient.vitals.bloodPressure, unit: 'mmHg', tone: 'text-cyan-600' },
          { label: 'Temperature', value: `${patient.vitals.temperature}`, unit: '°F', tone: 'text-amber-600' },
          { label: 'Oxygen Sat.', value: `${patient.vitals.oxygen}`, unit: '%', tone: 'text-emerald-600' },
        ].map((v) => (
          <div key={v.label} className="rounded-xl glass p-3 text-center">
            <div className={`text-2xl font-extrabold ${v.tone}`}>{v.value}</div>
            <div className="text-xs text-slate-500">{v.unit}</div>
            <div className="text-[10px] text-slate-400 mt-1">{v.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-slate-700 dark:text-slate-200">AI Risk Score</span><span className="font-bold text-slate-900 dark:text-white">{patient.riskScore}/100</span></div>
        <RiskBar score={patient.riskScore} />
      </div>

      <div className="rounded-xl glass p-4 border-l-4 border-blue-500">
        <div className="flex items-center gap-2 mb-2">
          <Stethoscope className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">AI Summary</span>
          <Badge tone="accent">Generated</Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{aiSummary}</p>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Medical Timeline</h4>
        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-white/10">
          {timeline.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="relative">
              <div className={`absolute -left-4 mt-1 h-3 w-3 rounded-full ${t.tone} ring-4 ring-white dark:ring-slate-900`} />
              <div className="text-xs text-slate-400">{t.date}</div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5">{t.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
