import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Activity, Pill, Calendar, FlaskConical, Stethoscope, Download } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Patient } from '@/lib/types';
import toast from 'react-hot-toast';

export function RiskBar({ score }: { score: number }) {
  const isHigh = score >= 70;
  const isMed = score >= 40 && score < 70;
  const color = isHigh ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between items-center text-xs font-medium text-slate-600">
        <span>Risk Score</span>
        <span className="font-bold text-slate-900">{score}/100</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

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
            <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
            <Badge tone={patient.status === 'Critical' ? 'error' : patient.status === 'Observation' || patient.status === 'Attention Needed' ? 'warning' : 'success'}>
              {patient.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {patient.age} yrs · {patient.gender} · Blood Type {patient.bloodType || patient.bloodGroup} · ID: {patient.id}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {patient.conditions.map((c) => (
              <span key={c} className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-md">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <RiskBar score={patient.riskScore} />
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Primary Doctor</span>
          <p className="text-sm font-bold text-slate-900 mt-1">{patient.primaryDoctor || 'Dr. Sarah Jenkins'}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500">Last Report Uploaded</span>
          <p className="text-sm font-bold text-slate-900 mt-1">{patient.lastReportDate || patient.lastVisit}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-5 rounded-2xl space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" />
          <h3 className="font-bold text-[#9EFFBF]">AI Multi-Agent Clinical Consensus</h3>
        </div>
        <p className="text-sm text-[#9EFFBF]/80 leading-relaxed font-['Public_Sans']">{aiSummary}</p>
        <div className="pt-2 flex justify-between items-center border-t border-[#9EFFBF]/20 text-xs text-[#9EFFBF]/60">
          <span>Validated by 4 Agents (Diagnosis, Rx, Imaging, Lab)</span>
          <Button
            size="sm"
            variant="outline"
            className="border-[#9EFFBF]/40 text-[#9EFFBF] hover:bg-[#9EFFBF]/10 text-xs py-1"
            onClick={() => toast.success(`Exported complete summary for ${patient.name}`)}
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Export EMR
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Patient Medical Timeline</h3>
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
          {timeline.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative">
                <div className={`absolute -left-[31px] top-0 h-6 w-6 rounded-full ${item.tone} text-white flex items-center justify-center`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-mono">{item.date}</span>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
